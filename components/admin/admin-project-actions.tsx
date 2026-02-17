"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

interface AdminProjectActionsProps {
  projectId: string;
}

export function AdminProjectActions({ projectId }: AdminProjectActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    amount: "",
    notes: "",
  });
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!invoiceData.amount) return;

    setIsCreatingInvoice(true);
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: parseInt(projectId),
          amount: parseFloat(invoiceData.amount),
          notes: invoiceData.notes,
        }),
      });

      if (response.ok) {
        setInvoiceData({ amount: "", notes: "" });
        window.location.reload();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsCreatingInvoice(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Pridať faktúru</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nová faktúra</DialogTitle>
            <DialogDescription>
              Vytvorte novú faktúru pre tento projekt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Suma (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={invoiceData.amount}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, amount: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="notes">Poznámky</Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, notes: e.target.value })
                }
                placeholder="Voliteľné poznámky..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleCreateInvoice}
              disabled={isCreatingInvoice || !invoiceData.amount}
              className="bg-[#d1fa1a] text-black hover:bg-[#d1fa1a]/90"
            >
              {isCreatingInvoice ? "Vytvára sa..." : "Vytvoriť faktúru"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Zmazať projekt</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ste si istí?</AlertDialogTitle>
            <AlertDialogDescription>
              Táto akcia je nevratná. Projekt bude natrvalo zmazaný spolu so
              všetkými komentármi a faktúrami.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Maže sa..." : "Zmazať projekt"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
