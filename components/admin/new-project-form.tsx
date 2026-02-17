"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: number;
  username: string;
  role: string;
}

interface NewProjectFormProps {
  clients: Client[];
}

export function NewProjectForm({ clients }: NewProjectFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    clientType: "novy",
    service: "brand",
    styleTags: [] as string[],
    colors: ["#d1fa1a", "#111111", "#ffffff"],
    items: [] as string[],
    notes: "",
    links: [""],
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const availableStyleTags = [
    "Minimal",
    "Odvážny",
    "Elegantný",
    "Hravo-moderný",
    "Monochromatický",
    "Neon / Lime",
    "Organický",
    "Tech",
  ];

  const availableItems = [
    "Logo",
    "Vizitky",
    "Hlavičkový papier",
    "Obálky",
    "Roll‑up",
    "Billboard",
    "Banner",
    "Web stránka",
  ];

  const handleStyleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      styleTags: prev.styleTags.includes(tag)
        ? prev.styleTags.filter((t) => t !== tag)
        : [...prev.styleTags, tag],
    }));
  };

  const handleItemToggle = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.includes(item)
        ? prev.items.filter((i) => i !== item)
        : [...prev.items, item],
    }));
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...formData.colors];
    newColors[index] = color;
    setFormData((prev) => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    setFormData((prev) => ({ ...prev, colors: [...prev.colors, "#000000"] }));
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index] = value;
    setFormData((prev) => ({ ...prev, links: newLinks }));
  };

  const addLink = () => {
    setFormData((prev) => ({ ...prev, links: [...prev.links, ""] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userId: parseInt(formData.userId),
          links: formData.links.filter((link) => link.trim() !== ""),
        }),
      });

      if (response.ok) {
        setMessage("Projekt bol úspešne vytvorený!");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        const error = await response.json();
        setMessage(error.error || "Chyba pri vytváraní projektu");
      }
    } catch (error) {
      setMessage("Chyba pri vytváraní projektu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vytvoriť nový projekt</CardTitle>
        <CardDescription>Vyplňte informácie o novom projekte</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client selection */}
          <div>
            <Label htmlFor="userId">Klient</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) =>
                setFormData({ ...formData, userId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Vyberte klienta" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    {client.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client type and service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientType">Typ klienta</Label>
              <Select
                value={formData.clientType}
                onValueChange={(value) =>
                  setFormData({ ...formData, clientType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novy">Nový klient</SelectItem>
                  <SelectItem value="existujuci">Existujúci klient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="service">Služba</Label>
              <Select
                value={formData.service}
                onValueChange={(value) =>
                  setFormData({ ...formData, service: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand">Brand dizajn</SelectItem>
                  <SelectItem value="web">Web dizajn</SelectItem>
                  <SelectItem value="tlac">Tlač a montáž</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Style tags */}
          <div>
            <Label>Štýly</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableStyleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleStyleTagToggle(tag)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    formData.styleTags.includes(tag)
                      ? "bg-[#d1fa1a] text-black border-transparent"
                      : "border-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <Label>Položky</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {availableItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleItemToggle(item)}
                  className={`px-3 py-1.5 rounded-full text-sm border ${
                    formData.items.includes(item)
                      ? "bg-[#d1fa1a] text-black border-transparent"
                      : "border-neutral-300 hover:bg-neutral-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label>Farby</Label>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {formData.colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border border-neutral-300"
                    style={{ backgroundColor: color }}
                  />
                  <Input
                    value={color}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                    className="w-24"
                    placeholder="#000000"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addColor}>
                + Pridať farbu
              </Button>
            </div>
          </div>

          {/* Links */}
          <div>
            <Label>Odkazy na inšpirácie</Label>
            <div className="space-y-2 mt-2">
              {formData.links.map((link, index) => (
                <Input
                  key={index}
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  placeholder="https://..."
                />
              ))}
              <Button type="button" variant="outline" onClick={addLink}>
                + Pridať odkaz
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Poznámky</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Poznámky k projektu..."
              rows={4}
            />
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contactName">Meno kontaktu</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) =>
                  setFormData({ ...formData, contactName: e.target.value })
                }
                placeholder="Ján Novák"
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">E-mail</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
                placeholder="jan@example.com"
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Telefón</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
                placeholder="+421 900 123 456"
              />
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
            disabled={isSubmitting || !formData.userId}
            className="w-full bg-[#d1fa1a] text-black hover:bg-[#d1fa1a]/90"
          >
            {isSubmitting ? "Vytvára sa..." : "Vytvoriť projekt"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
