import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSeverityColor, type FindingSeverity } from '@/lib/finding-utils';
import type { WorkflowNodeData } from '@/lib/graph-to-flow';

/**
 * Custom workflow node component with severity-based styling
 * Shows node name, type, and finding count badge
 */
export const WorkflowNode = memo(({ data, selected }: NodeProps) => {
  const { label, nodeType, maxSeverity, findingCount } = data as WorkflowNodeData;
  const severityColors = getSeverityColor(maxSeverity as FindingSeverity | null);

  const hasFinding = findingCount > 0;

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border-2 bg-white shadow-md transition-all min-w-[180px] max-w-[220px]',
        hasFinding ? severityColors.border : 'border-gray-300',
        selected && 'ring-2 ring-primary ring-offset-2',
        'hover:shadow-lg cursor-pointer'
      )}
    >
      {/* Input handle (left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-gray-400 border-2 border-white"
      />

      {/* Node content */}
      <div className="flex flex-col gap-1.5">
        {/* Node label */}
        <div className="font-semibold text-sm text-gray-900 truncate" title={label}>
          {label}
        </div>

        {/* Node type */}
        <div className="text-xs text-gray-500 font-mono truncate" title={nodeType}>
          {nodeType}
        </div>

        {/* Finding badge */}
        {hasFinding && (
          <div className="flex items-center gap-1 mt-1">
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold',
                severityColors.badge
              )}
            >
              <AlertCircle className="w-3 h-3" />
              {findingCount} {findingCount === 1 ? 'issue' : 'issues'}
            </div>
          </div>
        )}
      </div>

      {/* Output handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-gray-400 border-2 border-white"
      />
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';
