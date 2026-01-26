import { CheckCircle2, XCircle, AlertCircle, Download, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ValidationStatus = "idle" | "running" | "success" | "error";

interface ValidationPanelProps {
  status: ValidationStatus;
  logs: string[];
  onGenerate: () => void;
  onDownload: () => void;
  canGenerate: boolean;
  canDownload: boolean;
}

export function ValidationPanel({
  status,
  logs,
  onGenerate,
  onDownload,
  canGenerate,
  canDownload,
}: ValidationPanelProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "success":
        return (
          <div className="status-badge status-success">
            <CheckCircle2 className="w-4 h-4" />
            EXITOSO
          </div>
        );
      case "error":
        return (
          <div className="status-badge status-error">
            <XCircle className="w-4 h-4" />
            FALLIDO
          </div>
        );
      case "running":
        return (
          <div className="status-badge status-pending">
            <Loader2 className="w-4 h-4 animate-spin" />
            VALIDANDO
          </div>
        );
      default:
        return (
          <div className="status-badge bg-secondary text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            PENDIENTE
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Generate Button */}
      <div className="p-4 border-b border-border">
        <Button
          onClick={onGenerate}
          disabled={!canGenerate || status === "running"}
          className="w-full"
          size="lg"
        >
          {status === "running" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Generar y Validar
            </>
          )}
        </Button>
      </div>

      {/* Status */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estado:</span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 p-4 overflow-auto">
        <h4 className="text-sm font-medium text-foreground mb-3">Log de Validación</h4>
        <div className="bg-terminal-bg rounded-lg p-3 min-h-[200px]">
          {logs.length === 0 ? (
            <p className="text-muted-foreground/50 text-sm font-mono">
              Los resultados aparecerán aquí...
            </p>
          ) : (
            <div className="space-y-1.5 font-mono text-sm">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start gap-2",
                    log.includes("✓") && "text-success",
                    log.includes("✗") && "text-destructive",
                    log.includes("⚠") && "text-warning",
                    !log.includes("✓") && !log.includes("✗") && !log.includes("⚠") && "text-terminal-text"
                  )}
                >
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Download Button */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={onDownload}
          disabled={!canDownload}
          variant="success"
          className="w-full"
          size="lg"
        >
          <Download className="w-4 h-4" />
          Descargar .xslt final
        </Button>
      </div>
    </div>
  );
}
