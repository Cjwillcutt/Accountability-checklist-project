import { Link, useLocation } from "wouter";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth";

export function Header() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  async function handleLogout() {
    await signOut();
    setLocation("/login");
  }

  const navItems = [
    { name: "Homepage", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Search Friends", path: "/search-friends" },
    { name: "Privacy & Cookies", path: "/privacy" },
  ];

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground text-xl leading-none">
            R
          </div>
          <Link href="/" className="font-bold text-xl tracking-tight text-white hover:text-primary transition-colors" data-testid="link-home">
            Responsiboard
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === item.path || (location.startsWith("/new-project") && item.path === "/projects")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              data-testid={`nav-link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item.name}
            </Link>
          ))}

          <div className="w-px h-6 bg-border mx-2" />

          {user && (
            <span className="text-xs text-muted-foreground truncate max-w-[140px]" data-testid="text-user-email">
              {user.email}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive gap-2"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
