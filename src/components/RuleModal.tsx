import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ruleExamplesData from "@/data/rule-examples.json";

interface RuleModalProps {
  ruleId: string;
  ruleName: string;
}

export function RuleModal({ ruleId, ruleName }: RuleModalProps) {
  const exampleData = (ruleExamplesData as any)[ruleId];

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
                <ReactMarkdown>{exampleData.readme}</ReactMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="good" className="m-0 h-full">
               <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{margin: 0, height: '100%', padding: '1.5rem'}} showLineNumbers>
                 {exampleData.good || "{}"}
               </SyntaxHighlighter>
            </TabsContent>
            <TabsContent value="bad" className="m-0 h-full">
               <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{margin: 0, height: '100%', padding: '1.5rem'}} showLineNumbers>
                 {exampleData.bad || "{}"}
               </SyntaxHighlighter>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
