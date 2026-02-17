import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

const statusConfig = {
  brief: {
    label: "Brief",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  concept: {
    label: "Koncept",
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  },
  iteration: {
    label: "Iterácie",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  feedback: {
    label: "Feedback",
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  },
  delivered: {
    label: "Dodané",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  archived: {
    label: "Archivované",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config =
    statusConfig[status as keyof typeof statusConfig] || statusConfig.brief;

  return <Badge className={config.className}>{config.label}</Badge>;
}
