import { AlertCircle, CheckCircle, Info, LayoutList, X } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className={cn(
        "p-4 border-b border-zinc-200 bg-white shrink-0 sticky top-0 z-10",
        compact && "border-b-0"
      )}>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold flex items-center gap-2 text-zinc-800">
            Analysis Results
          </h2>
          {selectedNodeId && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">
                {compact ? 'Showing:' : 'Showing findings for:'} <code className="font-mono font-semibold">{selectedNodeId}</code>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-5 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          )}
          <div className={cn("flex items-center gap-2", compact && "flex-wrap")}>
            {displayedFindings.length > 0 && (
              <Button
                variant={groupBySeverity ? "secondary" : "ghost"}
                size="sm"
                onClick={onToggleGrouping}
                className="h-8 text-xs border border-zinc-200 bg-white hover:bg-zinc-50"
              >
                <LayoutList className={cn("mr-2 h-3.5 w-3.5", groupBySeverity && "text-primary")} />
                {compact ? 'Group' : 'Group by Severity'}
              </Button>
            )}
            {graph && (
              <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full">
                {graph.nodes.length} {compact ? 'nodes' : 'nodes analyzed'}
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
  );
}
