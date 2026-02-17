import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  status: string;
  service: string;
  clientType: string;
  items: string[];
  notes: string;
  contactName: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
  isAdmin?: boolean;
}

const serviceLabels = {
  brand: "Brand dizajn",
  web: "Web dizajn",
  tlac: "Tlač a montáž",
};

const clientTypeLabels = {
  novy: "Nový klient",
  existujuci: "Existujúci klient",
};

export function ProjectCard({ project, isAdmin = false }: ProjectCardProps) {
  const serviceLabel =
    serviceLabels[project.service as keyof typeof serviceLabels] ||
    project.service;
  const clientTypeLabel =
    clientTypeLabels[project.clientType as keyof typeof clientTypeLabels] ||
    project.clientType;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Projekt #{project.id}</CardTitle>
            <CardDescription className="mt-1">
              {serviceLabel} • {clientTypeLabel}
            </CardDescription>
          </div>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {project.items.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Položky:
              </p>
              <div className="flex flex-wrap gap-1">
                {project.items.slice(0, 3).map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
                {project.items.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.items.length - 3} ďalších
                  </Badge>
                )}
              </div>
            </div>
          )}

          {project.notes && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.notes}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Kontakt: {project.contactName}</span>
            <span>
              {new Date(project.createdAt).toLocaleDateString("sk-SK")}
            </span>
          </div>

          <div className="pt-2">
            <Link
              href={
                isAdmin
                  ? `/admin/projects/${project.id}`
                  : `/dashboard/projects/${project.id}`
              }
              className="text-sm text-[#d1fa1a] hover:text-[#d1fa1a]/80 font-medium"
            >
              Zobraziť detail →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
