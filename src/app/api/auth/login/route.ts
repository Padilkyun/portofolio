import { NextResponse } from "next/server";
import { z } from "zod";
import { loginAdmin } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const admin = await loginAdmin(data.email, data.password);
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    return NextResponse.json({ ok: true, email: admin.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
