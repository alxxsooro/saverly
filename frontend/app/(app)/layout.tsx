import { AppNavbar } from "@/components/app/AppNavbar";
import { AuthGuard } from "@/components/app/AuthGuard";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <AuthGuard>
        <AppNavbar />
        {children}
      </AuthGuard>
    </div>
  );
}
