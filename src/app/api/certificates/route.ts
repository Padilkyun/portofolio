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

export async function GET() {
  const items = await prisma.certificate.findMany({
    orderBy: [{ sortOrder: "asc" }, { issuedAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const { issuedAt, sortOrder, projectId, type, ...rest } = body;
    const item = await prisma.certificate.create({
      data: {
        ...rest,
        type: type ?? "certificate",
        issuedAt: issuedAt ? new Date(issuedAt) : null,
        sortOrder: sortOrder ?? 0,
        projectId: projectId || null,
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
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 500 });
  }
}
