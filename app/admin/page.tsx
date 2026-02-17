import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectCard } from "@/components/dashboard/project-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { cookies } from "next/headers";

async function getProjects(status?: string, service?: string) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (service) params.append("service", service);

  const cookieStore = cookies();
  const response = await fetch(
    `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/projects?${params}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { status?: string; service?: string };
}) {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { projects } = await getProjects(
    searchParams.status,
    searchParams.service
  );

  // Group projects by status
  const projectsByStatus = projects.reduce((acc: any, project: any) => {
    if (!acc[project.status]) {
      acc[project.status] = [];
    }
    acc[project.status].push(project);
    return acc;
  }, {});

  const statusOrder = [
    "brief",
    "concept",
    "iteration",
    "feedback",
    "delivered",
    "archived",
  ];
  const statusLabels = {
    brief: "Brief",
    concept: "Koncept",
    iteration: "Iterácie",
    feedback: "Feedback",
    delivered: "Dodané",
    archived: "Archivované",
  };

  const serviceLabels = {
    brand: "Brand dizajn",
    web: "Web dizajn",
    tlac: "Tlač a montáž",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Admin panel
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Spravujte všetky projekty a klientov
          </p>
        </div>

        <Link href="/admin/projects/new">
          <button className="px-4 py-2 bg-[#d1fa1a] text-black font-semibold rounded-lg hover:bg-[#d1fa1a]/90">
            Nový projekt
          </button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtre</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                Status
              </label>
              <Select defaultValue={searchParams.status || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Všetky statusy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky statusy</SelectItem>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
                Služba
              </label>
              <Select defaultValue={searchParams.service || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder="Všetky služby" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky služby</SelectItem>
                  {Object.entries(serviceLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Celkom projektov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {projects.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Aktívne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {
                projects.filter(
                  (p: any) => !["delivered", "archived"].includes(p.status)
                ).length
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Čakajúce na feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {projects.filter((p: any) => p.status === "feedback").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Dokončené
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white">
              {projects.filter((p: any) => p.status === "delivered").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects by status */}
      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                Žiadne projekty
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                Zatiaľ neboli vytvorené žiadne projekty.
              </p>
              <Link href="/admin/projects/new">
                <button className="px-4 py-2 bg-[#d1fa1a] text-black font-semibold rounded-lg hover:bg-[#d1fa1a]/90">
                  Vytvoriť prvý projekt
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {statusOrder.map((status) => {
            const statusProjects = projectsByStatus[status] || [];
            if (statusProjects.length === 0) return null;

            return (
              <div key={status}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {statusLabels[status as keyof typeof statusLabels]}
                  </h2>
                  <Badge variant="secondary">{statusProjects.length}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {statusProjects.map((project: any) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isAdmin={true}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
