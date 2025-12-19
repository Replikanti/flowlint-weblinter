import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the editor and results panel', () => {
    render(<App />);
    // Note: We have two layouts (mobile + desktop), so texts appear twice
    expect(screen.getAllByText(/Editor/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Analysis/i)[0]).toBeInTheDocument();
  });


  it('shows placeholder when empty', () => {
    render(<App />);
    expect(screen.getByText(/Paste a workflow JSON to start analyzing/i)).toBeInTheDocument();
  });

  it('displays error for invalid JSON', async () => {
    render(<App />);
    // Note: We have two textareas (mobile + desktop), get the first one
    const textareas = screen.getAllByPlaceholderText(/Paste your n8n workflow JSON here/i);
    fireEvent.change(textareas[0], { target: { value: '{ invalid json }' } });

    // Invalid JSON shows up faster in both layouts
    const errorMsgs = await screen.findAllByText(/Invalid JSON:/i);
    expect(errorMsgs[0]).toBeInTheDocument();
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

    // Note: We have two textareas (mobile + desktop), get the first one
    const textareas = screen.getAllByPlaceholderText(/Paste your n8n workflow JSON here/i);
    fireEvent.change(textareas[0], { target: { value: validWorkflow } });

    // Wait for analysis results (graph stats badge)
    await waitFor(() => {
        expect(screen.getByText(/1 nodes/i)).toBeInTheDocument();
    }, { timeout: 8000 });

    
    expect(screen.queryByText(/Invalid JSON:/i)).not.toBeInTheDocument();
  });
});