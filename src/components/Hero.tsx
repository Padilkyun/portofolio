"use client";

import Link from "next/link";
import { ArrowDownRight, Github, Linkedin, Mail, MapPin, FileDown } from "lucide-react";
import { motion } from "framer-motion";
import { IdCard } from "@/components/IdCard";

type Profile = {
  name: string;
  title: string;
  tagline?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  location?: string | null;
  linkedin?: string | null;
  github?: string | null;
  resumeUrl?: string | null;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function Hero({ profile }: { profile: Profile | null }) {
  if (!profile) {
    return (
      <section className="section-pad">
        <div className="container-page">
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="text-sm text-muted">
              Profile empty. Open{" "}
              <Link href="/admin/login" className="underline">
                Admin
              </Link>{" "}
              to add data.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      className="relative overflow-hidden border-b border-border bg-white section-pad"
    >
      {/* Subtle grid bg */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container-page relative grid items-center gap-12 md:grid-cols-[1fr_auto]">
        {/* Left: text */}
        <div>
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Available for work
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl"
          >
            {profile.name}
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-3 text-lg text-muted md:text-xl"
          >
            {profile.title}
          </motion.p>

          {profile.tagline && (
            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600"
            >
              {profile.tagline}
            </motion.p>
          )}

          {profile.bio && (
            <motion.p
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-500"
            >
              {profile.bio}
            </motion.p>
          )}

          <motion.div
            custom={5}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted"
          >
            {profile.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} /> {profile.location}
              </span>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 transition hover:text-foreground"
              >
                <Mail size={13} /> {profile.email}
              </a>
            )}
          </motion.div>

          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#portfolio" className="btn btn-primary group">
              View Work{" "}
              <ArrowDownRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary group"
              >
                <FileDown size={15} className="transition-transform group-hover:-translate-y-0.5" />
                Download CV
              </a>
            )}
            {profile.linkedin && (
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            )}
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Right: ID Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hidden justify-self-center md:flex md:justify-self-end"
        >
          <IdCard photoUrl={profile.photoUrl} name={profile.name} />
        </motion.div>
      </div>

      {/* Mobile card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.5 }}
        className="container-page mt-10 flex justify-center md:hidden"
      >
        <IdCard photoUrl={profile.photoUrl} name={profile.name} />
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="container-page mt-14 hidden items-center gap-2 text-xs text-neutral-300 md:flex"
      >
        <span className="h-px w-8 bg-neutral-200" />
        scroll to explore
      </motion.div>
    </section>
  );
}
