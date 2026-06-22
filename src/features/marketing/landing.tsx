"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  Brain,
  Check,
  ChevronDown,
  Code2,
  FileText,
  Flame,
  GraduationCap,
  Map,
  Menu,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { DifficultyBadge } from "@/components/shared/difficulty-badge";
const PricingCards = dynamic(
  () => import("@/features/subscription/pricing-cards").then((m) => m.PricingCards),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 animate-pulse rounded-xl border border-black/[0.08] bg-neutral-50 dark:border-white/[0.08] dark:bg-neutral-900" />
    ),
  },
);
import { APP_NAME, APP_VERSION, LANGUAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface LandingProblem {
  slug: string;
  title: string;
  difficulty: string;
  category: string;
  acceptanceRate: number | null;
}

/* ── design tokens (Geist) ────────────────────────────────────────── */
const ACCENT = "#006bff";
const card =
  "rounded-xl border border-black/[0.08] bg-white dark:border-white/[0.10] dark:bg-neutral-900";
const ink = "text-neutral-900 dark:text-neutral-50";
const ink2 = "text-neutral-600 dark:text-neutral-300";
const ink3 = "text-neutral-500 dark:text-neutral-400";
const border = "border-black/[0.08] dark:border-white/[0.10]";

/* ── data ─────────────────────────────────────────────────────────── */

const NAV = [
  ["Problems", "/problems"],
  ["Features", "#features"],
  ["AI Suite", "#ai"],
  ["Pricing", "#pricing"],
  ["Forum", "/forum"],
] as const;

const STATS = [
  { value: 500, suffix: "+", label: "Problems solved daily" },
  { value: 12, suffix: "", label: "Languages supported" },
  { value: 9, suffix: "", label: "AI-powered tools" },
  { value: 26, suffix: "+", label: "Platform features" },
];

const COMPANY_LOGOS = ["Google", "Meta", "Amazon", "Microsoft", "Netflix", "Uber", "Atlassian", "Apple"];

const FEATURES = [
  { icon: Code2, title: "VS Code–style Editor", body: "Full IntelliSense, multi-tab editing, 12 languages, hidden test cases and instant verdicts — zero config." },
  { icon: Bot, title: "AI Mentor", body: "Progressive hints that nudge you to the pattern without spoiling the solution." },
  { icon: Brain, title: "Spaced Repetition", body: "The SM-2 algorithm schedules reviews at the perfect moment so patterns stick." },
  { icon: BarChart3, title: "Skill Analytics", body: "Acceptance by topic and difficulty. See exactly where to focus next." },
  { icon: Flame, title: "Streaks & Gamification", body: "XP, levels, badges and leaderboards keep daily practice consistent." },
  { icon: Trophy, title: "Contests & Roadmaps", body: "Weekly contests, daily challenges and guided tracks from zero to offer." },
];

const AI_TOOLS = [
  { icon: GraduationCap, label: "Learning Coach" },
  { icon: Users, label: "Pair Programmer" },
  { icon: Map, label: "Roadmap Generator" },
  { icon: FileText, label: "Resume Analyzer" },
  { icon: Code2, label: "Code Reviewer" },
  { icon: BarChart3, label: "Complexity Visualizer" },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "SDE @ FAANG", avatar: "P", quote: "The AI mentor is the closest thing to a senior engineer next to you. Finally internalized sliding window." },
  { name: "Marcus T.", role: "Frontend Engineer", avatar: "M", quote: "Every other platform ignores frontend folks. The sandbox challenges with AI design review are exactly what I needed." },
  { name: "Aditi R.", role: "CS Student", avatar: "A", quote: "94-day streak and counting — went from failing easies to clearing mediums in one sitting." },
  { name: "Rohan K.", role: "Backend Dev → SDE-2", avatar: "R", quote: "Pair Programmer plus spaced repetition changed how I retain algorithms. Stopped forgetting patterns." },
  { name: "Sara M.", role: "Final Year Student", avatar: "S", quote: "Generated my entire 8-week study plan in 30 seconds. It even accounted for my weak topics." },
  { name: "James L.", role: "Senior SDE", avatar: "J", quote: "Weakness detection put my graph acceptance at 20%. Three weeks later it's 85%. Data-driven practice works." },
];

