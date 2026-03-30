export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full min-h-[100dvh] bg-[var(--bg)] text-[var(--text)]">
      {children}
    </div>
  );
}
