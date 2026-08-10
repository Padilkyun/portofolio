import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  role: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
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
    const item = await prisma.stakeholder.create({
      data: {
        projectId,
        name: body.name,
        role: body.role,
        logoUrl: body.logoUrl,
        website: body.website,
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
    return NextResponse.json({ error: "Failed to create stakeholder" }, { status: 500 });
  }
}
