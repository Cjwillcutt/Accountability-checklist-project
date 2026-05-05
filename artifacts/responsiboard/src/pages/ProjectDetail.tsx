import { useState, useEffect, useCallback } from "react";
import { useLocation, useParams } from "wouter";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserPlus, Calendar, ListTodo, FileEdit,
  Pencil, ChevronDown, ChevronUp, Plus, Trash2, Check, Loader2, ArrowLeft, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProjectById, updateProjectName, updateProjectNotes,
  fetchDeadlines, addDeadline, deleteDeadline,
  fetchChecklist, addChecklistItem, toggleChecklistItem, deleteChecklistItem,
  fetchMembers, addMember, deleteMember,
} from "@/lib/projectDetails";
import type { Deadline, ChecklistItem, ProjectMember } from "@/lib/projectDetails";

type SectionId = "invite" | "deadline" | "checklist" | "notes";

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const [, setLocation] = useLocation();

  const [projectName, setProjectName] = useState("Loading…");
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [newDeadlineLabel, setNewDeadlineLabel] = useState("");
  const [newDeadlineDate, setNewDeadlineDate] = useState("");
  const [addingDeadline, setAddingDeadline] = useState(false);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistText, setNewChecklistText] = useState("");
  const [addingChecklist, setAddingChecklist] = useState(false);

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const load = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const [project, dls, cl, mbs] = await Promise.all([
      fetchProjectById(projectId),
      fetchDeadlines(projectId),
      fetchChecklist(projectId),
      fetchMembers(projectId),
    ]);
    if (!project) { setNotFound(true); setLoading(false); return; }
    setProjectName(project.name);
    setRenameValue(project.name);
    setNotes(project.notes ?? "");
    setDeadlines(dls);
    setChecklist(cl);
    setMembers(mbs);
    setLoading(false);
  }, [projectId]);

  useEffect(() => { load(); }, [load]);

  async function handleRename() {
    if (!renameValue.trim() || !projectId) return;
    await updateProjectName(projectId, renameValue.trim());
    setProjectName(renameValue.trim());
    setIsRenaming(false);
  }

  async function handleAddDeadline() {
    if (!newDeadlineLabel.trim() || !newDeadlineDate || !projectId) return;
    setAddingDeadline(true);
    try {
      const d = await addDeadline(projectId, newDeadlineLabel.trim(), newDeadlineDate);
      setDeadlines((p) => [...p, d]);
      setNewDeadlineLabel(""); setNewDeadlineDate("");
    } finally { setAddingDeadline(false); }
  }

  async function handleDeleteDeadline(id: string) {
    await deleteDeadline(id);
    setDeadlines((p) => p.filter((d) => d.id !== id));
  }

  async function handleAddChecklist() {
    if (!newChecklistText.trim() || !projectId) return;
    setAddingChecklist(true);
    try {
      const item = await addChecklistItem(projectId, newChecklistText.trim());
      setChecklist((p) => [...p, item]);
      setNewChecklistText("");
    } finally { setAddingChecklist(false); }
  }

  async function handleToggleChecklist(id: string, done: boolean) {
    await toggleChecklistItem(id, !done);
    setChecklist((p) => p.map((i) => i.id === id ? { ...i, done: !done } : i));
  }

  async function handleDeleteChecklist(id: string) {
    await deleteChecklistItem(id);
    setChecklist((p) => p.filter((i) => i.id !== id));
  }

  async function handleAddMember() {
    const email = newMemberEmail.trim();
    if (!email || !projectId) return;
    if (members.some((m) => m.email === email)) return;
    setAddingMember(true);
    try {
      const m = await addMember(projectId, email);
      setMembers((p) => [...p, m]);
      setNewMemberEmail("");
    } finally { setAddingMember(false); }
  }

  async function handleDeleteMember(id: string) {
    await deleteMember(id);
    setMembers((p) => p.filter((m) => m.id !== id));
  }

  async function handleSaveNotes() {
    if (!projectId) return;
    setSavingNotes(true);
    await updateProjectNotes(projectId, notes);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  const sections: { id: SectionId; icon: React.ReactNode; label: string; color: string; badge?: number }[] = [
    { id: "invite", icon: <UserPlus className="w-6 h-6" />, label: "Team Members", color: "text-secondary", badge: members.length || undefined },
    { id: "deadline", icon: <Calendar className="w-6 h-6" />, label: "Deadlines", color: "text-primary", badge: deadlines.length || undefined },
    { id: "checklist", icon: <ListTodo className="w-6 h-6" />, label: "Workload Checklist", color: "text-amber-400", badge: checklist.length || undefined },
    { id: "notes", icon: <FileEdit className="w-6 h-6" />, label: "Notes", color: "text-emerald-400" },
  ];

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold text-white">Project not found</h2>
          <Button onClick={() => setLocation("/projects")} className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Projects</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col">
        <div className="max-w-2xl mx-auto w-full">

          {/* Back + title */}
          <div className="flex items-center gap-3 mb-10">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/projects")} className="text-muted-foreground hover:text-white gap-1 -ml-2">
              <ArrowLeft className="w-4 h-4" /> Projects
            </Button>
          </div>

          <div className="flex items-center justify-between mb-8">
            {loading ? (
              <div className="h-10 w-48 bg-card animate-pulse rounded-xl" />
            ) : isRenaming ? (
              <div className="flex items-center gap-2 flex-1">
                <Input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="text-2xl font-bold bg-background border-border h-12 text-white"
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setIsRenaming(false); }}
                />
                <Button size="sm" onClick={handleRename} className="bg-primary text-primary-foreground rounded-lg shrink-0"><Check className="w-4 h-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setIsRenaming(false)} className="rounded-lg shrink-0"><X className="w-4 h-4" /></Button>
              </div>
            ) : (
              <h1 className="text-4xl font-black text-white tracking-tight">{projectName}</h1>
            )}
            {!isRenaming && !loading && (
              <Button variant="outline" size="sm" className="gap-2 border-border text-muted-foreground hover:text-white shrink-0 ml-4" onClick={() => { setRenameValue(projectName); setIsRenaming(true); }}>
                <Pencil className="w-4 h-4" /> Rename
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-muted-foreground gap-3">
              <Loader2 className="w-5 h-5 animate-spin" /><span>Loading project…</span>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-xl">
              <div className="flex flex-col gap-3">
                {sections.map((section, i) => (
                  <motion.div key={section.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                    <button
                      type="button"
                      onClick={() => setOpenSection((p) => p === section.id ? null : section.id)}
                      className={`w-full h-16 flex items-center justify-between px-6 text-lg font-medium rounded-xl border transition-all group ${openSection === section.id ? "bg-secondary/10 border-secondary/50 text-white" : "bg-background/50 border-border text-muted-foreground hover:bg-secondary/10 hover:border-secondary/40 hover:text-white"}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`${section.color} group-hover:scale-110 transition-transform`}>{section.icon}</span>
                        <span>{section.label}</span>
                        {section.badge ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">{section.badge}</span>
                        ) : null}
                      </div>
                      {openSection === section.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                    </button>

                    <AnimatePresence>
                      {openSection === section.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                          <div className="bg-background/40 border border-t-0 border-border rounded-b-xl px-6 py-5">

                            {section.id === "invite" && (
                              <div>
                                <p className="text-muted-foreground text-sm mb-3">Add your group members by email address.</p>
                                <div className="flex gap-2 mb-4">
                                  <Input placeholder="teammate@university.edu" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddMember()} className="h-10 bg-background border-border text-white placeholder:text-muted-foreground" />
                                  <Button onClick={handleAddMember} disabled={addingMember} className="bg-secondary hover:bg-secondary/90 text-white px-4 rounded-lg shrink-0">
                                    {addingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                  </Button>
                                </div>
                                {members.length === 0 && <p className="text-muted-foreground text-sm">No members added yet.</p>}
                                {members.map((m) => (
                                  <div key={m.id} className="flex items-center gap-2 text-sm text-white mb-2 group/item">
                                    <Check className="w-4 h-4 text-secondary shrink-0" />
                                    <span className="flex-1">{m.email}</span>
                                    <button type="button" onClick={() => handleDeleteMember(m.id)} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {section.id === "deadline" && (
                              <div>
                                <p className="text-muted-foreground text-sm mb-3">Add milestones with due dates.</p>
                                <div className="flex gap-2 mb-4 flex-wrap">
                                  <Input placeholder="e.g. First draft" value={newDeadlineLabel} onChange={(e) => setNewDeadlineLabel(e.target.value)} className="h-10 bg-background border-border text-white placeholder:text-muted-foreground flex-1 min-w-32" />
                                  <Input type="date" value={newDeadlineDate} onChange={(e) => setNewDeadlineDate(e.target.value)} className="h-10 bg-background border-border text-white w-40" />
                                  <Button onClick={handleAddDeadline} disabled={addingDeadline} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 rounded-lg shrink-0">
                                    {addingDeadline ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                  </Button>
                                </div>
                                {deadlines.length === 0 && <p className="text-muted-foreground text-sm">No deadlines set yet.</p>}
                                {deadlines.map((d) => (
                                  <div key={d.id} className="flex items-center gap-2 text-sm text-white mb-2 group/item">
                                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                                    <span className="flex-1">{d.label}</span>
                                    <span className="text-muted-foreground">{new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                                    <button type="button" onClick={() => handleDeleteDeadline(d.id)} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-2"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {section.id === "checklist" && (
                              <div>
                                <p className="text-muted-foreground text-sm mb-3">Break the project into tasks. Check them off as you go.</p>
                                <div className="flex gap-2 mb-4">
                                  <Input placeholder="e.g. Write the introduction" value={newChecklistText} onChange={(e) => setNewChecklistText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddChecklist()} className="h-10 bg-background border-border text-white placeholder:text-muted-foreground flex-1" />
                                  <Button onClick={handleAddChecklist} disabled={addingChecklist} className="bg-amber-500 hover:bg-amber-500/90 text-white px-4 rounded-lg shrink-0">
                                    {addingChecklist ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                  </Button>
                                </div>
                                {checklist.length === 0 && <p className="text-muted-foreground text-sm">No tasks yet.</p>}
                                {checklist.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 text-sm group/item mb-2">
                                    <button type="button" onClick={() => handleToggleChecklist(item.id, item.done)} className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${item.done ? "bg-primary border-primary" : "border-border hover:border-primary/60"}`}>
                                      {item.done && <Check className="w-3 h-3 text-primary-foreground" />}
                                    </button>
                                    <span className={`flex-1 ${item.done ? "line-through text-muted-foreground" : "text-white"}`}>{item.text}</span>
                                    <button type="button" onClick={() => handleDeleteChecklist(item.id)} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                                  </div>
                                ))}
                                {checklist.length > 0 && (
                                  <p className="text-xs text-muted-foreground mt-3">{checklist.filter((i) => i.done).length}/{checklist.length} tasks complete</p>
                                )}
                              </div>
                            )}

                            {section.id === "notes" && (
                              <div>
                                <p className="text-muted-foreground text-sm mb-3">Shared notes visible to everyone on the project.</p>
                                <textarea
                                  className="w-full min-h-[140px] bg-background border border-border rounded-xl p-4 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                                  placeholder="e.g. We need to finish the intro by Friday..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                />
                                <div className="flex items-center gap-3 mt-3">
                                  <Button onClick={handleSaveNotes} disabled={savingNotes} size="sm" className="bg-emerald-600 hover:bg-emerald-600/90 text-white rounded-lg gap-2">
                                    {savingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Save Notes
                                  </Button>
                                  {notesSaved && <span className="text-emerald-400 text-sm">Saved!</span>}
                                </div>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
