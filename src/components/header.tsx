import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Quiero Patio
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/">Inicio</Link>
            <Link href="/patios">Patios</Link>
            <Link href="/contacto">Contacto</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
