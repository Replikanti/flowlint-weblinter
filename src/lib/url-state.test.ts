import { describe, it, expect } from 'vitest';
import { encodeState, decodeState, AppState } from './url-state';

describe('URL State Management', () => {
  it('should encode and decode a valid state correctly', () => {
    const mockState: AppState = {
      workflow: {
        nodes: [{ id: '1', name: 'Start' }],
        connections: { 'Start': { main: [[{ node: 'End', type: 'main', index: 0 }]] } }
      }
    };

    const encoded = encodeState(mockState);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeState(encoded);
    expect(decoded).toEqual(mockState);
  });

  it('should return null for invalid encoded strings', () => {
    expect(decodeState('invalid-string')).toBeNull();
  });

  it('should return null for empty input', () => {
    expect(decodeState('')).toBeNull();
  });
});
