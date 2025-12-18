import { useState, useMemo, lazy, Suspense } from 'react';
import { parseN8n, runAllRules, defaultConfig, RULES_METADATA, type Finding, type RuleConfig, type FlowLintConfig } from '@replikanti/flowlint-core';
import { AlertCircle, CheckCircle, Copy, Settings2, LayoutList, Info, Loader2, Share2, Check, X } from 'lucide-react';
import { cn } from './lib/utils';
import Header from './components/Header';
import Footer from './components/Footer';
import { Button } from './components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Checkbox } from './components/ui/checkbox';
import { ScrollArea } from './components/ui/scroll-area';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { encodeState, decodeState, type AppState } from './lib/url-state';
import { WorkflowCanvas } from './components/WorkflowCanvas';

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

  const groupedFindings = useMemo(() => {
    if (!groupBySeverity) return null;
    return {
      must: displayedFindings.filter(f => f.severity === 'must'),
      should: displayedFindings.filter(f => f.severity === 'should'),
      nit: displayedFindings.filter(f => f.severity === 'nit'),
    };
  }, [displayedFindings, groupBySeverity]);

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
            <div className="h-full flex flex-col bg-white">
              <div className="p-4 border-b border-zinc-200 flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                  <Copy className="w-5 h-5" /> Input Workflow
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={handleShare}
                    disabled={!jsonInput.trim()}
                  >
                    {isCopied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Share2 className="mr-2 h-3.5 w-3.5" />}
                    {isCopied ? "Copied!" : "Share"}
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 border-dashed">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Rules
                        <Badge variant="secondary" className="ml-2 h-5 rounded-sm px-1 font-mono">
                          {activeRuleCount}/{totalRuleCount}
                        </Badge>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="end">
                      <div className="p-4 pb-2">
                        <h4 className="font-medium leading-none mb-2">Active Rules</h4>
                        <p className="text-sm text-muted-foreground">
                          Select which rules to apply to the analysis.
                        </p>
                      </div>
                      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-y border-zinc-100">
                        <Button variant="ghost" size="sm" onClick={() => toggleAll(true)} className="h-8 text-xs">
                          Select All
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => toggleAll(false)} className="h-8 text-xs text-red-600 hover:text-red-700">
                          Deselect All
                        </Button>
                      </div>
                      <ScrollArea className="h-[400px]">
                        <div className="p-4 space-y-4">
                          {RULES_METADATA.map((rule) => (
                            <div key={rule.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={`mobile-${rule.id}`}
                                checked={enabledRules[rule.id]}
                                onCheckedChange={() => toggleRule(rule.id)}
                                className="mt-1"
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label
                                  htmlFor={`mobile-${rule.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                >
                                  <span>{rule.id}</span>
                                  <Badge variant={
                                    rule.severity === 'must' ? 'destructive' :
                                    rule.severity === 'should' ? 'secondary' : 'outline'
                                  } className="text-[10px] h-4 px-1 py-0 uppercase">
                                    {rule.severity}
                                  </Badge>
                                </Label>
                                <p className="text-xs font-medium text-zinc-700">
                                  {rule.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {rule.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-hidden flex flex-col min-h-0">
                <textarea
                  className="flex-1 w-full p-4 font-mono text-sm bg-white border border-zinc-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-zinc-700 placeholder:text-zinc-400 shadow-sm"
                  placeholder="Paste your n8n workflow JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  spellCheck={false}
                />
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2 shrink-0">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="truncate">Invalid JSON: {error}</span>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {graph && (
            <TabsContent value="canvas" className="flex-1 min-h-0 m-0 p-0 data-[state=inactive]:hidden">
              <div className="h-full flex flex-col bg-gray-50">
                <div className="p-4 border-b border-zinc-200 bg-white shrink-0">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                    Workflow Graph
                  </h2>
                </div>
                <div className="flex-1 min-h-0 p-4">
                  <div className="w-full h-full">
                    <WorkflowCanvas
                      graph={graph}
                      findings={findings}
                      onNodeClick={(nodeId) => setSelectedNodeId(nodeId)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          )}

          <TabsContent value="results" className="flex-1 min-h-0 m-0 p-0 data-[state=inactive]:hidden">
            <div className="h-full flex flex-col bg-white overflow-y-auto">
              <div className="p-4 border-b border-zinc-200 bg-white shrink-0 sticky top-0 z-10">
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                    Analysis Results
                  </h2>
                  {selectedNodeId && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">
                        Showing: <code className="font-mono font-semibold">{selectedNodeId}</code>
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNodeId(null)}
                        className="h-5 px-2 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {displayedFindings.length > 0 && (
                      <Button
                        variant={groupBySeverity ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setGroupBySeverity(!groupBySeverity)}
                        className="h-8 text-xs border border-zinc-200 bg-white hover:bg-zinc-50"
                      >
                        <LayoutList className={cn("mr-2 h-3.5 w-3.5", groupBySeverity && "text-primary")} />
                        Group
                      </Button>
                    )}
                    {graph && (
                      <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                        {graph.nodes.length} nodes
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4">
                {displayedFindings.length === 0 && !error && jsonInput && (
                  <div className="flex flex-col items-center justify-center h-64 text-green-600">
                    <CheckCircle className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-xl font-semibold">
                      {selectedNodeId ? 'No issues for this node!' : 'No issues found!'}
                    </p>
                    <p className="text-sm text-green-600/80 mt-1">
                      {selectedNodeId ? 'This node follows all active rules.' : 'Your workflow follows all active rules.'}
                    </p>
                  </div>
                )}

                {displayedFindings.length === 0 && !jsonInput && (
                  <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
                    <p className="text-sm">Paste a workflow JSON to start analyzing.</p>
                  </div>
                )}

                <div className="space-y-6">
                  {groupBySeverity && groupedFindings ? (
                    <>
                      {groupedFindings.must.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-red-700 flex items-center bg-red-50 p-2 rounded border border-red-100">
                            <AlertCircle className="w-3.5 h-3.5 mr-2"/> MUST FIX ({groupedFindings.must.length})
                          </h3>
                          {groupedFindings.must.map(renderFindingCard)}
                        </div>
                      )}
                      {groupedFindings.should.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-orange-700 flex items-center bg-orange-50 p-2 rounded border border-orange-100">
                            <Info className="w-3.5 h-3.5 mr-2"/> SHOULD FIX ({groupedFindings.should.length})
                          </h3>
                          {groupedFindings.should.map(renderFindingCard)}
                        </div>
                      )}
                      {groupedFindings.nit.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-xs font-bold text-blue-700 flex items-center bg-blue-50 p-2 rounded border border-blue-100">
                            <Info className="w-3.5 h-3.5 mr-2"/> NITPICKS ({groupedFindings.nit.length})
                          </h3>
                          {groupedFindings.nit.map(renderFindingCard)}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      {displayedFindings.map(renderFindingCard)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Desktop: 3-Panel Layout (≥lg) */}
      <main className="flex-1 hidden lg:flex flex-row overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-full lg:w-1/3 flex flex-col min-h-0 bg-white lg:bg-zinc-50 border-r border-zinc-200">
          <div className="p-4 border-b border-zinc-200 bg-white flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
              <Copy className="w-5 h-5" /> Input Workflow
            </h2>
            
            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8"
                    onClick={handleShare}
                    disabled={!jsonInput.trim()}
                >
                    {isCopied ? <Check className="mr-2 h-3.5 w-3.5" /> : <Share2 className="mr-2 h-3.5 w-3.5" />}
                    {isCopied ? "Copied!" : "Share"}
                </Button>

                <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Filter Rules
                    <Badge variant="secondary" className="ml-2 h-5 rounded-sm px-1 font-mono">
                        {activeRuleCount}/{totalRuleCount}
                    </Badge>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="end">
                    <div className="p-4 pb-2">
                    <h4 className="font-medium leading-none mb-2">Active Rules</h4>
                    <p className="text-sm text-muted-foreground">
                        Select which rules to apply to the analysis.
                    </p>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-y border-zinc-100">
                    <Button variant="ghost" size="sm" onClick={() => toggleAll(true)} className="h-8 text-xs">
                        Select All
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleAll(false)} className="h-8 text-xs text-red-600 hover:text-red-700">
                        Deselect All
                    </Button>
                    </div>
                    <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-4">
                        {RULES_METADATA.map((rule) => (
                        <div key={rule.id} className="flex items-start space-x-3">
                            <Checkbox 
                            id={rule.id} 
                            checked={enabledRules[rule.id]} 
                            onCheckedChange={() => toggleRule(rule.id)} 
                            className="mt-1"
                            />
                            <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor={rule.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                            >
                                <span>{rule.id}</span>
                                <Badge variant={
                                rule.severity === 'must' ? 'destructive' :
                                rule.severity === 'should' ? 'secondary' : 'outline'
                                } className="text-[10px] h-4 px-1 py-0 uppercase">
                                {rule.severity}
                                </Badge>
                            </Label>
                            <p className="text-xs font-medium text-zinc-700">
                                {rule.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {rule.description}
                            </p>
                            </div>
                        </div>
                        ))}
                    </div>
                    </ScrollArea>
                </PopoverContent>
                </Popover>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-hidden flex flex-col">
             <textarea
              className="flex-1 w-full p-4 font-mono text-sm bg-white border border-zinc-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-zinc-700 placeholder:text-zinc-400 shadow-sm min-h-[500px]"
              placeholder="Paste your n8n workflow JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              spellCheck={false}
            />
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 shrink-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">Invalid JSON: {error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Middle Panel: Workflow Visualization */}
        {graph && (
          <div className="w-full lg:w-1/3 flex flex-col min-h-0 bg-gray-50 border-r border-zinc-200">
            <div className="p-4 border-b border-zinc-200 bg-white flex justify-between items-center shrink-0">
              <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                Workflow Graph
              </h2>
            </div>
            <div className="flex-1 min-h-0 p-4">
              <div className="w-full h-full">
                <WorkflowCanvas
                  graph={graph}
                  findings={findings}
                  onNodeClick={(nodeId) => setSelectedNodeId(nodeId)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right Panel: Results */}
        <div className="w-full lg:w-1/3 min-h-0 p-4 bg-white overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 backdrop-blur py-2 z-10 border-b border-zinc-100">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
                Analysis Results
              </h2>
              {selectedNodeId && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">
                    Showing findings for: <code className="font-mono font-semibold">{selectedNodeId}</code>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedNodeId(null)}
                    className="h-5 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {displayedFindings.length > 0 && (
                <Button
                  variant={groupBySeverity ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setGroupBySeverity(!groupBySeverity)}
                  className="h-8 text-xs border border-zinc-200 bg-white hover:bg-zinc-50"
                >
                  <LayoutList className={cn("mr-2 h-3.5 w-3.5", groupBySeverity && "text-primary")} />
                  Group by Severity
                </Button>
              )}
              {graph && (
                <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                  {graph.nodes.length} nodes analyzed
                </span>
              )}
            </div>
          </div>

          {displayedFindings.length === 0 && !error && jsonInput && (
            <div className="flex flex-col items-center justify-center h-64 text-green-600 animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-semibold">
                {selectedNodeId ? 'No issues for this node!' : 'No issues found!'}
              </p>
              <p className="text-sm text-green-600/80 mt-1">
                {selectedNodeId ? 'This node follows all active rules.' : 'Your workflow follows all active rules.'}
              </p>
            </div>
          )}

          {displayedFindings.length === 0 && !jsonInput && (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <p className="text-sm">Paste a workflow JSON to start analyzing.</p>
            </div>
          )}

          <div className="space-y-6 pb-8">
            {groupBySeverity && groupedFindings ? (
              <>
                {groupedFindings.must.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-red-700 flex items-center bg-red-50 p-2 rounded border border-red-100">
                      <AlertCircle className="w-3.5 h-3.5 mr-2"/> MUST FIX ({groupedFindings.must.length})
                    </h3>
                    {groupedFindings.must.map(renderFindingCard)}
                  </div>
                )}
                {groupedFindings.should.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-orange-700 flex items-center bg-orange-50 p-2 rounded border border-orange-100">
                      <Info className="w-3.5 h-3.5 mr-2"/> SHOULD FIX ({groupedFindings.should.length})
                    </h3>
                    {groupedFindings.should.map(renderFindingCard)}
                  </div>
                )}
                {groupedFindings.nit.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-blue-700 flex items-center bg-blue-50 p-2 rounded border border-blue-100">
                      <Info className="w-3.5 h-3.5 mr-2"/> NITPICKS ({groupedFindings.nit.length})
                    </h3>
                    {groupedFindings.nit.map(renderFindingCard)}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                {displayedFindings.map(renderFindingCard)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;