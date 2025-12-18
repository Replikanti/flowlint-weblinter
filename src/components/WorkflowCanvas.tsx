import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeTypes,
  type OnNodesChange,
  type OnEdgesChange,
  type Node,
  type Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { WorkflowNode } from './WorkflowNode';
import { graphToReactFlow, type WorkflowNodeData } from '@/lib/graph-to-flow';
import type { Finding } from '@replikanti/flowlint-core';

// Re-export Graph type for component props
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

interface WorkflowCanvasProps {
  graph: Graph;
  findings: Finding[];
  onNodeClick?: (nodeId: string) => void;
}

// Custom node types for React Flow
const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode
};

/**
 * WorkflowCanvas - Interactive React Flow visualization of n8n workflow
 * - Auto-layout with dagre
 * - Severity-based node coloring
 * - Clickable nodes
 * - Pan/zoom controls
 */
export function WorkflowCanvas({ graph, findings, onNodeClick }: WorkflowCanvasProps) {
  // Convert graph to React Flow format
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => graphToReactFlow(graph, findings),
    [graph, findings]
  );

  // React Flow state management
  const [nodes, , onNodesChange] = useNodesState<Node<WorkflowNodeData>>(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(initialEdges);

  // Handle node click
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
      if (onNodeClick) {
        onNodeClick(node.id);
      }
    },
    [onNodeClick]
  );

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg border border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange as OnNodesChange}
        onEdgesChange={onEdgesChange as OnEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep'
        }}
      >
        <Background color="#e5e7eb" gap={16} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as WorkflowNodeData;
            if (!data.maxSeverity) return '#d1d5db';
            switch (data.maxSeverity) {
              case 'must':
                return '#ef4444';
              case 'should':
                return '#f97316';
              case 'nit':
                return '#3b82f6';
              default:
                return '#d1d5db';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="bg-white border border-gray-200"
        />
      </ReactFlow>
    </div>
  );
}
