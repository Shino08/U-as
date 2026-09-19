import { Landing } from "../models/index.js";

const defaultContent = {
  hero: {
    title: "Nail Studio",
    subtitle: "Tu belleza, nuestra pasion",
    cta: "Reserva tu cita",
  },
  about: {
    title: "Sobre Nosotros",
    description: "Somos un estudio de manucura y pedicura dedicado a realzar tu belleza natural.",
  },
  contact: {
    phone: "",
    email: "",
    address: "",
    hours: "",
  },
};

export const getLandingContent = async (_req, res) => {
  try {
    const sections = await Landing.findAll();
    const content = {};

    for (const section of sections) {
      content[section.section] = section.content;
    }

    res.json(Object.keys(content).length ? content : defaultContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLandingContent = async (req, res) => {
  try {
    const updates = req.body;

    for (const [section, content] of Object.entries(updates)) {
      await Landing.upsert({ section, content });
    }

    const sections = await Landing.findAll();
    const content = {};
    for (const section of sections) {
      content[section.section] = section.content;
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
