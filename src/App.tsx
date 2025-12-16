import { useState, useMemo } from 'react';
import { parseN8n, runAllRules, defaultConfig, RULES_METADATA, type Finding } from '@replikanti/flowlint-core';
import { AlertCircle, CheckCircle, Copy, Settings2, LayoutList, Info } from 'lucide-react';
import { cn } from './lib/utils';
import Header from './components/Header';
import Footer from './components/Footer';
import { Button } from './components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Checkbox } from './components/ui/checkbox';
import { ScrollArea } from './components/ui/scroll-area';
import { Label } from './components/ui/label';
import { Badge } from './components/ui/badge';
import { RuleModal } from './components/RuleModal';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [groupBySeverity, setGroupBySeverity] = useState(false);
  
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
          ...(defaultConfig.rules as any)[rule.name],
          enabled: isEnabled 
        };
        return acc;
      }, {} as any);

      const customConfig = {
        ...defaultConfig,
        rules: rulesConfig
      };

      const results = runAllRules(parsedGraph, {
        path: 'workflow.json',
        cfg: customConfig,
      });
      
      return { findings: results, error: null, graph: parsedGraph };
    } catch (err) {
      return { findings: [], error: (err as Error).message, graph: null };
    }
  }, [jsonInput, enabledRules]);

  const groupedFindings = useMemo(() => {
    if (!groupBySeverity) return null;
    return {
      must: findings.filter(f => f.severity === 'must'),
      should: findings.filter(f => f.severity === 'should'),
      nit: findings.filter(f => f.severity === 'nit'),
    };
  }, [findings, groupBySeverity]);

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
          <RuleModal ruleId={ruleId} ruleName={ruleName} />
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
      
      <main className="flex-1 flex flex-col md:flex-row overflow-auto">
        {/* Left Panel: Editor */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white md:bg-zinc-50 border-r border-zinc-200">
          <div className="p-4 border-b border-zinc-200 bg-white flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
              <Copy className="w-5 h-5" /> Input Workflow
            </h2>
            
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

        {/* Right Panel: Results */}
        <div className="w-full md:w-1/2 p-4 bg-white overflow-y-auto">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/95 backdrop-blur py-2 z-10 border-b border-zinc-100">
            <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
              Analysis Results
            </h2>
            <div className="flex items-center gap-3">
              {findings.length > 0 && (
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
                  {graph.nodes.length} nodes
                </span>
              )}
            </div>
          </div>

          {findings.length === 0 && !error && jsonInput && (
            <div className="flex flex-col items-center justify-center h-64 text-green-600 animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-xl font-semibold">No issues found!</p>
              <p className="text-sm text-green-600/80 mt-1">Your workflow follows all active rules.</p>
            </div>
          )}

          {findings.length === 0 && !jsonInput && (
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
                {findings.map(renderFindingCard)}
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
