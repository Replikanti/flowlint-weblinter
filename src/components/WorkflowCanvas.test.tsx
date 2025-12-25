import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkflowCanvas } from './WorkflowCanvas';

interface MockNode {
  id: string;
  data: {
    label: string;
    maxSeverity?: string | null;
  };
}

// Mock dependencies
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, onNodeClick }: { children: React.ReactNode, nodes: MockNode[], onNodeClick: (e: unknown, n: MockNode) => void }) => (
    <div data-testid="react-flow">
      {nodes.map((n) => (
        <button 
          key={n.id} 
          onClick={(e) => onNodeClick?.(e, n)} 
          data-testid={`node-${n.id}`}
          type="button"
        >
          {n.data.label}
        </button>
      ))}
      {children}
    </div>
  ),
  Background: () => <div>Background</div>,
  Controls: () => <div>Controls</div>,
  MiniMap: ({ nodeColor }: { nodeColor: (n: MockNode) => string }) => {
    // Execute nodeColor callback to test coverage
    nodeColor({ id: '1', data: { maxSeverity: 'must', label: '' } });
    nodeColor({ id: '2', data: { maxSeverity: 'should', label: '' } });
    nodeColor({ id: '3', data: { maxSeverity: 'nit', label: '' } });
    nodeColor({ id: '4', data: { maxSeverity: null, label: '' } });
    return <div>MiniMap</div>;
  },
  useNodesState: (initial: unknown) => [initial, vi.fn(), vi.fn()],
  useEdgesState: (initial: unknown) => [initial, vi.fn(), vi.fn()],
}));

// Mock graph-to-flow
vi.mock('@/lib/graph-to-flow', () => ({
  graphToReactFlow: () => ({
    nodes: [{ id: '1', data: { label: 'Node 1', maxSeverity: 'must' } }],
    edges: []
  })
}));

describe('WorkflowCanvas', () => {
  const mockGraph = { nodes: [], edges: [], meta: {} };

  it('renders react flow with nodes', () => {
    render(<WorkflowCanvas graph={mockGraph} findings={[]} />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('node-1')).toHaveTextContent('Node 1');
  });

  it('handles node click', () => {
    const onNodeClick = vi.fn();
    render(<WorkflowCanvas graph={mockGraph} findings={[]} onNodeClick={onNodeClick} />);
    
    fireEvent.click(screen.getByTestId('node-1'));
    expect(onNodeClick).toHaveBeenCalledWith('1');
  });
});
