import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1),
  type: z.enum(["link", "file", "text"]).optional(),
  url: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: experienceId } = await params;
  const docs = await prisma.experienceDocumentation.findMany({
    where: { experienceId },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(docs);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: experienceId } = await params;
    const body = schema.parse(await request.json());
    const item = await prisma.experienceDocumentation.create({
      data: {
        experienceId,
        title: body.title,
        type: body.type ?? "link",
        url: body.url ?? null,
        content: body.content ?? null,
        sortOrder: body.sortOrder ?? 0,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (error instanceof z.ZodError)
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
