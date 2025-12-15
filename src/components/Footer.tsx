const Footer = () => {
  const MAIN_SITE = "https://flowlint.dev";
  return (
    <footer className="border-t border-zinc-200 bg-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} FlowLint. All rights reserved.</p>
        <div className="flex gap-6">
          <a href={`${MAIN_SITE}/privacy`} className="hover:text-zinc-900 hover:underline transition-colors">Privacy Policy</a>
          <a href={`${MAIN_SITE}/terms`} className="hover:text-zinc-900 hover:underline transition-colors">Terms of Service</a>
          <a href="https://github.com/Replikanti/flowlint" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 hover:underline transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;