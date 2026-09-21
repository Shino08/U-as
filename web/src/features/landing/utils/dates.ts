import type { LandingDate } from "../types";

export function getUpcomingDates(): LandingDate[] {
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const dates: LandingDate[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const fullDate = `${year}-${month}-${day}`;

    const label = i === 0 ? "Hoy" : i === 1 ? "Mañana" : dayNames[d.getDay()];
    const shortLabel = i === 0 ? "Hoy" : i === 1 ? "Mañ" : dayNames[d.getDay()];
    const dateNumber = String(d.getDate());

    dates.push({ label, shortLabel, dateNumber, fullDate });
  }
  return dates;
}
