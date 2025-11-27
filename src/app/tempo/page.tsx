import { TempoDesigner } from "@/components/tempo-designer";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Logo } from "@/components/ui/logo";

export default function TempoPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 max-w-md mx-auto">
          <Logo />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto px-4 py-8">
        <TempoDesigner />
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Block A Running Club</p>
        <p className="text-xs mt-1">"There are no finish line"</p>
      </footer>
    </div>
  );
}
