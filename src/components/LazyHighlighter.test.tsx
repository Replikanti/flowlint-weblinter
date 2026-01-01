import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LazyHighlighter from './LazyHighlighter';

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter/dist/esm/prism', () => ({
  default: ({ children }: { children: string }) => <pre>{children}</pre>,
}));

vi.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}));

describe('LazyHighlighter', () => {
  it('renders code content', async () => {
    render(<LazyHighlighter language="json">{'{"test": true}'}</LazyHighlighter>);
    
    // It's lazy loaded, so we wait
    await waitFor(() => {
      expect(screen.getByText('{"test": true}')).toBeInTheDocument();
    });
  });
});
