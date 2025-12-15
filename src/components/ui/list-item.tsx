import * as React from "react"
import { NavigationMenuLink } from "./navigation-menu"
import { cn } from "@/lib/utils"
import { Badge } from "./badge" // Předpokládám, že Badge je importován z ui

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  title: string,
  icon: React.ElementType, 
  external?: boolean, 
  disabled?: boolean,
  badge?: string,
  current?: boolean // Pro zvýraznění aktivní položky
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  ListItemProps
>(({ className, title, children, icon: Icon, external, disabled, badge, href, current, ...props }, ref) => {
  
  const content = (
    <>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <div className="text-sm font-medium leading-none">{title}</div>
        {badge && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{badge}</Badge>}
      </div>
      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1.5">
        {children}
      </p>
    </>
  );

  if (disabled) {
     return (
        <div className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none opacity-50 cursor-not-allowed",
          className
        )}>
           {content}
        </div>
     )
  }

  // Všechny odkazy v ListItem budou <a> tagy
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            current && "text-rose-600 font-bold", // Zvýraznění aktivní položky
            className
          )}
          {...props}
        >
          {content}
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export { ListItem }
