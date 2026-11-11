export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="p-4 sm:p-6">{children}</div>;
}
