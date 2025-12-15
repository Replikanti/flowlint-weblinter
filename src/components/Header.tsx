import { Menu, Github, Chrome, Code2 } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.png"; // Předpokládám, že logo je na této cestě
import { cn } from "../lib/utils";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MAIN_SITE = "https://flowlint.dev";

  // Stejné odkazy jako v Headeru flowlint-web
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
      icon: Code2, // Používáme Code2 pro CLI, v původním Headeru bylo Terminal
    },
    {
      title: "GitHub App",
      href: `${MAIN_SITE}/github-app`,
      description: "Automated PR reviews and checks.",
      icon: Github,
    },
    // Web Validator je tato aplikace, takže odkaz na ni bude '/'
    {
      title: "Web Validator",
      href: "/", // Odkazuje na root weblinteru
      description: "Online linter for quick checks.",
      icon: Code2, // Placeholder ikona
      current: true, // Pro zvýraznění aktuální stránky
    },
  ];

  const resources = [
    {
      title: "Documentation",
      href: `${MAIN_SITE}/doc`,
      description: "Learn how to configure and use FlowLint.",
      icon: Code2,
    },
    {
      title: "Roadmap",
      href: `${MAIN_SITE}/roadmap`,
      description: "See what we are building next.",
      icon: Menu, // Placeholder ikona
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <a href={MAIN_SITE} className="flex items-center space-x-3 transition-opacity hover:opacity-80">
            <img src={logo} alt="FlowLint" className="h-8 w-8" />
            <span className="text-xl font-bold text-zinc-900 tracking-tight">FlowLint</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
            <nav className="flex items-center space-x-6">
              {products.map((item) => (
                <a key={item.title} href={item.href} className={cn(
                  "text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors",
                  item.current && "text-rose-600 font-bold" // Zvýraznění aktivní stránky
                )}>
                  {item.title}
                </a>
              ))}
              {resources.map((item) => (
                <a key={item.title} href={item.href} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                  {item.title}
                </a>
              ))}
              <a href={`${MAIN_SITE}/support`} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Support</a>
            </nav>
            <div className="h-4 w-px bg-zinc-200"></div>
            <a href="https://github.com/Replikanti/flowlint" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5 text-zinc-500 hover:text-zinc-900" />
            </a>
          </div>

          {/* Mobile Navigation */}
          <button className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-md" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white p-4 space-y-4 shadow-lg absolute w-full">
            {products.map((item) => (
                <a key={item.title} href={item.href} className={cn(
                  "block text-sm font-medium text-zinc-600 hover:text-rose-600",
                  item.current && "text-rose-600 font-bold"
                )}>
                  <item.icon className="h-4 w-4 mr-2 inline-block" /> {item.title}
                </a>
            ))}
            {resources.map((item) => (
                <a key={item.title} href={item.href} className="block text-sm font-medium text-zinc-600 hover:text-rose-600">
                  <item.icon className="h-4 w-4 mr-2 inline-block" /> {item.title}
                </a>
            ))}
            <a href={`${MAIN_SITE}/support`} className="block text-sm font-medium text-zinc-600 hover:text-rose-600">
              <Menu className="h-4 w-4 mr-2 inline-block" /> Support
            </a>
            <a href="https://github.com/Replikanti/flowlint" target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-zinc-600 hover:text-rose-600">
              <Github className="h-4 w-4 mr-2 inline-block" /> GitHub
            </a>
        </div>
      )}
    </header>
  );
};

export default Header;