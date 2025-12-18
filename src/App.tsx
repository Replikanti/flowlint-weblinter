import { useState, useMemo, lazy, Suspense } from 'react';
import { parseN8n, runAllRules, defaultConfig, RULES_METADATA, type Finding, type RuleConfig, type FlowLintConfig } from '@replikanti/flowlint-core';
import { Loader2 } from 'lucide-react';
import { cn } from './lib/utils';
import Header from './components/Header';
import Footer from './components/Footer';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { encodeState, decodeState, type AppState } from './lib/url-state';
import { EditorPanel } from './components/EditorPanel';
import { CanvasPanel } from './components/CanvasPanel';
import { ResultsPanel } from './components/ResultsPanel';

// import { RuleModal } from './components/RuleModal'; // Odstraněno

const LazyRuleModal = lazy(() => import('./components/RuleModal').then(module => ({ default: module.RuleModal })));

const LoadingSpinner = () => (
  <div className="flex h-6 w-6 items-center justify-center">
    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
  </div>
);

function App() {
  const [jsonInput, setJsonInput] = useState(() => {
    // Initial load from URL
    const params = new URLSearchParams(globalThis.location.search);
    const stateParam = params.get('state');
    if (stateParam) {
      const decoded = decodeState(stateParam);
      if (decoded?.workflow) {
        try {
            return JSON.stringify(decoded.workflow, null, 2);
        } catch (e) {
            console.error("Failed to stringify loaded workflow", e);
        }
      }
    }
    return '';
  });

  const [groupBySeverity, setGroupBySeverity] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Initialize enabled rules state
  const [enabledRules, setEnabledRules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    RULES_METADATA.forEach(rule => {
      initial[rule.id] = true;
    });
    return initial;
  });

  const activeRuleCount = Object.values(enabledRules).filter(Boolean).length;
  const totalRuleCount = RULES_METADATA.length;

  const toggleRule = (id: string) => {
    setEnabledRules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = (enable: boolean) => {
    setEnabledRules(prev => {
      const next = { ...prev };
      RULES_METADATA.forEach(rule => next[rule.id] = enable);
      return next;
    });
  };

  const { findings, error, graph } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { findings: [], error: null, graph: null };
    }

    try {
      const parsedGraph = parseN8n(jsonInput);
      
      const rulesConfig = RULES_METADATA.reduce((acc, rule) => {
        const isEnabled = enabledRules[rule.id];
        acc[rule.name] = { 
          ...((defaultConfig.rules as unknown as Record<string, RuleConfig>)[rule.name]),
          enabled: isEnabled 
        };
        return acc;
      }, {} as Record<string, RuleConfig>);

      const customConfig = {
        ...defaultConfig,
        rules: rulesConfig
      };

      const results = runAllRules(parsedGraph, {
        path: 'workflow.json',
        cfg: customConfig as unknown as FlowLintConfig, 
      });
      
      return { findings: results, error: null, graph: parsedGraph };
    } catch (err) {
      return { findings: [], error: (err as Error).message, graph: null };
    }
  }, [jsonInput, enabledRules]);

  const handleShare = async () => {
    if (!jsonInput.trim()) return;
    
    try {
        const parsedWorkflow = JSON.parse(jsonInput);
        const state: AppState = { workflow: parsedWorkflow };
        const encoded = encodeState(state);
        
        // FIX: Prefer globalThis over window (SonarQube)
        const url = new URL(globalThis.location.href);
        url.searchParams.set('state', encoded);
        
        if (url.toString().length > 2000) {
            alert("Workflow is too large to share via URL (limit is ~2000 characters).");
            return;
        }
        
        await navigator.clipboard.writeText(url.toString());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error("Failed to share URL", err);
        alert("Failed to create share link.");
    }
  };

  // Filter findings by selected node
  const displayedFindings = useMemo(() => {
    if (!selectedNodeId) return findings;
    return findings.filter(f => f.nodeId === selectedNodeId);
  }, [findings, selectedNodeId]);

  const renderFindingCard = (finding: Finding, idx: number) => {
    // Find rule metadata by ID (e.g. R1) or name (rate_limit_retry)
    // The finding.rule property usually contains the ID (R1) in current core implementation
    const ruleMeta = RULES_METADATA.find(r => r.id === finding.rule || r.name === finding.rule);
    const ruleId = ruleMeta?.id || finding.rule;
    const ruleName = ruleMeta?.name ? ruleMeta.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : ruleId;

    return (
      <div 
        key={idx} 
        className={cn(
          "p-4 border rounded-lg border-l-4 shadow-sm transition-all hover:shadow-md bg-white",
          finding.severity === 'must' ? "border-l-red-500 border-zinc-200" :
          finding.severity === 'should' ? "border-l-orange-500 border-zinc-200" :
          "border-l-blue-500 border-zinc-200"
        )}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wide",
              finding.severity === 'must' ? "bg-red-100 text-red-700" :
              finding.severity === 'should' ? "bg-orange-100 text-orange-700" :
              "bg-blue-100 text-blue-700"
            )}>
              {finding.severity}
            </span>
            <span className="text-xs text-zinc-500 font-mono font-medium">{ruleId}</span>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <LazyRuleModal ruleId={ruleId} ruleName={ruleName} />
          </Suspense>
        </div>
        <h3 className="font-medium text-zinc-900 text-base leading-snug">{finding.message}</h3>
        {finding.raw_details && (
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{finding.raw_details}</p>
        )}
        <div className="mt-3 pt-3 border-t border-zinc-100 flex justify-end">
          <code className="text-[10px] text-zinc-400 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100">
            Node ID: {finding.nodeId}
          </code>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <Header />

      {/* Mobile/Tablet: Tabs Layout (<lg) */}
      <main className="flex-1 flex flex-col overflow-hidden lg:hidden">
        <Tabs defaultValue="editor" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full justify-start rounded-none border-b bg-white px-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            {graph && <TabsTrigger value="canvas">Canvas</TabsTrigger>}
            <TabsTrigger value="results">
              Results
              {findings.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 rounded-sm px-1.5 font-mono text-[10px]">
                  {findings.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 min-h-0 m-0 p-0 data-[state=inactive]:hidden">
            <EditorPanel
              jsonInput={jsonInput}
              onJsonChange={setJsonInput}
              error={error}
              isCopied={isCopied}
              onShare={handleShare}
              enabledRules={enabledRules}
              onToggleRule={toggleRule}
              onToggleAll={toggleAll}
              activeRuleCount={activeRuleCount}
              totalRuleCount={totalRuleCount}
              idPrefix="mobile-"
            />
          </TabsContent>

          {graph && (
            <TabsContent value="canvas" className="flex-1 min-h-0 m-0 p-0 data-[state=inactive]:hidden">
              <CanvasPanel
                graph={graph}
                findings={findings}
                onNodeClick={(nodeId) => setSelectedNodeId(nodeId)}
              />
            </TabsContent>
          )}

          <TabsContent value="results" className="flex-1 min-h-0 m-0 p-0 data-[state=inactive]:hidden">
            <ResultsPanel
              displayedFindings={displayedFindings}
              groupBySeverity={groupBySeverity}
              onToggleGrouping={() => setGroupBySeverity(!groupBySeverity)}
              selectedNodeId={selectedNodeId}
              onClearSelection={() => setSelectedNodeId(null)}
              graph={graph}
              error={error}
              jsonInput={jsonInput}
              renderFindingCard={renderFindingCard}
              compact
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Desktop: 3-Panel Layout (≥lg) */}
      <main className="flex-1 hidden lg:flex flex-row overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-full lg:w-1/3 flex flex-col min-h-0 bg-white lg:bg-zinc-50 border-r border-zinc-200">
          <EditorPanel
            jsonInput={jsonInput}
            onJsonChange={setJsonInput}
            error={error}
            isCopied={isCopied}
            onShare={handleShare}
            enabledRules={enabledRules}
            onToggleRule={toggleRule}
            onToggleAll={toggleAll}
            activeRuleCount={activeRuleCount}
            totalRuleCount={totalRuleCount}
          />
        </div>

        {/* Middle Panel: Workflow Visualization */}
        {graph && (
          <div className="w-full lg:w-1/3 flex flex-col min-h-0 bg-gray-50 border-r border-zinc-200">
            <CanvasPanel
              graph={graph}
              findings={findings}
              onNodeClick={(nodeId) => setSelectedNodeId(nodeId)}
            />
          </div>
        )}

        {/* Right Panel: Results */}
        <div className="w-full lg:w-1/3 min-h-0 bg-white">
          <ResultsPanel
            displayedFindings={displayedFindings}
            groupBySeverity={groupBySeverity}
            onToggleGrouping={() => setGroupBySeverity(!groupBySeverity)}
            selectedNodeId={selectedNodeId}
            onClearSelection={() => setSelectedNodeId(null)}
            graph={graph}
            error={error}
            jsonInput={jsonInput}
            renderFindingCard={renderFindingCard}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;