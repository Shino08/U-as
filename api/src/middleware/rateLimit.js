// In-memory sliding-window rate limiter for appointment bookings
const requestsMap = new Map();

export const appointmentRateLimiter = (options = { windowMs: 15 * 60 * 1000, max: 5 }) => {
  return (req, res, next) => {
    // Determine client IP
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown-client";

    const now = Date.now();
    const timestamps = requestsMap.get(clientIp) || [];
    const recent = timestamps.filter((t) => now - t < options.windowMs);

    if (recent.length >= options.max) {
      const oldest = recent[0];
      const retryAfterSec = Math.ceil((oldest + options.windowMs - now) / 1000);
      const retryAfterMin = Math.ceil(retryAfterSec / 60);

      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        error: `Has superado el límite de citas permitidas por hora. Por favor espera ${retryAfterMin} minuto(s) antes de intentar agendar nuevamente.`,
        retryAfter: retryAfterSec,
      });
    }

    recent.push(now);
    requestsMap.set(clientIp, recent);

    // Prune stale records
    if (requestsMap.size > 2000) {
      for (const [ip, list] of requestsMap.entries()) {
        if (list.every((t) => now - t >= options.windowMs)) {
          requestsMap.delete(ip);
        }
      }
    }

    next();
  };
};
