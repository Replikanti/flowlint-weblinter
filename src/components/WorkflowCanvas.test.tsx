import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkflowCanvas } from './WorkflowCanvas';

// Mock dependencies
vi.mock('@xyflow/react', () => ({
  ReactFlow: ({ children, nodes, onNodeClick }: any) => (
    <div data-testid="react-flow">
      {nodes.map((n: any) => (
        <div 
          key={n.id} 
          onClick={(e) => onNodeClick && onNodeClick(e, n)} 
          data-testid={`node-${n.id}`}
        >
          {n.data.label}
        </div>
      ))}
      {children}
    </div>
  ),
  Background: () => <div>Background</div>,
  Controls: () => <div>Controls</div>,
  MiniMap: ({ nodeColor }: any) => {
    // Execute nodeColor callback to test coverage
    nodeColor({ data: { maxSeverity: 'must' } });
    nodeColor({ data: { maxSeverity: 'should' } });
    nodeColor({ data: { maxSeverity: 'nit' } });
    nodeColor({ data: { maxSeverity: null } });
    return <div>MiniMap</div>;
  },
  useNodesState: (initial: any) => [initial, vi.fn(), vi.fn()],
  useEdgesState: (initial: any) => [initial, vi.fn(), vi.fn()],
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
