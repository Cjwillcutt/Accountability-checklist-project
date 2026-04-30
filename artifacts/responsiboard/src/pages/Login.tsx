import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLocation("/projects");
    }, 1200);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-secondary/10 via-background to-background pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full border-b border-white/5 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" data-testid="link-logo-home">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-primary-foreground text-xl shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                R
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">Responsiboard</span>
            </div>
          </Link>
          <span className="text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="text-primary font-semibold hover:underline" data-testid="link-signup">
              Sign up free
            </Link>
          </span>
        </div>
      </nav>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md"
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Student accountability, sorted</span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white text-center mb-2 tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-center mb-10 text-base">
            Log in to pick up where you left off.
          </p>

          {/* Card */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-white font-semibold text-sm">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  data-testid="input-email"
                  className="h-12 rounded-xl bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white font-semibold text-sm">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-primary hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    data-testid="input-password"
                    className="h-12 rounded-xl bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    data-testid="button-toggle-password"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-destructive text-sm font-medium" data-testid="text-error">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                data-testid="button-login-submit"
                className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:shadow-[0_0_40px_rgba(34,197,94,0.55)] transition-all mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Log in <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground text-sm">
                New to Responsiboard?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline" data-testid="link-signup-bottom">
                  Create a free account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-background">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Responsiboard. Built for students.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors" data-testid="link-footer-terms">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors" data-testid="link-footer-privacy">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors" data-testid="link-footer-contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
