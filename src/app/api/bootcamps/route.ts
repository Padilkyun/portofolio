import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  organizer: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  certificateUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  const items = await prisma.bootcamp.findMany({
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const item = await prisma.bootcamp.create({
      data: {
        name: body.name,
        organizer: body.organizer,
        description: body.description,
        certificateUrl: body.certificateUrl,
        logoUrl: body.logoUrl,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        skills: JSON.stringify(body.skills ?? []),
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
    return NextResponse.json({ error: "Failed to create bootcamp" }, { status: 500 });
  }
}
