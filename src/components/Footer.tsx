import { Github, Chrome } from "lucide-react";
import logo from "../assets/logo.png"; // Předpokládám, že logo je na této cestě

const NpmIcon = () => ( // Zde je NpmIcon
  <svg className="h-5 w-5 mr-2" viewBox="0 0 780 250" fill="currentColor">
    <path d="M240,250h100v-50h100V0H240V250z M340,50h50v100h-50V50z M480,0v200h100V50h50v150h50V50h50v150h50V0H480z M0,200h100V50h50v150h50V0H0V200z"/>
  </svg>
);

const Footer = () => {
  const MAIN_SITE = "https://flowlint.dev"; // Pro absolutní odkazy

  const links = {
    product: [
      { name: "Documentation", href: `${MAIN_SITE}/doc` },
      { name: "Roadmap", href: `${MAIN_SITE}/roadmap` },
      { name: "Web Linter", href: "/", current: true },
      { name: "GitHub App", href: `${MAIN_SITE}/github-app` },
      { name: "CLI", href: `${MAIN_SITE}/cli` },
      { name: "Chrome Extension", href: `${MAIN_SITE}/chrome-extension` },
    ],
    opensource: [
      { name: "flowlint-core", href: "https://github.com/Replikanti/flowlint-core/tree/main" },
      { name: "flowlint-cli", href: "https://github.com/Replikanti/flowlint-cli/tree/main" },
      { name: "flowlint-chrome", href: "https://github.com/Replikanti/flowlint-chrome/tree/main" },
      { name: "flowlint-github-app", href: "https://github.com/Replikanti/flowlint-github-app/tree/main" },
      { name: "flowlint-weblinter", href: "https://github.com/Replikanti/flowlint-weblinter/tree/main" }, // Odkaz na tento repo
    ],
    company: [
      { name: "About", href: `${MAIN_SITE}/` }, // Odkaz na homepage
      { name: "Support", href: `${MAIN_SITE}/support` },
    ],
    legal: [
      { name: "Privacy Policy", href: `${MAIN_SITE}/privacy` },
      { name: "Terms of Service", href: `${MAIN_SITE}/tos` },
    ],
  };

  return (
    <footer className="border-t border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <a href={MAIN_SITE} className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="FlowLint" className="h-8 w-8" />
              <span className="text-lg font-bold text-zinc-900">FlowLint</span>
            </a>
            <p className="text-sm text-zinc-600 mb-4">
              Automated static analysis for n8n workflows. Open source and community driven.
            </p>
            <div className="space-y-3">
              <a
                href="https://github.com/Replikanti/flowlint"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                View on GitHub
              </a>
              <a
                href="https://chromewebstore.google.com/detail/flowlint-n8n-workflow-aud/ldefjlphmcjfccmofakmebddlecbieli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <Chrome className="h-5 w-5 mr-2" />
                Install Chrome Extension
              </a>
              <a
                href="https://www.npmjs.com/package/flowlint"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
              >
                <NpmIcon />
                Install CLI from npm
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Product</h3>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Open Source</h3>
            <ul className="space-y-2">
              {links.opensource.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Company</h3>
            <ul className="space-y-2">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-zinc-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200">
          <p className="text-sm text-zinc-600 text-center">
            © {new Date().getFullYear()} FlowLint. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;