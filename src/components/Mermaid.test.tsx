import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Mermaid from './Mermaid';
import mermaid from 'mermaid';

// Mock mermaid
vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg>mock</svg>' }),
  }
}));

describe('Mermaid', () => {
  it('renders svg on success', async () => {
    render(<Mermaid chart="graph TD; A-->B;" />);
    
    await waitFor(() => {
        expect(document.body.innerHTML).toContain('<svg>mock</svg>');
    });
  });

  it('renders error message on failure', async () => {
    // Mock rejection just for this test
    vi.mocked(mermaid.render).mockRejectedValueOnce(new Error('Render failed'));
    
    render(<Mermaid chart="invalid" />);
    
    await waitFor(() => {
        expect(screen.getByText(/Failed to render diagram/)).toBeInTheDocument();
    });
  });
});
