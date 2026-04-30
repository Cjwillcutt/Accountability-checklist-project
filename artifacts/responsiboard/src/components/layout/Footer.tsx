import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Responsiboard. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-terms">
            Terms
          </Link>
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-privacy">
            Privacy
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-contact">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
