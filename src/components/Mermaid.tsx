import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  themeVariables: {
    fontFamily: "inherit",
  },
});

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;
      
      try {
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(false);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError(true);
        // Mermaid might leave garbage in the DOM on error, clean it up if necessary?
        // But render() returns string, so side effects are minimal on error usually.
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded text-sm font-mono whitespace-pre-wrap">
        Failed to render diagram.
        {chart}
      </div>
    );
  }

  return (
    <div 
        ref={ref}
        className="mermaid flex justify-center py-4 bg-white/50 rounded-md overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
