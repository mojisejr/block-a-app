"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Timer, Activity, Zap, Calendar, Target } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Pacer",
      href: "/",
      icon: Timer,
    },
    {
      name: "Intervals",
      href: "/interval",
      icon: Activity,
    },
    {
      name: "Mission",
      href: "/mission",
      icon: Target,
    },
    {
      name: "Tempo",
      href: "/tempo",
      icon: Zap,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: Calendar,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-t border-border/40 shadow-lg pb-safe">
      <div className="container max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 relative ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground/60 hover:text-foreground"
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                isActive ? "bg-primary/10 scale-110" : "group-hover:bg-accent"
              }`}>
                <item.icon 
                  className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? "stroke-[2.5px]" : "stroke-2"
                  }`} 
                />
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${
                isActive ? "opacity-100 font-semibold" : "opacity-70"
              }`}>
                {item.name}
              </span>
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-in fade-in zoom-in duration-300" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
