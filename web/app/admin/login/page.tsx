import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await verifyAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-16">
      <LoginForm />
    </div>
  );
}
