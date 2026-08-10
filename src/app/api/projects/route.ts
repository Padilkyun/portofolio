import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const techSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  summary: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  problemStatement: z.string().optional().nullable(),
  techSolutions: z.array(techSchema).optional(),
  year: z.number().int().optional().nullable(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  liveUrl: z.string().optional().nullable(),
  githubUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const items = await prisma.project.findMany({
    orderBy: [{ sortOrder: "asc" }, { year: "desc" }],
    include: {
      stakeholders: true,
      _count: { select: { documentations: true, visualizations: true } },
    },
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const baseSlug = body.slug?.trim() || slugify(body.title);
    let slug = baseSlug;
    let i = 1;
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${i++}`;
    }

    const item = await prisma.project.create({
      data: {
        title: body.title,
        slug,
        summary: body.summary,
        description: body.description,
        coverImage: body.coverImage,
        problemStatement: body.problemStatement,
        techSolutions: JSON.stringify(body.techSolutions ?? []),
        year: body.year ?? null,
        featured: body.featured ?? false,
        status: body.status ?? "published",
        liveUrl: body.liveUrl,
        githubUrl: body.githubUrl,
        category: body.category ?? null,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
