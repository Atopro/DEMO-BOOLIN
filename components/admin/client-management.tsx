"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ClientManagement() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "client",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Používateľ bol úspešne vytvorený!");
        setFormData({ username: "", password: "", role: "client" });
        // Refresh the page to show the new user
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const error = await response.json();
        setMessage(error.error || "Chyba pri vytváraní používateľa");
      }
    } catch (error) {
      setMessage("Chyba pri vytváraní používateľa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="username">Používateľské meno</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="Zadajte používateľské meno"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Heslo</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="Zadajte heslo"
            required
          />
        </div>

        <div>
          <Label htmlFor="role">Rola</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="client">Klient</SelectItem>
              <SelectItem value="admin">Administrátor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {message && (
        <div
          className={`text-sm ${
            message.includes("úspešne") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#d1fa1a] text-black hover:bg-[#d1fa1a]/90"
      >
        {isSubmitting ? "Vytvára sa..." : "Vytvoriť používateľa"}
      </Button>
    </form>
  );
}
