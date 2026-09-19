import { sequelize } from "./config/database.js";
import { User, Service } from "./models/index.js";

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync();
    console.log("Models synced");

    const [admin, created] = await User.findOrCreate({
      where: { email: "admin@lumierenails.com" },
      defaults: {
        name: "Admin Lumière",
        password: "Password123!",
        role: "admin",
      },
    });

    if (created) {
      console.log("Admin user created:", admin.email);
    } else {
      console.log("Admin user already exists:", admin.email);
    }

    const defaultServices = [
      {
        name: "Manicura Rusa & Nivelación Rubber",
        description:
          "Limpieza profunda con torno de alta precisión, cutícula impecable y base niveladora con reflejo de luz perfecto por 21+ días.",
        price: 32,
        duration: 50,
        category: "Manicura",
        tag: "Esencial",
        image: "service-classic.jpg",
        features: ["Técnica de alta precisión", "Materiales hipoalergénicos", "Sellado de larga duración"],
        active: true,
      },
      {
        name: "Nail Art 3D & Relieves de Autor",
        description:
          "Diseños tridimensionales con flores en acrílico, cristalería facetada y trazos botánicos a mano alzada.",
        price: 58,
        duration: 90,
        category: "Nail Art",
        tag: "Signature",
        image: "service-art.jpg",
        features: ["Técnica de alta precisión", "Materiales hipoalergénicos", "Sellado de larga duración"],
        active: true,
      },
      {
        name: "Extensiones Esculturales en Hard Gel",
        description:
          "Alargamiento con molde para una estructura arquitectónica natural, ligera y ultra resistente.",
        price: 75,
        duration: 120,
        category: "Extensiones",
        tag: "Alta Gama",
        image: "service-gel.jpg",
        features: ["Técnica de alta precisión", "Materiales hipoalergénicos", "Sellado de larga duración"],
        active: true,
      },
      {
        name: "Pedicura Spa & Jelly Relax",
        description:
          "Exfoliación botánica profunda con sales minerales, mascarilla humectante caliente y esmaltado en gel de alto brillo.",
        price: 45,
        duration: 60,
        category: "Pedicura",
        tag: "Bienestar",
        image: "service-classic.jpg",
        features: ["Técnica de alta precisión", "Materiales hipoalergénicos", "Sellado de larga duración"],
        active: true,
      },
    ];

    for (const svc of defaultServices) {
      const [existing] = await Service.findOrCreate({
        where: { name: svc.name },
        defaults: svc,
      });
      if (existing) {
        await existing.update(svc);
      }
    }
    console.log("Default services verified/seeded with images and metadata");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
