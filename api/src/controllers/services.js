import { Service } from "../models/index.js";

export const getServices = async (req, res) => {
  try {
    const showAll = req.query.all === "true";
    const where = showAll ? {} : { active: true };
    const services = await Service.findAll({ where, order: [["id", "ASC"]] });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category, image, tag, features } = req.body;
    const service = await Service.create({
      name,
      description,
      price,
      duration,
      category,
      image,
      tag,
      features: features || [
        "Técnica de alta precisión",
        "Materiales hipoalergénicos",
        "Sellado de larga duración",
      ],
      active: true,
    });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    await service.update(req.body);
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    await service.destroy();
    res.status(204).send();
  } catch (error) {
    // If foreign key constraint prevents deletion (e.g. appointments reference this service),
    // fall back to deactivation and inform the client
    if (
      error.name === "SequelizeForeignKeyConstraintError" ||
      (error.original && error.original.code === "23503")
    ) {
      try {
        const service = await Service.findByPk(req.params.id);
        if (service) await service.destroy({ force: true }).catch(() => service.update({ active: false }));
      } catch {}
      return res.status(409).json({
        error:
          "Este servicio tiene citas asociadas y no puede eliminarse por completo. Fue desactivado en su lugar.",
      });
    }
    res.status(500).json({ error: error.message });
  }
};
