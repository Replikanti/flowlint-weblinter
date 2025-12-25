import { lazy, Suspense } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code2, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import ruleExamplesData from "@/data/rule-examples.json";

// Lazy load heavy components
const Mermaid = lazy(() => import("./Mermaid"));
const LazyHighlighter = lazy(() => import("./LazyHighlighter"));

interface RuleModalProps {
  readonly ruleId: string;
  readonly ruleName: string;
}

interface RuleExample {
  readme: string;
  good: string;
  bad: string;
}

const ruleExamples = ruleExamplesData as Record<string, RuleExample>;

const LoadingSpinner = () => (
  <div className="flex h-full items-center justify-center p-8 text-muted-foreground">
    <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading...
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CodeBlock = ({ className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const isMermaid = match && match[1] === 'mermaid';
  
  if (isMermaid) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Mermaid chart={String(children).replace(/\n$/, '')} />
      </Suspense>
    );
  }
  
  if (match) {
    return (
      <div className="bg-zinc-100 p-4 rounded-md my-4 overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </div>
    );
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export function RuleModal({ ruleId, ruleName }: RuleModalProps) {
  const exampleData = ruleExamples[ruleId];

  if (!exampleData) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 text-xs ml-auto">
          <Code2 className="mr-1.5 h-3 w-3" />
          Examples
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-mono flex items-center gap-2">
            {ruleId}: {ruleName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="readme" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 border-b">
            <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
              <TabsTrigger value="readme" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-rose-500 rounded-none py-3 px-1">Description</TabsTrigger>
              <TabsTrigger value="good" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-green-500 text-green-600/80 data-[state=active]:text-green-600 rounded-none py-3 px-1">Valid Example</TabsTrigger>
              <TabsTrigger value="bad" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-red-500 text-red-600/80 data-[state=active]:text-red-600 rounded-none py-3 px-1">Invalid Example</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-zinc-50/50">
            <TabsContent value="readme" className="m-0 p-6">
              <div className="prose prose-sm max-w-none prose-pre:bg-zinc-100 prose-pre:text-zinc-800">
                <ReactMarkdown
                  components={{
                    code: CodeBlock
                  }}
                >
                  {exampleData.readme}
                </ReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="good" className="m-0 h-full">
               <Suspense fallback={<LoadingSpinner />}>
                 <LazyHighlighter language="json">
                   {exampleData.good || "{}"}
                 </LazyHighlighter>
               </Suspense>
            </TabsContent>
            <TabsContent value="bad" className="m-0 h-full">
               <Suspense fallback={<LoadingSpinner />}>
                 <LazyHighlighter language="json">
                   {exampleData.bad || "{}"}
                 </LazyHighlighter>
               </Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}