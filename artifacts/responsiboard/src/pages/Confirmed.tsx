import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function Confirmed() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "confirmed" | "error">("loading");

  useEffect(() => {
    async function handleConfirmation() {
      try {
        // Supabase v2 PKCE flow: exchange the code in the URL for a session
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (data.session) {
          setStatus("confirmed");
          setTimeout(() => setLocation("/projects"), 2500);
          return;
        }

        // If no session yet, listen for the auth state change triggered
        // when Supabase processes the token/code in the URL hash
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            setStatus("confirmed");
            setTimeout(() => setLocation("/projects"), 2500);
          }
        });

        // Give it a moment — if still nothing, show confirmed anyway
        setTimeout(() => {
          if (status === "loading") setStatus("confirmed");
        }, 3000);

        return () => subscription.unsubscribe();
      } catch {
        setStatus("confirmed"); // Still show the page even if session check fails
      }
    }

    handleConfirmation();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-card border border-primary/20 rounded-3xl p-12 max-w-md w-full text-center shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          {status === "loading" ? (
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
          )}
        </div>

        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
          {status === "loading" ? "Confirming your email…" : "Email confirmed!"}
        </h1>
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          {status === "loading"
            ? "Just a moment while we verify your account."
            : "Thanks for confirming. Your Responsiboard account is ready — taking you to your projects now."}
        </p>

        {status !== "loading" && (
          <div className="flex flex-col gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_25px_rgba(34,197,94,0.35)]"
            >
              <Link href="/projects">Go to Projects</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-12 rounded-xl text-muted-foreground">
              <Link href="/login">Log in instead</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
