import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const MAIN_SITE = "https://flowlint.dev";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <a href={MAIN_SITE} className="flex items-center space-x-3 transition-opacity hover:opacity-80">
            <div className="h-8 w-8 bg-rose-500 rounded-md flex items-center justify-center text-white font-bold shadow-sm">F</div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">FlowLint</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <a href={`${MAIN_SITE}/doc`} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Documentation</a>
              <a href={`${MAIN_SITE}/roadmap`} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Roadmap</a>
              <a href={`${MAIN_SITE}/support`} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">Support</a>
            </nav>
            <div className="h-4 w-px bg-zinc-200"></div>
            <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-rose-600">Web Validator</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-zinc-600 hover:bg-zinc-100 rounded-md" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white p-4 space-y-4 shadow-lg absolute w-full">
            <a href={`${MAIN_SITE}/doc`} className="block text-sm font-medium text-zinc-600 hover:text-rose-600">Documentation</a>
            <a href={`${MAIN_SITE}/roadmap`} className="block text-sm font-medium text-zinc-600 hover:text-rose-600">Roadmap</a>
            <a href={`${MAIN_SITE}/support`} className="block text-sm font-medium text-zinc-600 hover:text-rose-600">Support</a>
            <div className="pt-2 border-t border-zinc-100">
                <span className="block text-sm font-semibold text-rose-600">Web Validator</span>
            </div>
        </div>
      )}
    </header>
  );
};

export default Header;
