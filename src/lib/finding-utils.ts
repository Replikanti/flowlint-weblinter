import type { Finding } from '@replikanti/flowlint-core';

export type FindingSeverity = 'must' | 'should' | 'nit';

/**
 * Groups findings by node ID
 * @param findings Array of findings to group
 * @returns Record mapping node IDs to their findings
 */
export function groupFindingsByNode(findings: Finding[]): Record<string, Finding[]> {
  return findings.reduce((acc, finding) => {
    const nodeId = finding.nodeId || 'unknown';
    if (!acc[nodeId]) {
      acc[nodeId] = [];
    }
    acc[nodeId].push(finding);
    return acc;
  }, {} as Record<string, Finding[]>);
}

/**
 * Gets the maximum severity from an array of findings
 * Severity hierarchy: must > should > nit
 * @param findings Array of findings to analyze
 * @returns Maximum severity or null if no findings
 */
export function getMaxSeverity(findings: Finding[]): FindingSeverity | null {
  if (findings.length === 0) return null;

  const hasMust = findings.some(f => f.severity === 'must');
  if (hasMust) return 'must';

  const hasShould = findings.some(f => f.severity === 'should');
  if (hasShould) return 'should';

  return 'nit';
}

/**
 * Maps severity to Tailwind color classes
 * @param severity Finding severity level
 * @returns Object with color classes for various use cases
 */
export function getSeverityColor(severity: FindingSeverity | null): {
  border: string;
  bg: string;
  text: string;
  badge: string;
} {
  switch (severity) {
    case 'must':
      return {
        border: 'border-red-500',
        bg: 'bg-red-50',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-700'
      };
    case 'should':
      return {
        border: 'border-orange-500',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-700'
      };
    case 'nit':
      return {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-700'
      };
    default:
      return {
        border: 'border-gray-300',
        bg: 'bg-gray-50',
        text: 'text-gray-600',
        badge: 'bg-gray-100 text-gray-600'
      };
  }
}

/**
 * Gets a count of findings by severity
 * @param findings Array of findings
 * @returns Object with counts for each severity level
 */
export function getFindingCountsBySeverity(findings: Finding[]): {
  must: number;
  should: number;
  nit: number;
  total: number;
} {
  const counts = findings.reduce(
    (acc, f) => {
      acc[f.severity] = (acc[f.severity] || 0) + 1;
      return acc;
    },
    { must: 0, should: 0, nit: 0 } as Record<FindingSeverity, number>
  );

  return {
    must: counts.must,
    should: counts.should,
    nit: counts.nit,
    total: findings.length
  };
}
