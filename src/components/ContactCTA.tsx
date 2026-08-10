"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { ExportPDFButton } from "@/components/ExportPDFButton";

export function ContactCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-pad border-t border-border bg-white" id="contact-cta">
      <div className="container-page" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-border bg-neutral-950 px-8 py-12 text-white md:px-14 md:py-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.15 }}
            className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500"
          >
            Collaboration
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 max-w-xl text-3xl font-semibold tracking-tight md:text-4xl"
          >
            Building reliable AIoT systems for real environments.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-400"
          >
            Open to roles, research collabs, and product builds in IoT, edge AI, and embedded
            intelligence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/contact"
              className="btn group bg-white text-neutral-900 hover:bg-neutral-100"
            >
              Get in touch
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
            <a
              href="#portfolio"
              className="btn border border-neutral-700 text-white hover:bg-neutral-900"
            >
              Browse projects
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.55 }}
            className="mt-5 border-t border-neutral-800 pt-5"
          >
            <ExportPDFButton />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
