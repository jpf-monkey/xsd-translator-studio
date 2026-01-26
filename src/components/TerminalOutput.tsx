import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface TerminalLine {
  id: string;
  text: string;
  type: "info" | "success" | "error" | "warning" | "prompt";
  timestamp?: Date;
}

interface TerminalOutputProps {
  lines: TerminalLine[];
  isProcessing?: boolean;
}

export function TerminalOutput({ lines, isProcessing }: TerminalOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  const getLineClass = (type: TerminalLine["type"]) => {
    switch (type) {
      case "success":
        return "text-success";
      case "error":
        return "text-destructive";
      case "warning":
        return "text-warning";
      case "prompt":
        return "text-primary";
      default:
        return "text-terminal-text";
    }
  };

  const getPrefix = (type: TerminalLine["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      case "warning":
        return "⚠";
      case "prompt":
        return ">";
      default:
        return "›";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="h-full bg-terminal-bg p-4 overflow-auto font-mono text-sm"
    >
      {lines.length === 0 ? (
        <div className="text-muted-foreground/50 flex items-center gap-2">
          <span className="text-primary">$</span>
          <span>Esperando comandos...</span>
          <span className="w-2 h-4 bg-primary animate-blink" />
        </div>
      ) : (
        <div className="space-y-1">
          {lines.map((line) => (
            <div 
              key={line.id} 
              className={cn("terminal-line flex items-start gap-2", getLineClass(line.type))}
            >
              <span className="opacity-60 select-none">{getPrefix(line.type)}</span>
              <span>{line.text}</span>
            </div>
          ))}
          {isProcessing && (
            <div className="terminal-line flex items-center gap-2 text-primary">
              <span className="opacity-60">›</span>
              <span>Procesando</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
