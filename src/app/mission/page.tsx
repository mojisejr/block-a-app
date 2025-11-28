import { Construction } from "lucide-react";

export default function MissionPage() {
  return (
    <div className="container max-w-md mx-auto min-h-screen p-6 pb-24 flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-4 rounded-full bg-primary/10">
        <Construction className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
      <p className="text-muted-foreground">
        The Smart Training Campaign Manager is currently under construction.
        Get ready to plan your season like a pro!
      </p>
    </div>
  );
}
