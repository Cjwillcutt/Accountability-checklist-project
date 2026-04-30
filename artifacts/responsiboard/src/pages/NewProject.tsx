import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Calendar, 
  UploadCloud, 
  ListTodo, 
  FileEdit,
  Pencil
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function NewProject() {
  const [, setLocation] = useLocation();
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isRenaming, setIsRenaming] = useState(false);
  const [notes, setNotes] = useState("");

  const actions = [
    { id: "invite", icon: <UserPlus className="w-6 h-6" />, label: "Invite Friends", color: "text-secondary" },
    { id: "deadline", icon: <Calendar className="w-6 h-6" />, label: "Set Deadlines", color: "text-primary" },
    { id: "upload", icon: <UploadCloud className="w-6 h-6" />, label: "Upload Documents", color: "text-purple-400" },
    { id: "checklist", icon: <ListTodo className="w-6 h-6" />, label: "Workload Checklist", color: "text-amber-400" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col">
        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight">New Project</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-border text-muted-foreground hover:text-white"
              onClick={() => setIsRenaming(!isRenaming)}
              data-testid="button-rename-project"
            >
              <Pencil className="w-4 h-4" /> Rename Project
            </Button>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl mb-10">
            {isRenaming ? (
              <div className="mb-10">
                <Input 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-2xl font-bold bg-background border-border h-14"
                  autoFocus
                  onBlur={() => setIsRenaming(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsRenaming(false)}
                  data-testid="input-project-name"
                />
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-white mb-10 tracking-tight pb-4 border-b border-border/50">
                {projectName}
              </h2>
            )}

            <div className="flex flex-col gap-4 mb-8">
              {actions.map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full h-16 justify-start px-6 text-lg font-medium bg-background/50 hover:bg-secondary/10 hover:border-secondary/50 hover:text-white transition-all border-border rounded-xl group"
                    data-testid={`button-action-${action.id}`}
                  >
                    <div className={`mr-4 ${action.color} group-hover:scale-110 transition-transform`}>
                      {action.icon}
                    </div>
                    {action.label}
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <label className="flex items-center gap-3 text-lg font-medium text-white mb-3">
                <FileEdit className="w-5 h-5 text-emerald-400" />
                Insert Notes
              </label>
              <textarea 
                className="w-full min-h-[120px] bg-background border border-border rounded-xl p-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                placeholder="e.g. I'll be out of town next week"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="textarea-notes"
              ></textarea>
            </motion.div>
          </div>

          <div className="flex justify-center mt-12 mb-8">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-16 text-xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all hover:scale-105 w-full md:w-auto"
              onClick={() => setLocation("/projects")}
              data-testid="button-create-submit"
            >
              Create
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
