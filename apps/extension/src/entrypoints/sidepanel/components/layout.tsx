function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background border-l shadow-2xl">
      {children}
    </div>
  );
}

export default Layout;
