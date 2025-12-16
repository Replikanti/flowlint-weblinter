import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Chrome, 
  Terminal, 
  GitPullRequest, 
  Globe, 
  BookOpen, 
  Map, 
  LifeBuoy,
  Code2
} from "lucide-react";
import logo from "../assets/logo.png";

const MAIN_SITE = "https://flowlint.dev";

const Header = () => {
  const products = [
    {
      title: "Chrome Extension",
      href: `${MAIN_SITE}/chrome-extension`,
      description: "Real-time feedback directly inside the n8n editor.",
      icon: Chrome,
    },
    {
      title: "CLI Tool",
      href: `${MAIN_SITE}/cli`,
      description: "Lint workflows locally or in any CI/CD pipeline.",
      icon: Terminal,
    },
    {
      title: "GitHub App",
      href: `${MAIN_SITE}/github-app`,
      description: "Automated PR reviews and checks.",
      icon: GitPullRequest,
    },
    {
      title: "Web Linter",
      href: "/",
      description: "Online linter for quick checks.",
      icon: Globe,
      disabled: false,
      badge: "Current"
    },
  ];

  const resources = [
    {
      title: "Documentation",
      href: `${MAIN_SITE}/doc`,
      description: "Learn how to configure and use FlowLint.",
      icon: BookOpen,
    },
    {
      title: "Rule Examples",
      href: `${MAIN_SITE}/doc`,
      description: "See valid and invalid workflow patterns.",
      icon: Code2,
    },
    {
      title: "Roadmap",
      href: `${MAIN_SITE}/roadmap`,
      description: "See what we are building next.",
      icon: Map,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo - Left */}
          <a href={MAIN_SITE} className="flex items-center space-x-3 transition-opacity hover:opacity-80 mr-8">
            <img src={logo} alt="FlowLint" className="h-8 w-8" />
            <span className="text-xl font-bold text-foreground">FlowLint</span>
          </a>

          {/* Desktop Navigation - Centered/Right */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
            <NavigationMenu className="[&>div:last-child]:left-auto [&>div:last-child]:right-0">
              <NavigationMenuList>
                
                {/* Products Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href={MAIN_SITE}
                          >
                            <img src={logo} className="h-6 w-6 mb-3" alt="FlowLint" />
                            <div className="mb-2 text-lg font-medium">
                              FlowLint Suite
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              The ultimate quality control platform for n8n workflows.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      {products.map((product) => (
                        <ListItem
                          key={product.title}
                          title={product.title}
                          href={product.href}
                          icon={product.icon}
                          badge={product.badge}
                        >
                          {product.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {resources.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Direct Links */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a href={`${MAIN_SITE}/support`} className={navigationMenuTriggerStyle()}>
                      Support
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-6 mt-8">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">Products</h4>
                  <div className="flex flex-col space-y-2">
                    {products.map((item) => (
                      <MobileLink
                        key={item.title}
                        to={item.href}
                        external={item.href.startsWith("http")}
                        disabled={item.disabled}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.title}
                        {item.badge && <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5">{item.badge}</Badge>}
                      </MobileLink>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-3 uppercase tracking-wider">Resources</h4>
                  <div className="flex flex-col space-y-2">
                    {resources.map((item) => (
                      <MobileLink key={item.title} to={item.href} external={item.href.startsWith("http")}>
                         <item.icon className="h-4 w-4 mr-2" />
                        {item.title}
                      </MobileLink>
                    ))}
                  </div>
                </div>

                <div>
                  <MobileLink to={`${MAIN_SITE}/support`}>
                    <LifeBuoy className="h-4 w-4 mr-2" />
                    Support
                  </MobileLink>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { 
    icon: React.ElementType, 
    badge?: string 
  }
>(({ className, title, children, icon: Icon, badge, href, ...props }, ref) => {
  
  const content = (
    <>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <div className="text-sm font-medium leading-none">{title}</div>
        {badge && <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{badge}</Badge>}
      </div>
      <p className="line-clamp-2 text-sm leading-tight text-muted-foreground mt-1.5">
        {children}
      </p>
    </>
  );

  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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

interface MobileLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  disabled?: boolean;
}

const MobileLink = ({ to, children, className, external, disabled }: MobileLinkProps) => {
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
        className
      )}
    >
      {children}
    </a>
  );
}

export default Header;
