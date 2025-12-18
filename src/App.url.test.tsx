import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import App from './App';
import { encodeState } from './lib/url-state';

describe('App URL Integration', () => {
  const originalUrl = globalThis.location.href;

  afterEach(() => {
    globalThis.history.replaceState({}, '', originalUrl);
  });

  it('loads workflow from URL state parameter', async () => {
    const mockWorkflow = { 
      nodes: [
        { 
          id: 'url-node', 
          name: 'URL Node',
          type: "n8n-nodes-base.webhook",
          typeVersion: 1,
          position: [0, 0]
        } 
      ],
      connections: {}
    };
    const encoded = encodeState({ workflow: mockWorkflow });
    
    // Setup mock URL using History API (safe for JSDOM)
    const newUrl = `/?state=${encoded}`;
    globalThis.history.replaceState({}, '', newUrl);

    render(<App />);

    // Check if the textarea contains the stringified workflow
    await waitFor(() => {
        const textarea = screen.getByPlaceholderText(/Paste your n8n workflow JSON here/i) as HTMLTextAreaElement;
        const value = JSON.parse(textarea.value);
        expect(value.nodes[0].name).toBe('URL Node');
    });
  });
});