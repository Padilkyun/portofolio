import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.number().int().min(1).max(5).optional(),
  icon: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const items = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const item = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
        level: body.level ?? 3,
        icon: body.icon,
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
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
