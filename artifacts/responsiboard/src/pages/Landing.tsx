import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Clock, Users, FileText, CheckSquare, Zap, BarChart3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="absolute top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-primary-foreground text-xl shadow-[0_0_15px_rgba(34,197,94,0.5)]">
              R
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Responsiboard</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors hidden sm:block" data-testid="link-login">
              Log in
            </Link>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-all rounded-full px-6">
              <Link href="/login" data-testid="link-get-started">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center justify-center text-center z-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            <span>Built for stressed college students</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-[1.1]">
            Stop chasing your teammates. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
              Start finishing together.
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            Responsiboard is the project accountability tool your group chat wishes it was. Structured, honest, and actually useful at 2am before a deadline.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-8 text-lg rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] w-full sm:w-auto">
              <Link href="/login" data-testid="button-hero-cta">
                Start a Project <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-border/50 bg-white/5 hover:bg-white/10 w-full sm:w-auto">
              <Link href="#features" data-testid="button-hero-secondary">
                See How It Works
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 bg-background relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Know who's doing what. <span className="text-secondary">Always.</span></h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">No more "I thought you were doing that" or "I'll do it later." Clear assignments, visible progress, absolute accountability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Users className="w-6 h-6 text-secondary" />,
                title: "Task Assignment",
                desc: "Assign specific parts of the project to specific people. Clear ownership means no dropped balls."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-primary" />,
                title: "Real-time Visibility",
                desc: "See exactly how far along everyone is. A single dashboard showing the truth of your project."
              },
              {
                icon: <Clock className="w-6 h-6 text-destructive" />,
                title: "Deadline Tracking",
                desc: "Set micro-deadlines before the big one. Get pinged when things are falling behind schedule."
              },
              {
                icon: <FileText className="w-6 h-6 text-emerald-400" />,
                title: "Document Hub",
                desc: "Keep all your links, rubrics, and drafts in one place. No more scrolling through group chats."
              },
              {
                icon: <CheckSquare className="w-6 h-6 text-purple-400" />,
                title: "Workload Checklists",
                desc: "Break massive tasks into bite-sized checklists. Gamify the process of getting things done."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
                title: "No More Excuses",
                desc: "Built-in accountability mechanics ensure everyone pulls their weight, or it's visible to all."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-card border border-border rounded-2xl p-8 hover:border-secondary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-primary/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-card border border-primary/20 rounded-3xl p-12 md:p-20 text-center shadow-2xl backdrop-blur-sm">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Your group project just got its act together.</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of students who have stopped stressing and started acing their group assignments.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 text-xl rounded-full shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:shadow-[0_0_60px_rgba(34,197,94,0.7)] transition-all hover:scale-105">
              <Link href="/login" data-testid="button-final-cta">
                Create Your First Project
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-background relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-primary-foreground">
              R
            </div>
            <span className="font-bold text-xl text-white">Responsiboard</span>
          </div>
          <div className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Responsiboard. Built for students.
          </div>
        </div>
      </footer>
    </div>
  );
}
