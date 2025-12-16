import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the editor and results panel', () => {
    render(<App />);
    expect(screen.getByText(/Input Workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/Analysis Results/i)).toBeInTheDocument();
  });

  it('shows placeholder when empty', () => {
    render(<App />);
    expect(screen.getByText(/Paste a workflow JSON to start analyzing/i)).toBeInTheDocument();
  });

  it('displays error for invalid JSON', async () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText(/Paste your n8n workflow JSON here/i);
    fireEvent.change(textarea, { target: { value: '{ invalid json }' } });
    
    // Invalid JSON shows up faster, simple findByText is usually enough
    const errorMsg = await screen.findByText(/Invalid JSON:/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('runs analysis on valid JSON', async () => {
    render(<App />);
    const validWorkflow = JSON.stringify({
        nodes: [
            {
                id: "1",
                name: "Webhook",
                type: "n8n-nodes-base.webhook",
                typeVersion: 1,
                position: [0, 0],
                parameters: { path: "test" }
            }
        ],
        connections: {}
    });

    const textarea = screen.getByPlaceholderText(/Paste your n8n workflow JSON here/i);
    fireEvent.change(textarea, { target: { value: validWorkflow } });

    // Wait for analysis results (graph stats badge)
    await waitFor(() => {
        expect(screen.getByText(/1 nodes analyzed/i)).toBeInTheDocument();
    }, { timeout: 8000 });
    
    expect(screen.queryByText(/Invalid JSON:/i)).not.toBeInTheDocument();
  });
});