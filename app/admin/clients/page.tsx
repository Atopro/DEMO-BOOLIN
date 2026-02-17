import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ClientManagement } from "@/components/admin/client-management";

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

export default async function ClientsPage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { users } = await getUsers();
  const clients = users.filter((user: any) => user.role === "client");
  const admins = users.filter((user: any) => user.role === "admin");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Správa klientov
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Spravujte používateľov a ich prístupy
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Celkom klientov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {clients.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Administrátori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {admins.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Celkom používateľov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {users.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add new user */}
      <Card>
        <CardHeader>
          <CardTitle>Pridať nového používateľa</CardTitle>
          <CardDescription>
            Vytvorte nový účet pre klienta alebo administrátora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientManagement />
        </CardContent>
      </Card>

      {/* Users list */}
      <div className="space-y-6">
        {/* Clients */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Klienti
          </h2>
          {clients.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <p className="text-neutral-500 dark:text-neutral-400">
                  Zatiaľ nie sú žiadni klienti.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client: any) => (
                <Card key={client.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#d1fa1a] text-black font-semibold">
                          {client.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {client.username}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          Klient
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          Vytvorené:{" "}
                          {new Date(client.createdAt).toLocaleDateString(
                            "sk-SK"
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Admins */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
            Administrátori
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.map((admin: any) => (
              <Card key={admin.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#d1fa1a] text-black font-semibold">
                        {admin.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {admin.username}
                        </p>
                        <Badge className="bg-[#d1fa1a] text-black text-xs">
                          ADMIN
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        Vytvorené:{" "}
                        {new Date(admin.createdAt).toLocaleDateString("sk-SK")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
