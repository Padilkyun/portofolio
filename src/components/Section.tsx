"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section id={id} className={cn("section-pad", className)}>
      <div className="container-page">
        <div ref={headerRef} className="mb-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted"
          >
            <span className="h-px w-5 bg-current opacity-40" />
            {title}
          </motion.p>

          {subtitle && (
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              {subtitle}
            </motion.h2>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}
