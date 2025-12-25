import { describe, it, expect, vi, beforeEach } from 'vitest';
import { graphToReactFlow } from './graph-to-flow';
import type { Graph } from '@replikanti/flowlint-core';

// Mock dagre
vi.mock('dagre', () => {
  const Graph = vi.fn();
  Graph.prototype.setGraph = vi.fn();
  Graph.prototype.setDefaultEdgeLabel = vi.fn();
  Graph.prototype.setNode = vi.fn();
  Graph.prototype.setEdge = vi.fn();
  Graph.prototype.node = vi.fn().mockReturnValue({ x: 100, y: 100, width: 200, height: 80 });

  return {
    default: {
      graphlib: { Graph },
      layout: vi.fn(),
    },
  };
});

describe('graphToReactFlow', () => {
  const mockGraph: Graph = {
    nodes: [
      { id: '1', type: 'start', name: 'Start' },
      { id: '2', type: 'end', name: 'End' },
    ],
    edges: [
      { from: '1', to: '2', on: 'success' },
    ],
    meta: {},
  };

  it('should convert graph to React Flow nodes and edges', () => {
    const { nodes, edges } = graphToReactFlow(mockGraph, []);

    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);

    expect(nodes[0].id).toBe('1');
    expect(nodes[0].data.label).toBe('Start');
    expect(nodes[0].type).toBe('workflowNode');

    expect(edges[0].source).toBe('1');
    expect(edges[0].target).toBe('2');
    expect(edges[0].style).toEqual({ stroke: '#94a3b8', strokeWidth: 2 });
  });

  it('should attach findings to nodes', () => {
    const findings: any[] = [
      { nodeId: '1', severity: 'must', message: 'Error' },
    ];
    const { nodes } = graphToReactFlow(mockGraph, findings);

    expect(nodes[0].data.findings).toHaveLength(1);
    expect(nodes[0].data.maxSeverity).toBe('must');
    expect(nodes[1].data.findings).toHaveLength(0);
  });

  it('should style edges based on type', () => {
    const graph: Graph = {
      nodes: [
        { id: '1', type: 'a' },
        { id: '2', type: 'b' },
        { id: '3', type: 'c' },
        { id: '4', type: 'd' },
      ],
      edges: [
        { from: '1', to: '2', on: 'success' },
        { from: '2', to: '3', on: 'error' },
        { from: '3', to: '4', on: 'timeout' },
      ],
      meta: {},
    };

    const { edges } = graphToReactFlow(graph, []);

    // Success
    expect(edges[0].style).toEqual({ stroke: '#94a3b8', strokeWidth: 2 });
    // Error
    expect(edges[1].style).toEqual({ stroke: '#ef4444', strokeWidth: 2, strokeDasharray: '5,5' });
    // Timeout
    expect(edges[2].style).toEqual({ stroke: '#f97316', strokeWidth: 2, strokeDasharray: '2,4' });
  });
});
