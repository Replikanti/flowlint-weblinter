import { AlertCircle, CheckCircle, Info, LayoutList, X, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import type { Finding } from '@replikanti/flowlint-core';

type Graph = {
  nodes: Array<{
    id: string;
    type: string;
    name?: string;
    params?: Record<string, unknown>;
    cred?: Record<string, unknown>;
    flags?: Record<string, unknown>;
  }>;
  edges: Array<{
    from: string;
    to: string;
    on?: 'success' | 'error' | 'timeout';
  }>;
  meta: Record<string, unknown>;
};

interface ResultsPanelProps {

  readonly displayedFindings: Finding[];
  readonly groupBySeverity: boolean;
  readonly onToggleGrouping: () => void;
  readonly selectedNodeId: string | null;
  readonly onClearSelection: () => void;
  readonly graph: Graph | null;
  readonly error: string | null;
  readonly jsonInput: string;
  readonly renderFindingCard: (finding: Finding, idx: number) => React.ReactNode;
  readonly compact?: boolean;
}



export function ResultsPanel({
  displayedFindings,
  groupBySeverity,
  onToggleGrouping,
  selectedNodeId,
  onClearSelection,
  graph,
  error,
  jsonInput,
  renderFindingCard,
  compact = false
}: ResultsPanelProps) {


  const groupedFindings = groupBySeverity ? {
    must: displayedFindings.filter(f => f.severity === 'must'),
    should: displayedFindings.filter(f => f.severity === 'should'),
    nit: displayedFindings.filter(f => f.severity === 'nit'),
  } : null;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className={cn(
        "p-4 border-b border-zinc-200 bg-white shrink-0 sticky top-0 z-10 h-16 flex flex-row items-center justify-between",
        compact && "border-b-0"
      )}>
        <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-rose-500" /> Analysis
        </h2>
        
        <div className="flex items-center gap-2">
          {graph && (
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full uppercase mr-2">
              {graph.nodes.length} {compact ? 'nodes' : 'nodes analyzed'}
            </span>
          )}

          {selectedNodeId && (

            <div className="flex items-center gap-1.5 bg-rose-50 px-2 py-1 rounded border border-rose-100 animate-in fade-in zoom-in duration-200">
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-tight">Filtering:</span>
              <code className="text-[10px] font-mono font-bold text-rose-700">{selectedNodeId}</code>
              <button 
                onClick={onClearSelection} 
                className="text-rose-400 hover:text-rose-600 ml-1.5 p-0.5 hover:bg-rose-100 rounded-full transition-colors flex items-center gap-1 group"
                title="Show all nodes"
              >
                <X className="h-3 w-3" />
                <span className="text-[9px] font-bold uppercase pr-1 hidden group-hover:inline">Show All</span>
              </button>
            </div>
          )}
          {displayedFindings.length > 0 && (

            <Button
              variant={groupBySeverity ? "secondary" : "outline"}
              size="sm"
              onClick={onToggleGrouping}
              className="h-8 text-[10px] uppercase font-bold tracking-tight"
            >
              <LayoutList className={cn("mr-1.5 h-3 w-3", groupBySeverity && "text-rose-500")} />
              {compact ? 'Group' : 'Group by Severity'}
            </Button>

          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white">

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
  );
}
