import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invoice {
  id: number;
  amount: number;
  status: string;
  fileUrl?: string;
  notes?: string;
  createdAt: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
}

const statusLabels = {
  draft: "Návrh",
  sent: "Odoslaná",
  paid: "Zaplatená",
};

const statusColors = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  sent: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
};

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
        Zatiaľ nie sú žiadne faktúry.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Číslo</TableHead>
            <TableHead>Suma</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Dátum</TableHead>
            <TableHead>Akcie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">#{invoice.id}</TableCell>
              <TableCell>
                {invoice.amount.toLocaleString("sk-SK", {
                  style: "currency",
                  currency: "EUR",
                })}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    statusColors[invoice.status as keyof typeof statusColors]
                  }
                >
                  {statusLabels[invoice.status as keyof typeof statusLabels]}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(invoice.createdAt).toLocaleDateString("sk-SK")}
              </TableCell>
              <TableCell>
                {invoice.fileUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={invoice.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Stiahnuť
                    </a>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