const FAQS = [
  { q: "Is CodeForge AI really free?", a: "Yes. Problems, frontend challenges, contests, roadmaps, all 9 AI tools and the forum are completely free. Just create an account." },
  { q: "Which languages can I code in?", a: "JavaScript, TypeScript, Python, Java, C, C++, C#, Go, PHP, Rust, Kotlin and Swift — all in a secure cloud sandbox." },
  { q: "How does the AI mentor differ from just asking ChatGPT?", a: "It sees your exact problem statement and current code in real time, so hints are specific to your approach. It also won't give you the full solution, by design." },
  { q: "What is spaced repetition?", a: "The SM-2 algorithm schedules reviews at increasing intervals based on recall quality. You review Two Sum at day 1, day 6, day 14 — cementing the pattern." },
  { q: "Can I prepare for specific companies?", a: "Yes — pick Google, Amazon, Microsoft, Meta, Netflix, Uber or Atlassian and track progress against each company's question patterns." },
  { q: "What's the AI Pair Programmer?", a: "A real-time streaming AI that reads your code and converses with you — suggests approaches, debugs errors and explains concepts." },
];

const STEPS = [
  { n: "01", title: "Create your free account", body: "Sign up with email, Google or GitHub. Pick your track: DSA, Frontend, or both. Takes 30 seconds." },
  { n: "02", title: "Solve, practice, and learn", body: "Code in a full editor. The AI mentor gives hints. Spaced repetition locks in patterns." },
  { n: "03", title: "Level up and get hired", body: "Earn XP, keep streaks, climb leaderboards, and walk into any interview prepared." },
];

const FOOTER_COLS = [
  { heading: "Platform", links: [{ label: "Problems", href: "/problems" }, { label: "Challenges", href: "/challenges" }, { label: "Contests", href: "/contests" }, { label: "Roadmaps", href: "/roadmaps" }, { label: "Leaderboard", href: "/leaderboard" }] },
  { heading: "AI Tools", links: [{ label: "Learning Coach", href: "/ai-tools" }, { label: "Pair Programmer", href: "/ai-tools" }, { label: "Study Planner", href: "/ai-tools" }, { label: "Resume Analyzer", href: "/ai-tools" }] },
  { heading: "Community", links: [{ label: "Forum", href: "/forum" }, { label: "Discussions", href: "/discuss" }, { label: "Notes", href: "/notes" }, { label: "Company Prep", href: "/companies" }] },
  { heading: "Legal", links: [{ label: "Terms", href: "/terms" }, { label: "Privacy", href: "/privacy" }, { label: "Changelog", href: "/changelog" }, { label: "Feedback", href: "/feedback" }] },
];

/* ── helpers ──────────────────────────────────────────────────────── */

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay, ease: [0.175, 0.885, 0.32, 1.1] }}
    >
      {children}
    </motion.div>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setDisplay(value); return; }
    const controls = animate(0, value, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value, reduce]);
  return <span ref={ref}>{display}{suffix}</span>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-[13px] font-medium tracking-tight" style={{ color: ACCENT }}>
      {children}
    </span>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={cn("mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl", ink)}>{title}</h2>
      {sub && <p className={cn("mt-3 text-base sm:text-lg", ink3)}>{sub}</p>}
    </Reveal>
  );
}

function slowScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const target = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top: target, behavior: "smooth" });
}

/* ── page ─────────────────────────────────────────────────────────── */

