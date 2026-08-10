"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

export function IdCard({ photoUrl, name }: { photoUrl?: string | null; name: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 180,
    damping: 22,
  });

  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="select-none" style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.97 }}
        drag
        dragElastic={0.1}
        dragConstraints={{ top: -50, bottom: 50, left: -50, right: 50 }}
        whileDrag={{ scale: 1.03, cursor: "grabbing" }}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.25 }}
        className="relative w-72 cursor-grab overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl md:w-80"
      >
        {/* Shine overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl"
          style={{
            background: useTransform(
              [shineX, shineY],
              ([x, y]) =>
                `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.22) 0%, transparent 60%)`
            ),
          }}
        />

        {/* Header bar */}
        <div className="flex h-9 items-center justify-between bg-neutral-900 px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            <span className="h-2 w-2 rounded-full bg-green-400" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-neutral-400">ID CARD</span>
        </div>

        {/* Photo area */}
        <div className="relative aspect-[4/3] w-full bg-neutral-100">
          {photoUrl ? (
            <Image src={photoUrl} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-7xl font-semibold text-neutral-300">
              {initials}
            </div>
          )}
          {/* Subtle gradient at bottom of photo */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />
        </div>

        {/* Card body */}
        <div className="px-5 pb-5 pt-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Full Name
              </p>
              <p className="mt-0.5 truncate text-base font-semibold text-neutral-900">{name}</p>
            </div>
            {/* Role indicator dot */}
            <div className="mt-1 flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 ring-1 ring-green-200">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              <span className="text-[9px] font-semibold uppercase tracking-wide text-green-700">
                Active
              </span>
            </div>
          </div>

          {/* Fake barcode */}
          <div className="mt-4 flex h-8 gap-px overflow-hidden rounded opacity-25">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 bg-neutral-900"
                style={{ width: i % 4 === 0 ? 3 : i % 7 === 0 ? 1 : 2 }}
              />
            ))}
          </div>
          <p className="mt-1 text-center font-mono text-[8px] tracking-widest text-neutral-300">
            AIOT-ENGINEER-2025
          </p>
        </div>
      </motion.div>
    </div>
  );
}
