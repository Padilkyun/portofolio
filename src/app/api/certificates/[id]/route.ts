import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  issuer: z.string().optional().nullable(),
  issuedAt: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  type: z.enum(["certificate", "achievement"]).optional(),
  sortOrder: z.number().int().optional(),
  projectId: z.string().optional().nullable(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await prisma.certificate.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = schema.parse(await request.json());
    const { issuedAt, sortOrder, projectId, type, ...rest } = body;
    const item = await prisma.certificate.update({
      where: { id },
      data: {
        ...rest,
        type: type ?? "certificate",
        issuedAt: issuedAt ? new Date(issuedAt) : null,
        sortOrder: sortOrder ?? 0,
        projectId: projectId || null,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to update certificate" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.certificate.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 500 });
  }
}
