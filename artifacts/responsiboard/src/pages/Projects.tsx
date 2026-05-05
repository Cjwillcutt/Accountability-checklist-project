import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PlusCircle, Folder, ChevronRight, Users, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProjects, deleteProject } from "@/lib/projects";
import type { Project } from "@/lib/projects";

export default function Projects() {
  const [, setLocation] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProjects();
      setProjects(data);
    } catch {
      setError("Could not load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function handleOpen(id: string) {
    setOpenedId(id);
    setTimeout(() => setLocation(`/projects/${id}`), 150);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      setError("Could not delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Projects</h1>
              {!loading && (
                <p className="text-muted-foreground text-sm mt-1">
                  {projects.length === 0
                    ? "No projects yet — create your first one below"
                    : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Users className="w-4 h-4" />
              <span>Your workspace</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm" data-testid="text-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading your projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-4">
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Create your first project below and start keeping your group accountable.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <div className="space-y-4 mb-12">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-card border transition-all shadow-sm gap-4 ${
                      openedId === project.id
                        ? "border-primary shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        : "border-border hover:border-primary/40 hover:shadow-[0_0_15px_rgba(34,197,94,0.08)]"
                    }`}
                    data-testid={`card-project-${project.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Folder className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Created {new Date(project.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => handleOpen(project.id)}
                        className="bg-secondary hover:bg-secondary/90 text-white shadow-lg flex-1 sm:flex-none rounded-xl gap-2 transition-all hover:scale-105"
                        data-testid={`button-open-project-${project.id}`}
                      >
                        Open <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="text-muted-foreground hover:text-destructive rounded-xl shrink-0"
                        data-testid={`button-delete-project-${project.id}`}
                      >
                        {deletingId === project.id
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}

          <div className="flex justify-center py-8 border-t border-border">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-10 text-xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all hover:scale-105"
            >
              <Link href="/new-project" data-testid="button-create-new-project">
                <PlusCircle className="mr-2 w-6 h-6" /> Create New Project
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
