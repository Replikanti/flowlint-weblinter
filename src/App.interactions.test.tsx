import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
  },
  writable: true,
});

// Mock alert
vi.stubGlobal('alert', vi.fn());

// Mock matchMedia
Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
vi.stubGlobal('ResizeObserver', class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
});

// Helper for typed global access
const globalWindow = globalThis as unknown as Window;

describe('App Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset location properly
    globalWindow.history.replaceState({}, '', '/');
  });

  it('loads shared workflow from URL', async () => {
    globalWindow.history.replaceState({}, '', '/?share=123');
    
    // Mock API response
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ nodes: [{ id: 'test-node', name: 'Test Node' }] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    await waitFor(() => {
      const elements = screen.getAllByText(/"test-node"/);
      expect(elements.length).toBeGreaterThan(0);
    });
    
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/get/123'));
  });

  it('handles share error', async () => {
    globalWindow.history.replaceState({}, '', '/?share=error-id');
    
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
    });
    vi.stubGlobal('fetch', fetchMock);
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<App />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Failed to load shared workflow");
    });
    
    consoleSpy.mockRestore();
  });

  it('shares workflow', async () => {
    render(<App />);
    
    // Enter valid JSON to enable Share button
    const editors = screen.getAllByRole('textbox'); 
    fireEvent.change(editors[0], { target: { value: '{"nodes": []}' } });
    
    // Mock fetch for share
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'new-share-id' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    // Mock history replaceState
    vi.spyOn(globalWindow.history, 'replaceState');

    // Find Share button by accessible name
    const shareBtns = screen.getAllByRole('button', { name: /share/i });
    
    fireEvent.click(shareBtns[0]);
    
    await waitFor(() => {
        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/share'), expect.anything());
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('share=new-share-id'));
    });
  });

  it('toggles rules configuration', async () => {
    render(<App />);
    
    // Find "Filter Rules" button
    const configBtns = screen.getAllByRole('button', { name: /filter rules/i });
    fireEvent.click(configBtns[0]);
    
    // Expect popover/dialog with active rules header
    expect(screen.getByText('Active Rules')).toBeInTheDocument();
    
    // Toggle a rule
    const checkboxes = screen.getAllByRole('checkbox');
    if (checkboxes.length > 0) {
        const checkbox = checkboxes[0];
        fireEvent.click(checkbox);
    }
  });
});
