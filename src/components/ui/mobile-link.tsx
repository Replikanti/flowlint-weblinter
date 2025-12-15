import * as React from "react"
import { cn } from "@/lib/utils"

interface MobileLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  disabled?: boolean;
  current?: boolean;
}

const MobileLink = ({ to, children, className, external, disabled, current }: MobileLinkProps) => {
  if (disabled) {
      return (
        <span className={cn(
            "flex items-center w-full px-2 py-2 text-sm font-medium text-muted-foreground/50 cursor-not-allowed",
            className
        )}>
            {children}
        </span>
      )
  }

  return (
    <a
      href={to}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center w-full px-2 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md",
        current && "text-rose-600 font-bold", // Zvýraznění aktivní položky
        className
      )}
    >
      {children}
    </a>
  );
}

export { MobileLink }
