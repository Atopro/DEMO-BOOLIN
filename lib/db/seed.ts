import { db, users, projects } from "./index";
import { hashPassword } from "../auth-helpers";

export async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const adminUser = await db
      .insert(users)
      .values({
        username: "admin",
        password: adminPassword,
        role: "admin",
      })
      .returning();

    console.log("✅ Admin user created:", adminUser[0].username);

    // Create sample client user
    const clientPassword = await hashPassword("client123");
    const clientUser = await db
      .insert(users)
      .values({
        username: "client1",
        password: clientPassword,
        role: "client",
      })
      .returning();

    console.log("✅ Client user created:", clientUser[0].username);

    // Create sample projects
    const sampleProjects = [
      {
        userId: clientUser[0].id,
        status: "brief" as const,
        clientType: "novy" as const,
        service: "brand" as const,
        styleTags: ["Minimal", "Elegantný"],
        colors: ["#d1fa1a", "#111111", "#ffffff"],
        items: ["Logo", "Vizitky", "Hlavičkový papier"],
        notes:
          "Potrebujeme novú identitu pre našu firmu. Chceme moderný a profesionálny dizajn.",
        links: [
          "https://dribbble.com/example1",
          "https://behance.net/example2",
        ],
        contactName: "Ján Novák",
        contactEmail: "jan.novak@example.com",
        contactPhone: "+421 900 123 456",
      },
      {
        userId: clientUser[0].id,
        status: "concept" as const,
        clientType: "existujuci" as const,
        service: "web" as const,
        styleTags: ["Tech", "Moderný"],
        colors: ["#0066cc", "#ffffff", "#333333"],
        items: ["Web stránka", "UI/UX"],
        notes:
          "Rozšírenie existujúcej webovej stránky o nové funkcie a modernizácia dizajnu.",
        links: ["https://example.com/inspiration"],
        contactName: "Mária Svobodová",
        contactEmail: "maria.svobodova@example.com",
        contactPhone: "+421 900 789 012",
      },
      {
        userId: clientUser[0].id,
        status: "delivered" as const,
        clientType: "novy" as const,
        service: "tlac" as const,
        styleTags: ["Odvážny", "Hravo-moderný"],
        colors: ["#ff6b35", "#ffffff", "#000000"],
        items: ["Banner", "Roll‑up", "Polep auta"],
        notes: "Kompletná reklamná kampaň pre spustenie nového produktu.",
        links: [],
        contactName: "Peter Kováč",
        contactEmail: "peter.kovac@example.com",
        contactPhone: "+421 900 345 678",
      },
    ];

    for (const projectData of sampleProjects) {
      const project = await db.insert(projects).values(projectData).returning();
      console.log(`✅ Sample project created: ${project[0].id}`);
    }

    console.log("🎉 Database seed completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
