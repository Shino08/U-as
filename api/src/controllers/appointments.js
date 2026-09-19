import { Appointment, Service, User } from "../models/index.js";

export const getAppointments = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === "admin";
    const where = isAdmin ? {} : { userId: req.user.id };

    const appointments = await Appointment.findAll({
      where,
      include: [
        { model: Service },
        { model: User, attributes: ["id", "name", "email"] },
      ],
      order: [["date", "DESC"]],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const {
      serviceId,
      date,
      appointmentDate,
      appointmentTime,
      notes,
      customerNotes,
      clientName,
      customerName,
      clientEmail,
      customerEmail,
      clientPhone,
      customerPhone,
      totalPrice,
      addons,
    } = req.body;

    // Resolve date
    let appointmentDateTime = date;
    if (!appointmentDateTime && appointmentDate) {
      appointmentDateTime = appointmentTime
        ? new Date(`${appointmentDate} ${appointmentTime}`)
        : new Date(appointmentDate);
    }

    // Resolve service
    let resolvedService = null;
    if (serviceId) {
      if (typeof serviceId === "number" || !isNaN(Number(serviceId))) {
        resolvedService = await Service.findByPk(Number(serviceId));
      } else {
        resolvedService = await Service.findOne({
          where: { name: serviceId },
        });
      }
    }

    // Fallback to first active service if ID wasn't found
    if (!resolvedService) {
      resolvedService = await Service.findOne({ where: { active: true } });
    }

    if (!resolvedService) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    const appointment = await Appointment.create({
      userId: req.user ? req.user.id : null,
      clientName: clientName || customerName || (req.user ? req.user.name : "Cliente"),
      clientEmail: clientEmail || customerEmail || (req.user ? req.user.email : ""),
      clientPhone: clientPhone || customerPhone || "",
      serviceId: resolvedService.id,
      date: appointmentDateTime || new Date(),
      notes: notes || customerNotes || "",
      totalPrice: totalPrice || resolvedService.price,
      addons: addons || [],
      status: "pending",
    });

    const populated = await Appointment.findByPk(appointment.id, {
      include: [{ model: Service }],
    });

    res.status(201).json(populated || appointment);
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === "admin";
    const where = isAdmin
      ? { id: req.params.id }
      : { id: req.params.id, userId: req.user.id };

    const appointment = await Appointment.findOne({ where });
    if (!appointment) return res.status(404).json({ error: "Cita no encontrada" });

    await appointment.update(req.body);
    const updated = await Appointment.findByPk(appointment.id, {
      include: [{ model: Service }, { model: User, attributes: ["id", "name", "email"] }],
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === "admin";
    const where = isAdmin
      ? { id: req.params.id }
      : { id: req.params.id, userId: req.user.id };

    const appointment = await Appointment.findOne({ where });
    if (!appointment) return res.status(404).json({ error: "Cita no encontrada" });

    await appointment.update({ status: "cancelled" });
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
