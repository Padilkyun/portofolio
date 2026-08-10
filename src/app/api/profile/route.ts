import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  resumeUrl: z.string().optional().nullable(),
});

export async function GET() {
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = schema.parse(await request.json());
    const existing = await prisma.profile.findFirst();
    const profile = existing
      ? await prisma.profile.update({ where: { id: existing.id }, data: body })
      : await prisma.profile.create({ data: body });
    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
