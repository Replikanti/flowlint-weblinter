import { useState, useMemo } from 'react';
import { parseN8n, runAllRules, defaultConfig } from '@replikanti/flowlint-core';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { cn } from './lib/utils';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [jsonInput, setJsonInput] = useState('');

  const { findings, error, graph } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { findings: [], error: null, graph: null };
    }

    try {
      const parsedGraph = parseN8n(jsonInput);
      
      const results = runAllRules(parsedGraph, {
        path: 'workflow.json',
        cfg: defaultConfig,
      });
      
      return { findings: results, error: null, graph: parsedGraph };
    } catch (err) {
      return { findings: [], error: (err as Error).message, graph: null };
    }
  }, [jsonInput]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />
      
      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {/* Left Panel: Editor */}
        <div className="w-full md:w-1/2 p-4 border-r border-zinc-200 flex flex-col h-full bg-white md:bg-zinc-50">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-800">
            <Copy className="w-5 h-5" /> Input Workflow
          </h2>
          <textarea
            className="flex-1 w-full p-4 font-mono text-sm bg-white border border-zinc-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-zinc-700 placeholder:text-zinc-400 shadow-sm"
            placeholder="Paste your n8n workflow JSON here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">Invalid JSON: {error}</span>
            </div>
          )}
        </div>

        {/* Right Panel: Results */}
        <div className="w-full md:w-1/2 p-4 bg-white h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 backdrop-blur py-2 z-10 border-b border-zinc-100">
            <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
              Analysis Results
            </h2>
            {graph && (
              <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                {graph.nodes.length} nodes analyzed
              </span>
            )}
          </div>

          {findings.length === 0 && !error && jsonInput && (
            <div className="flex flex-col items-center justify-center h-64 text-green-600 animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-semibold">No issues found!</p>
              <p className="text-sm text-green-600/80 mt-1">Your workflow follows all defined rules.</p>
            </div>
          )}

          {findings.length === 0 && !jsonInput && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <p className="text-sm">Paste a workflow JSON to start analyzing.</p>
            </div>
          )}

          <div className="space-y-4 pb-8">
            {findings.map((finding, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-4 border rounded-lg border-l-4 shadow-sm transition-all hover:shadow-md",
                  finding.severity === 'must' ? "border-l-red-500 bg-white border-zinc-200" :
                  finding.severity === 'should' ? "border-l-orange-500 bg-white border-zinc-200" :
                  "border-l-blue-500 bg-white border-zinc-200"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wide",
                    finding.severity === 'must' ? "bg-red-100 text-red-700" :
                    finding.severity === 'should' ? "bg-orange-100 text-orange-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {finding.severity}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono ml-2">{finding.rule}</span>
                </div>
                <h3 className="font-medium text-zinc-900 text-base leading-snug">{finding.message}</h3>
                {finding.raw_details && (
                  <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{finding.raw_details}</p>
                )}
                <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-end">
                  <code className="text-[10px] text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded">
                    Node ID: {finding.nodeId}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
