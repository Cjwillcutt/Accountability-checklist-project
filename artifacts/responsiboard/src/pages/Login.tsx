import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth";
import { createProfile, checkUsernameAvailable } from "@/lib/profile";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  function switchMode(next: "login" | "signup") {
    setMode(next);
    setError("");
    setEmail("");
    setPassword("");
    setUsername("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "signup") {
      if (!username.trim()) {
        setError("Please choose a username.");
        return;
      }
      if (username.trim().length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        setError("Username can only contain letters, numbers, and underscores.");
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        setLocation("/projects");
      } else {
        // Check username availability first
        const available = await checkUsernameAvailable(username);
        if (!available) {
          setError("That username is already taken. Please choose another.");
          setIsLoading(false);
          return;
        }

        const { user } = await signUp(email, password);

        // Save profile with username
        if (user) {
          await createProfile(user.id, username.trim());
        }

        // Try to log in immediately; falls back to email confirmation screen if required
        try {
          await signIn(email, password);
          setLocation("/projects");
        } catch {
          setSignupSuccess(true);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
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
          <button
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
            className="text-sm text-muted-foreground hover:text-white transition-colors"
            data-testid="button-toggle-mode"
          >
            {mode === "login"
              ? <span>No account? <span className="text-primary font-semibold">Sign up free</span></span>
              : <span>Have an account? <span className="text-primary font-semibold">Log in</span></span>
            }
          </button>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Student accountability, sorted</span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white text-center mb-2 tracking-tight">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground text-center mb-10 text-base">
            {mode === "login"
              ? "Log in to pick up where you left off."
              : "Pick a username, then set up your email and password."}
          </p>

          {signupSuccess ? (
            <div className="bg-card border border-primary/30 rounded-2xl p-8 text-center shadow-xl">
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-muted-foreground text-sm">
                We sent a confirmation link to{" "}
                <span className="text-white font-medium">{email}</span>.
                Click it to activate your account, then come back and log in.
              </p>
              <Button
                onClick={() => { setSignupSuccess(false); switchMode("login"); }}
                className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl w-full"
                data-testid="button-go-to-login"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.4)]">
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Username — signup only */}
                {mode === "signup" && (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="username" className="text-white font-semibold text-sm">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="e.g. alex_smith"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      autoComplete="username"
                      data-testid="input-username"
                      className="h-12 rounded-xl bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Letters, numbers, and underscores only. This is what others will see.
                    </p>
                  </div>
                )}

                {/* Email */}
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

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white font-semibold text-sm">
                      Password
                    </Label>
                    <span className="text-xs text-muted-foreground">Min. 6 characters</span>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      data-testid="input-password"
                      className="h-12 rounded-xl bg-background border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      data-testid="button-toggle-password"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
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
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {mode === "login" ? "Logging in..." : "Creating account..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === "login" ? "Log in" : "Create account"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-border text-center">
                <p className="text-muted-foreground text-sm">
                  {mode === "login" ? "New to Responsiboard? " : "Already have an account? "}
                  <button
                    onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                    className="text-primary font-semibold hover:underline"
                    data-testid="button-switch-mode"
                  >
                    {mode === "login" ? "Create a free account" : "Log in"}
                  </button>
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <footer className="border-t border-border py-6 bg-background">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Responsiboard. Built for students.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors" data-testid="link-footer-terms">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors" data-testid="link-footer-privacy">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors" data-testid="link-footer-contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
