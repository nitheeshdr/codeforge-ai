import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import { resetPasswordSchema } from "@/schemas/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit("auth", req);
  if (limited) return limited;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { token, password } = parsed.data;

  await connectDB();
  const user = await User.findOne({ passwordResetToken: token })
    .select("+passwordResetToken +passwordResetExpiry")
    .lean();

  if (!user) {
    return NextResponse.json(
      { error: "Invalid or expired reset link. Please request a new one." },
      { status: 400 },
    );
  }

  if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
    return NextResponse.json(
      { error: "This reset link has expired. Please request a new one." },
      { status: 400 },
    );
  }

  const hashed = await bcrypt.hash(password, 12);
  await User.updateOne(
    { _id: user._id },
    {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  );

  return NextResponse.json({ ok: true });
}
