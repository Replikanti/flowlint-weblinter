import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultsPanel } from './ResultsPanel';
import type { Finding } from '@replikanti/flowlint-core';

const mockFinding: Finding = {
  rule: 'R1',
  severity: 'must',
  message: 'Error message',
  path: 'test.json',
  line: 1,
  nodeId: 'node1',
};

const renderFindingCard = (f: Finding, idx: number) => (
  <div key={idx} data-testid="finding-card">{f.message}</div>
);

describe('ResultsPanel', () => {
  const defaultProps = {
    displayedFindings: [],
    groupBySeverity: false,
    onToggleGrouping: vi.fn(),
    selectedNodeId: null,
    onClearSelection: vi.fn(),
    graph: null,
    error: null,
    jsonInput: '',
    renderFindingCard,
  };

  it('renders start message when no input', () => {
    render(<ResultsPanel {...defaultProps} />);
    expect(screen.getByText('Paste a workflow JSON to start analyzing.')).toBeInTheDocument();
  });

  it('renders findings when provided', () => {
    render(<ResultsPanel {...defaultProps} displayedFindings={[mockFinding]} jsonInput="{}" />);
    expect(screen.getByTestId('finding-card')).toHaveTextContent('Error message');
  });

  it('renders grouping header when enabled', () => {
    render(<ResultsPanel {...defaultProps} displayedFindings={[mockFinding]} groupBySeverity={true} jsonInput="{}" />);
    expect(screen.getByText(/MUST FIX/)).toBeInTheDocument();
  });

  it('renders node filtering header when selectedNodeId is present', () => {
    render(<ResultsPanel {...defaultProps} selectedNodeId="node1" displayedFindings={[mockFinding]} jsonInput="{}" />);
    expect(screen.getByText('node1')).toBeInTheDocument();
    expect(screen.getByTitle('Show all nodes')).toBeInTheDocument();
  });

  it('calls onClearSelection when clear button clicked', () => {
    const onClearSelection = vi.fn();
    render(<ResultsPanel {...defaultProps} selectedNodeId="node1" onClearSelection={onClearSelection} displayedFindings={[mockFinding]} jsonInput="{}" />);
    
    fireEvent.click(screen.getByTitle('Show all nodes'));
    expect(onClearSelection).toHaveBeenCalled();
  });

  it('calls onToggleGrouping when group button clicked', () => {
    const onToggleGrouping = vi.fn();
    render(<ResultsPanel {...defaultProps} displayedFindings={[mockFinding]} onToggleGrouping={onToggleGrouping} jsonInput="{}" />);
    
    fireEvent.click(screen.getByText('Group by Severity'));
    expect(onToggleGrouping).toHaveBeenCalled();
  });
});
