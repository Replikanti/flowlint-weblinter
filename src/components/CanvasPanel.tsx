import { WorkflowCanvas } from './WorkflowCanvas';
import type { Finding } from '@replikanti/flowlint-core';
import { Zap, Layout } from 'lucide-react';

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

interface CanvasPanelProps {
  readonly graph: Graph | null;
  readonly findings: Finding[];
  readonly onNodeClick: (nodeId: string) => void;
}

export function CanvasPanel({ graph, findings, onNodeClick }: CanvasPanelProps) {
  return (
    <div className="h-full flex flex-col bg-zinc-50 overflow-hidden">
      <div className="p-4 border-b border-zinc-200 bg-white shrink-0 h-16 flex items-center">
        <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
          <Zap className="w-4 h-4 text-rose-500" /> Workflow Graph
        </h2>
      </div>
      <div className="flex-1 min-h-0 relative">
        {graph ? (
          <div className="w-full h-full p-4">
            <WorkflowCanvas
              graph={graph}
              findings={findings}
              onNodeClick={onNodeClick}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
            <Layout className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-medium">No workflow to visualize</p>
            <p className="text-xs mt-1">Paste your JSON into the editor to see the graph.</p>
          </div>
        )}
      </div>
    </div>
  );
}

