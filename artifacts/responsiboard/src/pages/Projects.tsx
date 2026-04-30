import { Link } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Folder, Clock } from "lucide-react";
import { motion } from "framer-motion";

const SAMPLE_PROJECTS = [
  { id: 1, name: "Biology Lab Report", due: "Tomorrow", members: 4, progress: 75 },
  { id: 2, name: "History Essay", due: "In 3 days", members: 3, progress: 40 },
  { id: 3, name: "CS Final Project", due: "Next week", members: 5, progress: 90 },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight">Projects</h1>
          </div>

          <div className="space-y-4 mb-12">
            {SAMPLE_PROJECTS.map((project, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={project.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Folder className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Due {project.due}
                      </span>
                      <span>{project.members} members</span>
                      <span className="text-primary font-medium">{project.progress}% complete</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-secondary hover:bg-secondary/90 text-white shadow-lg w-full sm:w-auto" data-testid={`button-open-project-${project.id}`}>
                  Open
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center py-12 border-t border-border mt-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 text-xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all hover:scale-105 mb-16">
              <Link href="/new-project" data-testid="button-create-new-project">
                <PlusCircle className="mr-2 w-6 h-6" /> Create New Project
              </Link>
            </Button>

            <div className="w-full flex justify-end">
              <Button variant="outline" className="gap-2 rounded-full px-6" data-testid="button-next">
                Next <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
