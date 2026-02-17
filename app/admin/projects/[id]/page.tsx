import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CommentList } from "@/components/dashboard/comment-list";
import { InvoiceTable } from "@/components/dashboard/invoice-table";
import { AdminProjectActions } from "@/components/admin/admin-project-actions";
import Link from "next/link";

async function getProject(id: string) {
  const cookieStore = cookies();
  const response = await fetch(
    `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/projects/${id}`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}

async function getComments(projectId: string) {
  const cookieStore = cookies();
  const response = await fetch(
    `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/projects/${projectId}/comments`,
    {
      cache: "no-store",
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
}

async function getInvoices(projectId: string) {
  const response = await fetch(
    `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/api/invoices?projectId=${projectId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch invoices");
  }

  return response.json();
}

export default async function AdminProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    redirect("/login");
  }

  const { project } = await getProject(params.id);
  const { comments } = await getComments(params.id);
  const { invoices } = await getInvoices(params.id);

  const serviceLabels = {
    brand: "Brand dizajn",
    web: "Web dizajn",
    tlac: "Tlač a montáž",
  };

  const clientTypeLabels = {
    novy: "Nový klient",
    existujuci: "Existujúci klient",
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              ← Späť na admin panel
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Projekt #{project.id}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={project.status} />
            <Badge variant="outline">
              {serviceLabels[project.service as keyof typeof serviceLabels]}
            </Badge>
            <Badge variant="outline">
              {
                clientTypeLabels[
                  project.clientType as keyof typeof clientTypeLabels
                ]
              }
            </Badge>
          </div>
        </div>

        <AdminProjectActions projectId={params.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project details */}
          <Card>
            <CardHeader>
              <CardTitle>Detaily projektu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.notes && (
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Poznámky
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {project.notes}
                  </p>
                </div>
              )}

              {project.items && project.items.length > 0 && (
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Položky
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.items.map((item: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {project.styleTags && project.styleTags.length > 0 && (
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Štýly
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.styleTags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {project.colors && project.colors.length > 0 && (
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Farby
                  </h4>
                  <div className="flex gap-2">
                    {project.colors.map((color: string, index: number) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-600"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {project.links && project.links.length > 0 && (
                <div>
                  <h4 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Inšpirácie
                  </h4>
                  <div className="space-y-1">
                    {project.links.map((link: string, index: number) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#d1fa1a] hover:text-[#d1fa1a]/80 block"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Komentáre</CardTitle>
              <CardDescription>Komunikácia ohľadom projektu</CardDescription>
            </CardHeader>
            <CardContent>
              <CommentList
                comments={comments}
                projectId={params.id}
                currentUser={session.user}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status management */}
          <Card>
            <CardHeader>
              <CardTitle>Spravovať status</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusManager
                projectId={params.id}
                currentStatus={project.status}
              />
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card>
            <CardHeader>
              <CardTitle>Kontaktné informácie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {project.contactName}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {project.contactEmail}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {project.contactPhone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project info */}
          <Card>
            <CardHeader>
              <CardTitle>Informácie o projekte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Vytvorené:
                </span>
                <span className="text-neutral-900 dark:text-white">
                  {new Date(project.createdAt).toLocaleDateString("sk-SK")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Aktualizované:
                </span>
                <span className="text-neutral-900 dark:text-white">
                  {new Date(project.updatedAt).toLocaleDateString("sk-SK")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600 dark:text-neutral-400">
                  Klient:
                </span>
                <span className="text-neutral-900 dark:text-white">
                  {project.user.username}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Faktúry</CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceTable invoices={invoices} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatusManager({
  projectId,
  currentStatus,
}: {
  projectId: string;
  currentStatus: string;
}) {
  const statusOptions = [
    { value: "brief", label: "Brief" },
    { value: "concept", label: "Koncept" },
    { value: "iteration", label: "Iterácie" },
    { value: "feedback", label: "Feedback" },
    { value: "delivered", label: "Dodané" },
    { value: "archived", label: "Archivované" },
  ];

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
