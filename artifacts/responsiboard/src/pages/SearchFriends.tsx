import { useState } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Check, Users } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUGGESTED_USERS = [
  { id: 1, name: "Alex Rivera", email: "alex.r@university.edu", mutual: 3 },
  { id: 2, name: "Jordan Kim", email: "jordan.k@university.edu", mutual: 5 },
  { id: 3, name: "Sam Torres", email: "sam.t@university.edu", mutual: 1 },
  { id: 4, name: "Morgan Lee", email: "morgan.l@university.edu", mutual: 7 },
  { id: 5, name: "Casey Patel", email: "casey.p@university.edu", mutual: 2 },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
];

export default function SearchFriends() {
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState<Set<number>>(new Set());

  const filtered = SUGGESTED_USERS.filter(
    (u) =>
      query.trim() === "" ||
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  function handleAdd(id: number) {
    setAdded((prev) => new Set(prev).add(id));
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto w-full">

          {/* Page title */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Search Friends</h1>
            <p className="text-muted-foreground">
              Find classmates and add them before creating your group project.
            </p>
          </motion.div>

          {/* Search input */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="relative mb-8"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              data-testid="input-search-friends"
              className="h-14 pl-12 rounded-2xl bg-card border-border text-white placeholder:text-muted-foreground focus-visible:ring-primary text-base"
            />
          </motion.div>

          {/* Added count badge */}
          {added.size > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-semibold"
              data-testid="text-added-count"
            >
              <Users className="w-4 h-4" />
              {added.size} friend{added.size !== 1 ? "s" : ""} added
            </motion.div>
          )}

          {/* Results */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center text-muted-foreground"
                data-testid="text-no-results"
              >
                No users found for &ldquo;{query}&rdquo;
              </motion.div>
            ) : (
              filtered.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between p-5 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all group"
                  data-testid={`card-user-${user.id}`}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-bold text-white text-base group-hover:text-primary transition-colors">
                        {user.name}
                      </p>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user.mutual} mutual friend{user.mutual !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAdd(user.id)}
                    disabled={added.has(user.id)}
                    data-testid={`button-add-friend-${user.id}`}
                    className={
                      added.has(user.id)
                        ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary/10 cursor-default rounded-xl px-5"
                        : "bg-secondary hover:bg-secondary/90 text-white rounded-xl px-5 shadow-lg"
                    }
                  >
                    {added.has(user.id) ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-4 h-4" /> Added
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Add
                      </span>
                    )}
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
