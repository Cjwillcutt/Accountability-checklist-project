import { Link } from "wouter";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors" data-testid="link-login">
            Log in
          </Link>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">Privacy Policy &amp; Cookies</h1>
          </div>
          <p className="text-muted-foreground text-sm mb-12">Last updated: May 4, 2026</p>

          <div className="prose prose-invert max-w-none space-y-10 text-[15px] leading-relaxed">

            <p className="text-muted-foreground text-base">
              Welcome to Responsiboard! This page explains what information we collect and how we use it. We've kept it short and simple.
            </p>

            <Section title="About Responsiboard">
              <p>
                Responsiboard is a student project built to help users organize projects, add friends, and assign tasks to hit deadlines together. It is a non-commercial project created for educational purposes.
              </p>
            </Section>

            <Section title="What We Collect">
              <p>When you use Responsiboard, we collect:</p>
              <ul>
                <li><strong className="text-white">Account information</strong> — your name, email address, and password (passwords are stored securely and never visible to us in plain text)</li>
                <li><strong className="text-white">Content you create</strong> — projects, tasks, deadlines, and friend connections you make on the platform</li>
                <li><strong className="text-white">Basic usage data</strong> — information like when you log in, which helps the app function properly</li>
              </ul>
              <p>We do not collect payment information, location data, or sell any of your information to third parties.</p>
            </Section>

            <Section title="How We Use Your Information">
              <p>We use your information to:</p>
              <ul>
                <li>Let you log in and access your account</li>
                <li>Save your projects, tasks, and friend connections</li>
                <li>Allow friends to see projects and tasks you've shared with them</li>
                <li>Keep the app running and fix issues if they come up</li>
              </ul>
            </Section>

            <Section title="Cookies">
              <p>We use a small number of cookies to make Responsiboard work properly:</p>
              <ul>
                <li><strong className="text-white">Session cookies</strong> — these keep you logged in as you move around the site</li>
                <li><strong className="text-white">Preference cookies</strong> — these remember basic settings so you don't have to set them every time</li>
              </ul>
              <p>We do not use advertising cookies or third-party tracking cookies.</p>
              <p>You can disable cookies in your browser settings, but some parts of Responsiboard may not work correctly without them.</p>
            </Section>

            <Section title="Where Your Data Lives">
              <p>
                Responsiboard is built using Supabase, which securely stores your account information and project data. Your data is protected by industry-standard security practices.
              </p>
            </Section>

            <Section title="Your Choices">
              <p>You can:</p>
              <ul>
                <li>Update your account information at any time from your profile</li>
                <li>Delete your account, which will remove your personal data from our system</li>
                <li>Contact us with any questions or concerns</li>
              </ul>
            </Section>

            <Section title="A Note About This Project">
              <p>
                Responsiboard is a student-built project. While we take your privacy seriously and follow good practices, this is not a commercial product. If you have concerns about using a student project, please reach out before signing up.
              </p>
            </Section>

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4 pb-2 border-b border-border">{title}</h2>
      <div className="text-muted-foreground space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}
