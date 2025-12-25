import { describe, it, expect } from 'vitest';
import { groupFindingsByNode, getMaxSeverity, getSeverityColor, getFindingCountsBySeverity } from './finding-utils';
import type { Finding } from '@replikanti/flowlint-core';

describe('finding-utils', () => {
  describe('groupFindingsByNode', () => {
    it('should group findings by nodeId', () => {
      const findings: Finding[] = [
        { nodeId: '1', rule: 'R1', severity: 'must', message: 'Err1', path: 'file', line: 1 },
        { nodeId: '1', rule: 'R2', severity: 'should', message: 'Err2', path: 'file', line: 1 },
        { nodeId: '2', rule: 'R1', severity: 'nit', message: 'Err3', path: 'file', line: 2 },
      ];
      const grouped = groupFindingsByNode(findings);
      expect(grouped['1']).toHaveLength(2);
      expect(grouped['2']).toHaveLength(1);
    });

    it('should handle findings without nodeId', () => {
      const findings: Finding[] = [
        { rule: 'R1', severity: 'must', message: 'Global err', path: 'file', line: 0 }
      ];
      const grouped = groupFindingsByNode(findings);
      expect(grouped['unknown']).toHaveLength(1);
    });
  });

  describe('getMaxSeverity', () => {
    it('should return null for empty findings', () => {
      expect(getMaxSeverity([])).toBeNull();
    });

    it('should prioritize must over should and nit', () => {
      const findings: Finding[] = [
        { nodeId: '1', rule: 'R1', severity: 'nit', message: '', path: '', line: 0 },
        { nodeId: '1', rule: 'R2', severity: 'must', message: '', path: '', line: 0 },
      ];
      expect(getMaxSeverity(findings)).toBe('must');
    });

    it('should prioritize should over nit', () => {
      const findings: Finding[] = [
        { nodeId: '1', rule: 'R1', severity: 'nit', message: '', path: '', line: 0 },
        { nodeId: '1', rule: 'R2', severity: 'should', message: '', path: '', line: 0 },
      ];
      expect(getMaxSeverity(findings)).toBe('should');
    });

    it('should return nit if only nits exist', () => {
      const findings: Finding[] = [
        { nodeId: '1', rule: 'R1', severity: 'nit', message: '', path: '', line: 0 },
      ];
      expect(getMaxSeverity(findings)).toBe('nit');
    });
  });

  describe('getSeverityColor', () => {
    it('should return red for must', () => {
      const colors = getSeverityColor('must');
      expect(colors.border).toContain('red');
    });

    it('should return orange for should', () => {
      const colors = getSeverityColor('should');
      expect(colors.border).toContain('orange');
    });

    it('should return blue for nit', () => {
      const colors = getSeverityColor('nit');
      expect(colors.border).toContain('blue');
    });

    it('should return gray for null', () => {
      const colors = getSeverityColor(null);
      expect(colors.border).toContain('gray');
    });
  });

  describe('getFindingCountsBySeverity', () => {
    it('should count findings correctly', () => {
      const findings: Finding[] = [
        { rule: 'R1', severity: 'must', message: '', path: '', line: 0, nodeId: '1' },
        { rule: 'R2', severity: 'should', message: '', path: '', line: 0, nodeId: '1' },
        { rule: 'R3', severity: 'should', message: '', path: '', line: 0, nodeId: '1' },
        { rule: 'R4', severity: 'nit', message: '', path: '', line: 0, nodeId: '1' },
      ];
      const counts = getFindingCountsBySeverity(findings);
      expect(counts.must).toBe(1);
      expect(counts.should).toBe(2);
      expect(counts.nit).toBe(1);
      expect(counts.total).toBe(4);
    });
  });
});
