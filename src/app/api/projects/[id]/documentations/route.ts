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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id: projectId } = await params;
    const body = schema.parse(await request.json());
    const item = await prisma.documentation.create({
      data: {
        projectId,
        title: body.title,
        type: body.type ?? "link",
        url: body.url,
        content: body.content,
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
    return NextResponse.json({ error: "Failed to create documentation" }, { status: 500 });
  }
}
