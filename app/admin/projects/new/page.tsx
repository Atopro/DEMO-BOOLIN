import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NewProjectForm } from "@/components/admin/new-project-form";

async function getUsers() {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/admin/users`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export default async function NewProjectPage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { users } = await getUsers();
  const clients = users.filter((user: any) => user.role === "client");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <a
              href="/admin"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              ← Späť na admin panel
            </a>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Nový projekt
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Vytvorte nový projekt pre klienta
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <NewProjectForm clients={clients} />
      </div>
    </div>
  );
}
