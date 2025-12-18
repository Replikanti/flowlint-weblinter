import { WorkflowCanvas } from './WorkflowCanvas';
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

interface CanvasPanelProps {
  readonly graph: Graph;
  readonly findings: Finding[];
  readonly onNodeClick: (nodeId: string) => void;
}

export function CanvasPanel({ graph, findings, onNodeClick }: CanvasPanelProps) {
  return (
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
            onNodeClick={onNodeClick}
          />
        </div>
      </div>
    </div>
  );
}
