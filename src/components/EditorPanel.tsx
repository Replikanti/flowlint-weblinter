import { AlertCircle, Check, Settings2, Share2, Loader2, Code2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { RULES_METADATA } from '@replikanti/flowlint-core';

const getBadgeVariant = (severity: string) => {
  if (severity === 'must') return 'destructive';
  if (severity === 'should') return 'secondary';
  return 'outline';
};

interface EditorPanelProps {
  readonly jsonInput: string;
  readonly onJsonChange: (value: string) => void;
  readonly error: string | null;
  readonly isCopied: boolean;
  readonly onShare: () => void;
  readonly enabledRules: Record<string, boolean>;
  readonly onToggleRule: (id: string) => void;
  readonly onToggleAll: (enable: boolean) => void;
  readonly activeRuleCount: number;
  readonly totalRuleCount: number;
  readonly isLoading?: boolean;
  readonly idPrefix?: string;
}

export function EditorPanel({
  jsonInput,
  onJsonChange,
  error,
  isCopied,
  onShare,
  enabledRules,
  onToggleRule,
  onToggleAll,
  activeRuleCount,
  totalRuleCount,
  isLoading = false,
  idPrefix = ''
}: EditorPanelProps) {
  const shareIcon = (() => {
    if (isLoading) return <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />;
    if (isCopied) return <Check className="mr-2 h-3.5 w-3.5" />;
    return <Share2 className="mr-2 h-3.5 w-3.5" />;
  })();

  const shareText = (() => {
    if (isLoading) return "Saving...";
    if (isCopied) return "Copied!";
    return "Share";
  })();

  return (
    <div className="h-full flex flex-col bg-white relative">
      {isLoading && !jsonInput && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      )}
      <div className="p-4 border-b border-zinc-200 bg-white flex justify-between items-center shrink-0 h-16">
        <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-800 uppercase tracking-wider">
          <Code2 className="w-4 h-4 text-rose-500" /> Editor
        </h2>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onShare}
            disabled={!jsonInput.trim() || isLoading}
          >
            {shareIcon}
            {shareText}
          </Button>
          <Popover>

            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 border-dashed" disabled={isLoading}>
                <Settings2 className="mr-2 h-4 w-4" />
                {idPrefix ? 'Rules' : 'Filter Rules'}
                <Badge variant="secondary" className="ml-2 h-5 rounded-sm px-1 font-mono">
                  {activeRuleCount}/{totalRuleCount}
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="end">
              <div className="p-4 pb-2">
                <h4 className="font-medium leading-none mb-2">Active Rules</h4>
                <p className="text-sm text-muted-foreground">
                  Select which rules to apply to the analysis.
                </p>
              </div>
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-y border-zinc-100">
                <Button variant="ghost" size="sm" onClick={() => onToggleAll(true)} className="h-8 text-xs">
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onToggleAll(false)} className="h-8 text-xs text-red-600 hover:text-red-700">
                  Deselect All
                </Button>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-4">
                  {RULES_METADATA.map((rule) => (
                    <div key={rule.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`${idPrefix}${rule.id}`}
                        checked={enabledRules[rule.id]}
                        onCheckedChange={() => onToggleRule(rule.id)}
                        className="mt-1"
                        disabled={isLoading}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor={`${idPrefix}${rule.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                        >
                          <span>{rule.id}</span>
                          <Badge variant={getBadgeVariant(rule.severity)} className="text-[10px] h-4 px-1 py-0 uppercase">
                            {rule.severity}
                          </Badge>
                        </Label>
                        <p className="text-xs font-medium text-zinc-700">
                          {rule.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col min-h-0">
        <textarea
          className="flex-1 w-full p-4 font-mono text-sm bg-white border border-zinc-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-zinc-700 placeholder:text-zinc-400 shadow-sm"
          placeholder="Paste your n8n workflow JSON here..."
          value={jsonInput}
          onChange={(e) => onJsonChange(e.target.value)}
          spellCheck={false}
          readOnly={isLoading}
        />
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">Invalid JSON: {error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
