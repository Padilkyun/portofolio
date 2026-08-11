"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";

type Visualization = {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  caption?: string | null;
};

function VisualizationModal({
  item,
  onClose,
}: {
  item: Visualization | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!item) return;

    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-neutral-950/85 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Close visualization preview"
          >
            <X size={18} />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[45vh] flex-1 bg-neutral-100 md:min-h-[70vh]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full min-h-[45vh] items-center justify-center text-sm text-muted">
                  No image
                </div>
              )}
            </div>

            <div className="border-t border-neutral-200 bg-white p-5 md:p-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
                    Visualization Preview
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  )}
                </div>
                {item.caption && (
                  <p className="max-w-sm text-xs italic leading-relaxed text-neutral-400 md:text-right">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function VisualizationGallery({ items }: { items: Visualization[] }) {
  const [active, setActive] = useState<Visualization | null>(null);

  if (!items.length) {
    return <p className="text-sm text-muted">No visualization cards yet.</p>;
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((viz) => (
          <button
            key={viz.id}
            type="button"
            onClick={() => setActive(viz)}
            className="card group/viz overflow-hidden text-left"
          >
            <div className="relative aspect-[4/3] cursor-zoom-in overflow-hidden bg-surface">
              {viz.imageUrl ? (
                <Image
                  src={viz.imageUrl}
                  alt={viz.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/viz:scale-[1.15]"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted">
                  No image
                </div>
              )}
              <div className="absolute inset-0 bg-neutral-950/0 transition-colors duration-300 group-hover/viz:bg-neutral-950/20" />
              <span className="absolute right-3 top-3 flex h-9 w-9 translate-y-1 items-center justify-center rounded-full bg-white/0 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover/viz:translate-y-0 group-hover/viz:bg-white/95 group-hover/viz:opacity-100">
                <Maximize2 size={15} />
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-medium">{viz.title}</h3>
              {viz.description && (
                <p className="mt-1 text-sm text-muted">{viz.description}</p>
              )}
              {viz.caption && (
                <p className="mt-2 text-xs italic text-neutral-400">{viz.caption}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      <VisualizationModal item={active} onClose={() => setActive(null)} />
    </>
  );
}
