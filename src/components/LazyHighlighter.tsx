import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  readonly language: string;
  readonly children: string;
}

export default function LazyHighlighter({ language, children }: Props) {
  return (
    <SyntaxHighlighter 
        language={language} 
        style={vscDarkPlus} 
        customStyle={{margin: 0, height: '100%', padding: '1.5rem'}} 
        showLineNumbers
    >
      {children}
    </SyntaxHighlighter>
  );
}
