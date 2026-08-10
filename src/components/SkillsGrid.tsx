"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
};

// Categorical labels mapped from 1–5
const LEVEL_MAP: Record<number, { label: string; color: string; bg: string; dot: string }> = {
  1: {
    label: "Beginner",
    color: "text-neutral-500",
    bg: "bg-neutral-100",
    dot: "bg-neutral-400",
  },
  2: {
    label: "Elementary",
    color: "text-blue-600",
    bg: "bg-blue-50",
    dot: "bg-blue-400",
  },
  3: {
    label: "Intermediate",
    color: "text-violet-600",
    bg: "bg-violet-50",
    dot: "bg-violet-400",
  },
  4: {
    label: "Advanced",
    color: "text-amber-600",
    bg: "bg-amber-50",
    dot: "bg-amber-400",
  },
  5: {
    label: "Expert",
    color: "text-green-700",
    bg: "bg-green-50",
    dot: "bg-green-500",
  },
};

function getLevelMeta(level: number) {
  return LEVEL_MAP[Math.max(1, Math.min(5, level))] ?? LEVEL_MAP[3];
}

function SkillItem({ skill, delay }: { skill: Skill; delay: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const meta = getLevelMeta(skill.level);

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay }}
      className="flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
        <span className="truncate text-sm font-medium text-foreground">{skill.name}</span>
      </div>
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${meta.bg} ${meta.color}`}
      >
        {meta.label}
      </span>
    </motion.li>
  );
}

function SkillCategory({
  category,
  skills,
  cardIndex,
}: {
  category: string;
  skills: Skill[];
  cardIndex: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: cardIndex * 0.08, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.06)" }}
      className="card p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          {category}
        </h3>
        <span className="ml-auto text-xs text-neutral-400">{skills.length}</span>
      </div>
      <ul className="space-y-2.5">
        {skills.map((s, i) => (
          <SkillItem key={s.id} skill={s} delay={cardIndex * 0.08 + i * 0.05} />
        ))}
      </ul>
    </motion.div>
  );
}

export function SkillsGrid({ items }: { items: Skill[] }) {
  if (!items.length) {
    return <p className="text-sm text-muted">No skills listed yet.</p>;
  }

  const groups = items.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ||= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.values(LEVEL_MAP).map((m) => (
          <span key={m.label} className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${m.bg} ${m.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
            {m.label}
          </span>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(groups).map(([category, skills], i) => (
          <SkillCategory key={category} category={category} skills={skills} cardIndex={i} />
        ))}
      </div>
    </div>
  );
}
