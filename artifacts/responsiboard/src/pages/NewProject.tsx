import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus, Calendar, UploadCloud, ListTodo, FileEdit,
  Pencil, ChevronDown, ChevronUp, Plus, Trash2, Check, X, Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { createProject } from "@/lib/projects";

type SectionId = "invite" | "deadline" | "upload" | "checklist";

export default function NewProject() {
  const [, setLocation] = useLocation();
  const [projectName, setProjectName] = useState("Untitled Project");
  const [isRenaming, setIsRenaming] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Invite
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  // Deadlines
  const [deadlines, setDeadlines] = useState<{ label: string; date: string }[]>([]);
  const [newDeadlineLabel, setNewDeadlineLabel] = useState("");
  const [newDeadlineDate, setNewDeadlineDate] = useState("");

  // Upload
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Checklist
  const [checklistItems, setChecklistItems] = useState<{ text: string; done: boolean }[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  function toggleSection(id: SectionId) {
    setOpenSection((prev) => (prev === id ? null : id));
  }

  function handleInvite() {
    const t = inviteEmail.trim();
    if (t && !invitedEmails.includes(t)) {
      setInvitedEmails((p) => [...p, t]);
      setInviteEmail("");
    }
  }

  function addDeadline() {
    if (newDeadlineLabel.trim() && newDeadlineDate) {
      setDeadlines((p) => [...p, { label: newDeadlineLabel.trim(), date: newDeadlineDate }]);
      setNewDeadlineLabel("");
      setNewDeadlineDate("");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setUploadedFiles((p) => [...p, ...files.map((f) => f.name)]);
    e.target.value = "";
  }

  function addChecklistItem() {
    const t = newChecklistItem.trim();
    if (t) {
      setChecklistItems((p) => [...p, { text: t, done: false }]);
      setNewChecklistItem("");
    }
  }

  function toggleChecklistItem(i: number) {
    setChecklistItems((p) => p.map((item, idx) => idx === i ? { ...item, done: !item.done } : item));
  }

  function removeChecklistItem(i: number) {
    setChecklistItems((p) => p.filter((_, idx) => idx !== i));
  }

  async function handleCreate() {
    setSaving(true);
    setSaveError("");
    try {
      await createProject(projectName);
      setLocation("/projects");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not save project.";
      setSaveError(msg);
      setSaving(false);
    }
  }

  const actions: { id: SectionId; icon: React.ReactNode; label: string; color: string; badge?: number }[] = [
    { id: "invite", icon: <UserPlus className="w-6 h-6" />, label: "Invite Friends", color: "text-secondary", badge: invitedEmails.length || undefined },
    { id: "deadline", icon: <Calendar className="w-6 h-6" />, label: "Set Deadlines", color: "text-primary", badge: deadlines.length || undefined },
    { id: "upload", icon: <UploadCloud className="w-6 h-6" />, label: "Upload Documents", color: "text-purple-400", badge: uploadedFiles.length || undefined },
    { id: "checklist", icon: <ListTodo className="w-6 h-6" />, label: "Workload Checklist", color: "text-amber-400", badge: checklistItems.length || undefined },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col">
        <div className="max-w-2xl mx-auto w-full">

          <div className="flex items-center justify-between mb-10">
            <h1 className="text-4xl font-black text-white tracking-tight">New Project</h1>
            <Button
              variant="outline" size="sm"
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
                  onKeyDown={(e) => e.key === "Enter" && setIsRenaming(false)}
                  data-testid="input-project-name"
                />
              </div>
            ) : (
              <h2 className="text-3xl font-bold text-white mb-10 tracking-tight pb-4 border-b border-border/50">
                {projectName}
              </h2>
            )}

            <div className="flex flex-col gap-3 mb-8">
              {actions.map((action, i) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <button
                    type="button"
                    onClick={() => toggleSection(action.id)}
                    data-testid={`button-action-${action.id}`}
                    className={`w-full h-16 flex items-center justify-between px-6 text-lg font-medium rounded-xl border transition-all group ${
                      openSection === action.id
                        ? "bg-secondary/10 border-secondary/50 text-white"
                        : "bg-background/50 border-border text-muted-foreground hover:bg-secondary/10 hover:border-secondary/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`${action.color} group-hover:scale-110 transition-transform`}>{action.icon}</span>
                      <span>{action.label}</span>
                      {action.badge ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          {action.badge}
                        </span>
                      ) : null}
                    </div>
                    {openSection === action.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </button>

                  <AnimatePresence>
                    {openSection === action.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-background/40 border border-t-0 border-border rounded-b-xl px-6 py-5">
                          {action.id === "invite" && (
                            <div>
                              <p className="text-muted-foreground text-sm mb-3">Enter group members' email addresses to invite them.</p>
                              <div className="flex gap-2 mb-3">
                                <Input placeholder="teammate@university.edu" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleInvite()} data-testid="input-invite-email" className="h-10 bg-background border-border text-white placeholder:text-muted-foreground" />
                                <Button onClick={handleInvite} data-testid="button-send-invite" className="bg-secondary hover:bg-secondary/90 text-white px-4 rounded-lg shrink-0"><Plus className="w-4 h-4" /></Button>
                              </div>
                              {invitedEmails.map((email) => (
                                <div key={email} className="flex items-center gap-2 text-sm text-white mb-1">
                                  <Check className="w-4 h-4 text-primary shrink-0" />{email}
                                </div>
                              ))}
                            </div>
                          )}

                          {action.id === "deadline" && (
                            <div>
                              <p className="text-muted-foreground text-sm mb-3">Add milestones with due dates.</p>
                              <div className="flex gap-2 mb-3 flex-wrap">
                                <Input placeholder="e.g. First draft" value={newDeadlineLabel} onChange={(e) => setNewDeadlineLabel(e.target.value)} data-testid="input-deadline-label" className="h-10 bg-background border-border text-white placeholder:text-muted-foreground flex-1 min-w-32" />
                                <Input type="date" value={newDeadlineDate} onChange={(e) => setNewDeadlineDate(e.target.value)} data-testid="input-deadline-date" className="h-10 bg-background border-border text-white w-40" />
                                <Button onClick={addDeadline} data-testid="button-add-deadline" className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 rounded-lg"><Plus className="w-4 h-4" /></Button>
                              </div>
                              {deadlines.map((d, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-white mb-1">
                                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                                  <span className="flex-1">{d.label}</span>
                                  <span className="text-muted-foreground">{d.date}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {action.id === "upload" && (
                            <div>
                              <p className="text-muted-foreground text-sm mb-3">Upload rubrics, outlines, or drafts for the group.</p>
                              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-purple-400/60 transition-colors bg-background/50" data-testid="label-file-upload">
                                <UploadCloud className="w-6 h-6 text-purple-400 mb-1" />
                                <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                                <input type="file" multiple className="hidden" onChange={handleFileChange} data-testid="input-file-upload" />
                              </label>
                              {uploadedFiles.map((name, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-white mt-2">
                                  <Check className="w-4 h-4 text-primary shrink-0" />{name}
                                </div>
                              ))}
                            </div>
                          )}

                          {action.id === "checklist" && (
                            <div>
                              <p className="text-muted-foreground text-sm mb-3">Break the project into tasks and assign them.</p>
                              <div className="flex gap-2 mb-3">
                                <Input placeholder="e.g. Write the introduction" value={newChecklistItem} onChange={(e) => setNewChecklistItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChecklistItem()} data-testid="input-checklist-item" className="h-10 bg-background border-border text-white placeholder:text-muted-foreground flex-1" />
                                <Button onClick={addChecklistItem} data-testid="button-add-checklist-item" className="bg-amber-500 hover:bg-amber-500/90 text-white px-4 rounded-lg"><Plus className="w-4 h-4" /></Button>
                              </div>
                              {checklistItems.map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm group/item mb-2" data-testid={`checklist-item-${i}`}>
                                  <button type="button" onClick={() => toggleChecklistItem(i)} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${item.done ? "bg-primary border-primary" : "border-border hover:border-primary/60"}`} data-testid={`button-toggle-checklist-${i}`}>
                                    {item.done && <Check className="w-3 h-3 text-primary-foreground" />}
                                  </button>
                                  <span className={`flex-1 ${item.done ? "line-through text-muted-foreground" : "text-white"}`}>{item.text}</span>
                                  <button type="button" onClick={() => removeChecklistItem(i)} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-destructive" data-testid={`button-remove-checklist-${i}`}>
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.32 }} className="mt-8">
              <label className="flex items-center gap-3 text-lg font-medium text-white mb-3">
                <FileEdit className="w-5 h-5 text-emerald-400" /> Insert Notes
              </label>
              <textarea
                className="w-full min-h-[120px] bg-background border border-border rounded-xl p-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                placeholder="e.g. I'll be out of town next week, we should finish the intro by Friday..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                data-testid="textarea-notes"
              />
            </motion.div>
          </div>

          {saveError && (
            <p className="text-destructive text-sm text-center mb-4" data-testid="text-save-error">{saveError}</p>
          )}

          <div className="flex justify-center mb-8">
            <Button
              size="lg"
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-16 px-16 text-xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:shadow-[0_0_50px_rgba(34,197,94,0.6)] transition-all hover:scale-105 w-full md:w-auto"
              onClick={handleCreate}
              data-testid="button-create-submit"
            >
              {saving ? (
                <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Saving...</span>
              ) : "Create"}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
