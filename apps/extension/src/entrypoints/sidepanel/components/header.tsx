import { MousePointerClick } from "lucide-react";

function Header({
  backButton,
  title,
  rightButton,
}: {
  backButton?: React.ReactNode;
  title: string;
  rightButton: React.ReactNode;
}) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-2">
        {backButton ? (
          backButton
        ) : (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <MousePointerClick className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <span className="font-bold tracking-tight text-sm">{title}</span>
      </div>
      {rightButton}
    </header>
  );
}

export default Header;
