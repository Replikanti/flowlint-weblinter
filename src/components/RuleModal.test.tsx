import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RuleModal } from './RuleModal';

// Mock data
vi.mock('@/data/rule-examples.json', () => ({
  default: {
    'R1': {
      readme: '# R1 Description',
      good: '{ "good": true }',
      bad: '{ "bad": true }'
    }
  }
}));

// Mock lazy components
vi.mock('./Mermaid', () => ({ default: () => <div data-testid="mermaid">Mermaid</div> }));
vi.mock('./LazyHighlighter', () => ({ default: ({ children }: { children: React.ReactNode }) => <div data-testid="highlighter">{children}</div> }));

// Mock ReactMarkdown to avoid processing
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="markdown">{children}</div>
}));

// Mock ResizeObserver
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('RuleModal', () => {
  it('renders nothing if rule not found', () => {
    const { container } = render(<RuleModal ruleId="R999" ruleName="Unknown" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders trigger button for valid rule', () => {
    render(<RuleModal ruleId="R1" ruleName="Test Rule" />);
    expect(screen.getByRole('button', { name: /examples/i })).toBeInTheDocument();
  });

  it('opens dialog content on click', async () => {
    render(<RuleModal ruleId="R1" ruleName="Test Rule" />);
    
    fireEvent.click(screen.getByRole('button', { name: /examples/i }));
    
    expect(await screen.findByText('R1: Test Rule')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Valid Example')).toBeInTheDocument();
    expect(screen.getByText('Invalid Example')).toBeInTheDocument();
  });

  it('renders markdown content in description tab', async () => {
    render(<RuleModal ruleId="R1" ruleName="Test Rule" />);
    fireEvent.click(screen.getByRole('button', { name: /examples/i }));
    
    expect(await screen.findByTestId('markdown')).toHaveTextContent('# R1 Description');
  });

  it('renders tab triggers', async () => {
    render(<RuleModal ruleId="R1" ruleName="Test Rule" />);
    fireEvent.click(screen.getByRole('button', { name: /examples/i }));
    
    expect(screen.getByText('Valid Example')).toBeInTheDocument();
    expect(screen.getByText('Invalid Example')).toBeInTheDocument();
  });
});
