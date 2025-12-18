import dagre from 'dagre';
import type { Node, Edge as ReactFlowEdge } from '@xyflow/react';
import type { Finding } from '@replikanti/flowlint-core';
import { groupFindingsByNode, getMaxSeverity } from './finding-utils';

// Re-export Graph and Edge types from core for internal use
type NodeRef = {
  id: string;
  type: string;
  name?: string;
  params?: Record<string, unknown>;
  cred?: Record<string, unknown>;
  flags?: {
    continueOnFail?: boolean;
    retryOnFail?: boolean | string;
    waitBetweenTries?: number | string;
    maxTries?: number | string;
  };
};

type Edge = {
  from: string;
  to: string;
  on?: 'success' | 'error' | 'timeout';
};

type Graph = {
  nodes: NodeRef[];
  edges: Edge[];
  meta: Record<string, unknown>;
};

// Custom node data type
export type WorkflowNodeData = {
  label: string;
  nodeType: string;
  findings: Finding[];
  maxSeverity: 'must' | 'should' | 'nit' | null;
  findingCount: number;
};

/**
 * Converts Graph from flowlint-core to React Flow format with dagre layout
 * @param graph Parsed workflow graph
 * @param findings Array of findings to annotate nodes
 * @returns Object with nodes and edges for React Flow
 */
export function graphToReactFlow(
  graph: Graph,
  findings: Finding[]
): { nodes: Node<WorkflowNodeData>[]; edges: ReactFlowEdge[] } {
  // Group findings by node ID
  const findingsByNode = groupFindingsByNode(findings);

  // Create dagre graph for layout
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Configure layout (Left to Right, spacing)
  dagreGraph.setGraph({
    rankdir: 'LR',  // Left to right
    nodesep: 80,    // Horizontal spacing between nodes
    ranksep: 120,   // Vertical spacing between ranks
    marginx: 20,
    marginy: 20
  });

  // Add nodes to dagre graph
  graph.nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: 200,  // Node width
      height: 80   // Node height
    });
  });

  // Add edges to dagre graph
  graph.edges.forEach((edge) => {
    dagreGraph.setEdge(edge.from, edge.to);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Convert to React Flow nodes with positioned coordinates
  const reactFlowNodes: Node<WorkflowNodeData>[] = graph.nodes.map((node) => {
    const nodeFindings = findingsByNode[node.id] || [];
    const maxSeverity = getMaxSeverity(nodeFindings);
    const dagreNode = dagreGraph.node(node.id);

    return {
      id: node.id,
      type: 'workflowNode',  // Custom node type
      position: {
        x: dagreNode.x - dagreNode.width / 2,  // Dagre uses center positioning
        y: dagreNode.y - dagreNode.height / 2
      },
      data: {
        label: node.name || node.type || node.id,
        nodeType: node.type,
        findings: nodeFindings,
        maxSeverity,
        findingCount: nodeFindings.length
      }
    };
  });

  // Convert to React Flow edges with styling based on type
  const reactFlowEdges: ReactFlowEdge[] = graph.edges.map((edge, idx) => {
    const edgeType = edge.on || 'success';

    // Style based on edge type
    let style: React.CSSProperties = {};
    const animated = false;

    switch (edgeType) {
      case 'success':
        style = { stroke: '#94a3b8', strokeWidth: 2 };  // Solid gray
        break;
      case 'error':
        style = { stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' };  // Dashed red
        break;
      case 'timeout':
        style = { stroke: '#f97316', strokeWidth: 2, strokeDasharray: '2,4' };  // Dotted orange
        break;
    }

    return {
      id: `edge-${edge.from}-${edge.to}-${idx}`,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',  // Smoothstep edge type for cleaner paths
      animated,
      style,
      label: edgeType === 'success' ? undefined : edgeType,
      labelStyle: { fontSize: 10, fill: '#64748b' },
      labelBgStyle: { fill: 'white', fillOpacity: 0.8 }
    };
  });

  return {
    nodes: reactFlowNodes,
    edges: reactFlowEdges
  };
}