export function Landing({ signedIn, problems, totalProblems }: { signedIn: boolean; problems: LandingProblem[]; totalProblems: number }) {
  const ctaHref = signedIn ? "/dashboard" : "/register";
  const [mobileMenu, setMobileMenu] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const navClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href") ?? "";
    if (href.startsWith("#")) {
      e.preventDefault();
      slowScrollTo(href.slice(1));
      setMobileMenu(false);
    }
  }, []);

  const primaryBtn = "h-10 rounded-md bg-neutral-900 px-4 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200";

  return (
    <div className={cn("min-h-screen bg-white antialiased dark:bg-neutral-950", ink)}>
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className={cn("sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl dark:bg-neutral-950/80", border)}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className={cn("hidden items-center gap-7 text-sm md:flex", ink2)}>
            {NAV.map(([label, href]) => (
              <a key={label} href={href} onClick={navClick} className="transition-colors hover:text-neutral-900 dark:hover:text-white">
                {label}
                {label === "Problems" && totalProblems > 0 && (
                  <span className={cn("ml-1.5 rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums", ink3, "bg-black/[0.05] dark:bg-white/[0.08]")}>{totalProblems}</span>
                )}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {signedIn ? (
              <Button asChild size="sm" className={primaryBtn}>
                <Link href="/dashboard">Dashboard <ArrowRight className="size-4" /></Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className={cn("hidden sm:inline-flex h-10 rounded-md px-3", ink2)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className={primaryBtn}>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
            <button className={cn("md:hidden", ink2)} onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
              {mobileMenu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("overflow-hidden border-t md:hidden", border)}
            >
              <nav className="flex flex-col gap-1 px-4 py-3">
                {NAV.map(([label, href]) => (
                  <a key={label} href={href} onClick={navClick} className={cn("rounded-md px-3 py-2.5 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.06]", ink2)}>{label}</a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px]", border, ink2)}>
              <span className="size-1.5 rounded-full" style={{ background: ACCENT }} />
              26+ features · 9 AI tools · 100% free
            </div>
            <h1 className={cn("mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl", ink)}>
              Master coding interviews with AI.
            </h1>
            <p className={cn("mt-5 max-w-lg text-pretty text-lg leading-relaxed", ink3)}>
              The only platform that combines LeetCode-style problems, AI pair programming, spaced repetition and skill analytics — all free.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className={cn(primaryBtn, "h-11 px-5 text-base")}>
                <Link href={ctaHref}>Start for Free <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={cn("h-11 rounded-md px-5 text-base", border, ink2)}>
                <a href="#ai" onClick={navClick}>See AI in Action</a>
              </Button>
            </div>
            <div className={cn("mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm", ink3)}>
              {["No credit card", "12 languages", "9 AI tools", "Community forum"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="size-4" style={{ color: ACCENT }} /> {item}
                </span>
              ))}
            </div>
          </div>

          {/* Code card — visible immediately (no opacity gate) */}
          <div className={cn("overflow-hidden rounded-2xl shadow-[0_2px_2px_rgba(0,0,0,0.04)]", card)}>
            <div className={cn("flex items-center gap-1.5 border-b px-4 py-3", border)}>
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
              <span className={cn("ml-2 font-mono text-xs", ink3)}>solution.py</span>
            </div>
            <pre className={cn("overflow-x-auto p-5 font-mono text-[13px] leading-relaxed", ink2)}>
{`def maxProfit(prices):
    min_price = float("inf")
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`}
            </pre>
            <div className={cn("flex items-center gap-2 border-t px-5 py-3 text-xs", border, ink3)}>
              <Check className="size-4" style={{ color: ACCENT }} />
              All 12 test cases passed · 48 ms · beats 97%
            </div>
          </div>
        </section>

        {/* ── COMPANY TRUST ────────────────────────────────────────── */}
        <section className={cn("border-y py-12", border)}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className={cn("mb-7 text-center text-[13px]", ink3)}>Engineers at world-class companies practice here</p>
            <div className={cn("flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm font-medium", ink3)}>
              {COMPANY_LOGOS.map((name) => (
                <span key={name} className="transition-colors hover:text-neutral-900 dark:hover:text-white">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border sm:grid-cols-4 sm:border-0 sm:gap-6 sm:rounded-none">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.05} className={cn("p-6 text-center sm:rounded-xl sm:border", card, border)}>
                <p className={cn("text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl", ink)}>
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className={cn("mt-2 text-sm", ink3)}>{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────── */}
        <section id="features" className={cn("border-t py-24", border)}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow="Features" title={<>26+ features. Zero paywalls.</>} sub="One platform for algorithms, frontend, AI tools, community and analytics." />
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={(i % 3) * 0.05}>
                  <div className={cn("h-full p-6 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/60", card)}>
                    <f.icon className="size-5" style={{ color: ACCENT }} />
                    <h3 className={cn("mt-4 text-base font-semibold tracking-tight", ink)}>{f.title}</h3>
                    <p className={cn("mt-2 text-sm leading-relaxed", ink3)}>{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI SUITE ─────────────────────────────────────────────── */}
        <section id="ai" className={cn("border-t py-24", border)}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow="AI Suite" title={<>9 AI tools. One platform.</>} sub="From personalized coaching to pair programming — AI is woven into every part of your practice." />
            <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {AI_TOOLS.map((tool, i) => (
                <Reveal key={tool.label} delay={(i % 3) * 0.05}>
                  <div className={cn("flex h-full items-center gap-3 p-5", card)}>
                    <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-md border", border)}>
                      <tool.icon className="size-4.5" style={{ color: ACCENT }} />
                    </span>
                    <span className={cn("text-sm font-medium", ink)}>{tool.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
        <section className={cn("border-t py-24", border)}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow="How it works" title={<>From zero to offer in three steps</>} />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.07}>
                  <div className={cn("h-full p-7", card)}>
                    <span className="font-mono text-sm font-medium" style={{ color: ACCENT }}>{step.n}</span>
                    <h3 className={cn("mt-4 text-lg font-semibold tracking-tight", ink)}>{step.title}</h3>
                    <p className={cn("mt-2 text-sm leading-relaxed", ink3)}>{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMS PREVIEW ─────────────────────────────────────── */}
        {problems.length > 0 && (
          <section className={cn("border-t py-24", border)}>
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr]">
              <Reveal>
                <Eyebrow>Problem bank</Eyebrow>
                <h2 className={cn("mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl", ink)}>
                  {totalProblems}+ real interview questions, ready to run.
                </h2>
                <p className={cn("mt-4", ink3)}>DSA classics, JavaScript deep-dives and React pattern exercises — every problem executes against hidden test cases in the cloud.</p>
                <Button asChild size="lg" className={cn(primaryBtn, "mt-7 h-11 px-5")}>
                  <Link href="/problems">Browse All Problems <ArrowRight className="size-4" /></Link>
                </Button>
              </Reveal>
              <Reveal delay={0.05} className={cn("overflow-hidden rounded-xl", card)}>
                {problems.map((problem, index) => (
                  <Link
                    key={problem.slug}
                    href={`/problems/${problem.slug}`}
                    className={cn("group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60", index !== 0 && "border-t", border)}
                  >
                    <span className={cn("font-mono text-xs tabular-nums", ink3)}>{String(index + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm font-medium", ink)}>{problem.title}</p>
                      <p className={cn("text-xs", ink3)}>{problem.category}</p>
                    </div>
                    <DifficultyBadge difficulty={problem.difficulty} />
                    <ArrowUpRight className={cn("size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5", ink3)} />
                  </Link>
                ))}
              </Reveal>
            </div>
          </section>
        )}

        {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
        <section className={cn("border-t py-24", border)}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHead eyebrow="Testimonials" title={<>Loved by thousands of coders</>} />
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={(i % 3) * 0.05}>
                  <figure className={cn("flex h-full flex-col p-6", card)}>
                    <blockquote className={cn("flex-1 text-sm leading-relaxed", ink2)}>“{t.quote}”</blockquote>
                    <figcaption className={cn("mt-5 flex items-center gap-3 border-t pt-4", border)}>
                      <span className={cn("flex size-9 items-center justify-center rounded-full text-sm font-medium", "bg-black/[0.05] dark:bg-white/[0.08]", ink)}>{t.avatar}</span>
                      <span>
                        <span className={cn("block text-sm font-medium", ink)}>{t.name}</span>
                        <span className={cn("block text-xs", ink3)}>{t.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────── */}
        <section id="pricing" className={cn("border-t py-24", border)}>
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <SectionHead eyebrow="Pricing" title={<>Start free, level up fast.</>} sub="7-day free trial on all paid plans. No credit card required." />
            <Reveal delay={0.1} className="mt-12">
              <PricingCards />
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────── */}
        <section id="faq" className={cn("border-t py-24", border)}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHead eyebrow="FAQ" title="Frequently asked" />
            <div className="mt-12 space-y-2">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className={cn("overflow-hidden rounded-xl border", border)}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className={cn("flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium", ink)}
                  >
                    {faq.q}
                    <ChevronDown className={cn("size-4 shrink-0 transition-transform", ink3, openFaq === i && "rotate-180")} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className={cn("border-t px-5 py-4 text-sm leading-relaxed", border, ink3)}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────── */}
        <section className={cn("border-t py-28", border)}>
          <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className={cn("text-4xl font-semibold tracking-[-0.04em] sm:text-5xl", ink)}>Your next offer starts now.</h2>
            <p className={cn("mx-auto mt-5 max-w-lg text-lg", ink3)}>
              Free forever. 26+ features. 9 AI tools. No credit card — just you, the editor, and an AI mentor that never sleeps.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className={cn(primaryBtn, "h-12 px-7 text-base")}>
                <Link href={ctaHref}>Create Free Account <ArrowRight className="size-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className={cn("h-12 rounded-md px-7 text-base", border, ink2)}>
                <Link href="/problems">Browse Problems</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className={cn("border-t", border)}>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className={cn("mt-4 max-w-xs text-sm leading-relaxed", ink3)}>
                The AI-powered platform for mastering data structures, algorithms and frontend engineering — built for your next interview.
              </p>
              <a
                href="https://github.com/nitheeshdr/codeforge-ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={cn("mt-6 inline-flex size-9 items-center justify-center rounded-md border transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]", border, ink3)}
              >
                <GithubIcon className="size-4" />
              </a>
            </div>
            {FOOTER_COLS.map((col) => (
              <nav key={col.heading}>
                <h3 className={cn("mb-4 text-[13px] font-medium", ink3)}>{col.heading}</h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={cn("text-sm transition-colors hover:text-neutral-900 dark:hover:text-white", ink3)}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className={cn("border-t", border)}>
          <div className={cn("mx-auto grid max-w-6xl grid-cols-1 gap-y-3 px-4 py-5 text-xs sm:grid-cols-3 sm:items-center sm:px-6", ink3)}>
            <p>© {new Date().getFullYear()} {APP_NAME}</p>
            <div className="flex items-center justify-center gap-2">
              <span>from</span>
              <img src="/white.png" alt="Setups Works" className="hidden h-5 w-auto dark:inline-block" />
              <img src="/black.png" alt="Setups Works" className="inline-block h-5 w-auto dark:hidden" />
            </div>
            <div className="flex items-center gap-4 sm:justify-end">
              <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white">Terms</Link>
              <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white">Privacy</Link>
              <span className={cn("rounded-full border px-2 py-0.5 font-mono", border)}>v{APP_VERSION}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── icons ────────────────────────────────────────────────────────── */
function GithubIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.86.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.25C22 6.58 17.52 2 12 2" /></svg>;
}
