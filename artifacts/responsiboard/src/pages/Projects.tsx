import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlusCircle, Folder, Clock, ChevronRight, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_PROJECTS = [
  { id: 1, name: "Biology Lab Report", due: "Tomorrow", members: 4, progress: 75 },
  { id: 2, name: "History Essay", due: "In 3 days", members: 3, progress: 40 },
  { id: 3, name: "CS Final Project", due: "Next week", members: 5, progress: 90 },
  { id: 4, name: "Economics Presentation", due: "In 2 weeks", members: 4, progress: 20 },
  { id: 5, name: "Psychology Research Paper", due: "In 3 weeks", members: 3, progress: 55 },
];

const PAGE_SIZE = 3;

export default function Projects() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(0);
  const [openedId, setOpenedId] = useState<number | null>(null);

  const totalPages = Math.ceil(ALL_PROJECTS.length / PAGE_SIZE);
  const visibleProjects = ALL_PROJECTS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  function handleOpen(id: number) {
    setOpenedId(id);
    setTimeout(() => {
      setLocation("/new-project");
    }, 400);
  }

  function handleNext() {
    setPage((p) => (p + 1) % totalPages);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Projects</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Page {page + 1} of {totalPages} &mdash; {ALL_PROJECTS.length} total projects
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              <span>Your group workspace</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 mb-12"
            >
              {visibleProjects.map((project, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  key={project.id}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-card border transition-all shadow-sm gap-4 ${
                    openedId === project.id
                      ? "border-primary shadow-[0_0_20px_rgba(34,197,94,0.25)] scale-[1.01]"
                      : "border-border hover:border-primary/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Folder className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Due {project.due}
                        </span>
                        <span>{project.members} members</span>
                        <span className="text-primary font-medium">{project.progress}% complete</span>
                      </div>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 w-40 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleOpen(project.id)}
                    className="bg-secondary hover:bg-secondary/90 text-white shadow-lg w-full sm:w-auto rounded-xl gap-2 transition-all hover:scale-105"
                    data-testid={`button-open-project-${project.id}`}
                  >
                    Open <ChevronRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col items-center justify-center py-8 border-t border-border">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 text-xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all hover:scale-105 mb-10"
            >
              <Link href="/new-project" data-testid="button-create-new-project">
                <PlusCircle className="mr-2 w-6 h-6" /> Create New Project
              </Link>
            </Button>

            <div className="w-full flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, ALL_PROJECTS.length)} of {ALL_PROJECTS.length} projects
              </p>
              <Button
                variant="outline"
                className="gap-2 rounded-full px-6 hover:border-primary/50 hover:text-primary transition-colors"
                onClick={handleNext}
                data-testid="button-next"
              >
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
