import { z } from 'zod';
import LZString from 'lz-string';

// Define the shape of our application state that needs to be shared
// We keep the workflow validation loose for now to support various n8n versions
export const appStateSchema = z.object({
  workflow: z.record(z.string(), z.any()).or(z.object({
    nodes: z.array(z.any()),
    connections: z.record(z.string(), z.any()).optional(),
  }).passthrough()),
});

export type AppState = z.infer<typeof appStateSchema>;

/**
 * Encodes the application state into a compressed URL-safe string.
 */
export function encodeState(state: AppState): string {
  const jsonString = JSON.stringify(state);
  const compressed = LZString.compressToEncodedURIComponent(jsonString);
  return compressed;
}

/**
 * Decodes a compressed string back into the application state.
 * Returns null if decoding or validation fails.
 */
export function decodeState(encodedString: string): AppState | null {
  try {
    if (!encodedString) return null;
    
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedString);
    if (!decompressed) return null;

    const parsed = JSON.parse(decompressed);
    
    // Validate against schema
    const result = appStateSchema.safeParse(parsed);
    
    if (!result.success) {
      console.error('Failed to validate URL state:', result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Failed to decode URL state:', error);
    return null;
  }
}
