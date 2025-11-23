import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function ThemePage() {
  return (
    <div className="min-h-screen bg-background p-8 font-sans text-foreground">
      <header className="mb-12 flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Design System</h1>
          <p className="text-muted-foreground">Minimalist Racer Theme</p>
        </div>
        <ThemeToggle />
      </header>

      <main className="space-y-16">
        {/* Logo Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Brand Identity</h2>
          <div className="flex items-center gap-8 rounded-lg border p-8">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Dynamic Logo</p>
              <Logo />
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Color Palette</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <div className="h-24 w-full rounded-md bg-primary shadow-sm" />
              <div className="space-y-1">
                <p className="font-medium">Primary Red</p>
                <p className="text-xs text-muted-foreground">#DC2626 (approx)</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 w-full rounded-md bg-background border shadow-sm" />
              <div className="space-y-1">
                <p className="font-medium">Background</p>
                <p className="text-xs text-muted-foreground">Theme Dependent</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 w-full rounded-md bg-card border shadow-sm" />
              <div className="space-y-1">
                <p className="font-medium">Card Surface</p>
                <p className="text-xs text-muted-foreground">Theme Dependent</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-24 w-full rounded-md bg-muted" />
              <div className="space-y-1">
                <p className="font-medium">Muted / Secondary</p>
                <p className="text-xs text-muted-foreground">Theme Dependent</p>
              </div>
            </div>
          </div>
        </section>

        {/* Typography Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Typography</h2>
          <div className="space-y-6 rounded-lg border p-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
              <p className="text-muted-foreground">Inter Bold, Tracking -0.02em</p>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
              <p className="text-muted-foreground">Inter Semibold, Tracking -0.02em</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold tracking-tight">Heading 3</h3>
              <p className="text-muted-foreground">Inter Semibold</p>
            </div>
            <div className="space-y-2">
              <p className="leading-7">
                Body text. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <p className="text-muted-foreground">Inter Regular</p>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-2xl">04:30 /km</p>
              <p className="text-muted-foreground">Monospace Numbers (Pace/Time)</p>
            </div>
          </div>
        </section>

        {/* Components Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Interactive Components</h2>
          <div className="flex flex-wrap gap-4 rounded-lg border p-8">
            <Button>Primary Action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
