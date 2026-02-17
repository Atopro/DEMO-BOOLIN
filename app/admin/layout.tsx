import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#d1fa1a]" />
                <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  boolin
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-6 ml-8">
                <Link
                  href="/admin"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  Projekty
                </Link>
                <Link
                  href="/admin/clients"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  Klienti
                </Link>
                <Link
                  href="/admin/projects/new"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  Nový projekt
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                >
                  Klient dashboard
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block px-3 py-1 bg-[#d1fa1a] text-black text-xs font-semibold rounded-full">
                ADMIN
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#d1fa1a] text-black text-sm font-semibold">
                        {session.user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">
                      {session.user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      Administrátor
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      Domovská stránka
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout" className="cursor-pointer">
                      Odhlásiť sa
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
