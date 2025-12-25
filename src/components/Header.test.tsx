import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../components/Header';

// Mock ResizeObserver for Radix UI
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('Header', () => {
  it('renders logo and title', () => {
    render(<Header />);
    expect(screen.getByText('FlowLint')).toBeInTheDocument();
    expect(screen.getByAltText('FlowLint')).toBeInTheDocument();
  });

  it('renders navigation menus', () => {
    render(<Header />);
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('renders mobile menu trigger', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(menuButton).toBeInTheDocument();
  });

  it('opens mobile menu', () => {
    render(<Header />);
    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    
    // Check for mobile menu items (they appear in a Sheet/Dialog)
    expect(screen.getByText('Chrome Extension')).toBeVisible();
  });
});
