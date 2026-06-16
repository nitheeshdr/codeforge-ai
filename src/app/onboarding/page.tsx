import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";

export const metadata = { title: "Welcome — CodeForge AI" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // If already onboarded, send to dashboard
  await connectDB();
  const user = await User.findById(session.user.id).select("onboarding name").lean();
  if (user?.onboarding?.completed) redirect("/dashboard");

  return <OnboardingWizard name={session.user.name ?? "there"} />;
}
