"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Timer, Activity, Zap } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Race Pacer",
      href: "/",
      icon: Timer,
    },
    {
      name: "Intervals",
      href: "/interval",
      icon: Activity,
    },
    {
      name: "Tempo",
      href: "/tempo",
      icon: Zap, // Using Zap icon for Tempo as used in the designer
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t">
      <div className="container max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`h-6 w-6 ${isActive ? "stroke-[2.5px]" : "stroke-2"}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
