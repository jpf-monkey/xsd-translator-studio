import { useRef, useEffect } from "react";

interface CodeEditorProps {
  code: string;
  language?: string;
}

export function CodeEditor({ code, language = "xslt" }: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [code]);

  const highlightXSLT = (text: string) => {
    // Simple syntax highlighting for XSLT
    const lines = text.split("\n");
    
    return lines.map((line, index) => {
      let highlighted = line
        // XML tags
        .replace(/(&lt;\/?[\w:-]+)/g, '<span class="text-editor-tag">$1</span>')
        .replace(/(<\/?[\w:-]+)/g, '<span class="text-editor-tag">$1</span>')
        // Attributes
        .replace(/(\s)([\w:-]+)(=)/g, '$1<span class="text-editor-attr">$2</span>$3')
        // Strings
        .replace(/(".*?")/g, '<span class="text-editor-string">$1</span>')
        // Keywords
        .replace(/(xsl:|xmlns:|select|match|name|mode|version)/g, '<span class="text-editor-keyword">$1</span>')
        // Comments
        .replace(/(&lt;!--.*?--&gt;)/g, '<span class="text-muted-foreground">$1</span>');

      return (
        <div key={index} className="flex">
          <span className="w-12 text-right pr-4 text-muted-foreground/40 select-none flex-shrink-0">
            {index + 1}
          </span>
          <span 
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: highlighted || "&nbsp;" }}
          />
        </div>
      );
    });
  };

  return (
    <div 
      ref={containerRef}
      className="h-full bg-editor-bg p-4 overflow-auto font-mono text-sm text-foreground/90"
    >
      {code ? (
        <div className="min-w-max">
          {highlightXSLT(code)}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <p>El código XSLT aparecerá aquí</p>
            <p className="text-xs mt-1">mientras el agente lo genera</p>
          </div>
        </div>
      )}
    </div>
  );
}
