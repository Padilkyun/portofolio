import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional().nullable(),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const items = await prisma.experience.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const item = await prisma.experience.create({
      data: {
        ...body,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        isCurrent: body.isCurrent ?? false,
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
    return NextResponse.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
