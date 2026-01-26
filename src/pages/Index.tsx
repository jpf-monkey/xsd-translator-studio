import { useState, useCallback } from "react";
import { FileCode2, Terminal, CheckSquare, Sparkles, Settings2, FileText, Globe, Database } from "lucide-react";
import { FileUploader } from "@/components/FileUploader";
import { TerminalOutput, TerminalLine } from "@/components/TerminalOutput";
import { CodeEditor } from "@/components/CodeEditor";
import { ValidationPanel, ValidationStatus } from "@/components/ValidationPanel";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const DOCUMENT_TYPES = [
  { value: "factura", label: "Factura" },
  { value: "nota_credito", label: "Nota de Crédito" },
  { value: "nota_debito", label: "Nota de Débito" },
  { value: "recibo", label: "Recibo" },
  { value: "guia_remision", label: "Guía de Remisión" },
];

const COUNTRIES = [
  { value: "mx", label: "México" },
  { value: "co", label: "Colombia" },
  { value: "pe", label: "Perú" },
  { value: "cl", label: "Chile" },
  { value: "ar", label: "Argentina" },
  { value: "ec", label: "Ecuador" },
];

const EXISTING_XSLT_RECORDS = [
  { value: "xslt_mx_factura_v1", label: "MX - Factura v1.0" },
  { value: "xslt_co_factura_v2", label: "CO - Factura v2.1" },
  { value: "xslt_pe_nota_credito", label: "PE - Nota Crédito v1.0" },
];

const Index = () => {
  // File states
  const [xsdFile, setXsdFile] = useState<File | null>(null);
  const [mappingFile, setMappingFile] = useState<File | null>(null);
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [instructions, setInstructions] = useState("");
  
  // New fields
  const [documentType, setDocumentType] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  
  // CONTEXTO_BASE mode
  const [isOptimizeMode, setIsOptimizeMode] = useState(false);
  const [existingXsltFile, setExistingXsltFile] = useState<File | null>(null);
  const [selectedXsltRecord, setSelectedXsltRecord] = useState<string>("");

  // Processing states
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>("idle");
  const [validationLogs, setValidationLogs] = useState<string[]>([]);

  const canGenerate = xsdFile !== null && mappingFile !== null;
  const canDownload = validationStatus === "success" && generatedCode !== "";

  const addTerminalLine = useCallback((text: string, type: TerminalLine["type"]) => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random(),
      text,
      type,
      timestamp: new Date(),
    };
    setTerminalLines((prev) => [...prev, newLine]);
  }, []);

  const simulateGeneration = useCallback(async () => {
    setIsProcessing(true);
    setTerminalLines([]);
    setGeneratedCode("");
    setValidationStatus("running");
    setValidationLogs([]);

    // Simulate processing steps
    const steps = [
      { text: "Iniciando análisis de esquema XSD fiscal...", type: "prompt" as const, delay: 500 },
      { text: "Esquema XSD cargado correctamente", type: "success" as const, delay: 800 },
      { text: `Archivo: ${xsdFile?.name}`, type: "info" as const, delay: 200 },
      { text: "Procesando archivo de mapeo...", type: "prompt" as const, delay: 600 },
      { text: `Detectadas 45 reglas de transformación`, type: "success" as const, delay: 700 },
      { text: "Analizando estructura del XML GUF de ejemplo...", type: "prompt" as const, delay: 500 },
      { text: xmlFile ? `Muestra XML validada: ${xmlFile.name}` : "Sin archivo XML de muestra", type: xmlFile ? "success" as const : "warning" as const, delay: 400 },
      { text: "Generando plantilla XSLT...", type: "prompt" as const, delay: 300 },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.delay));
      addTerminalLine(step.text, step.type);
    }

    // Generate XSLT code progressively
    const xsltLines = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<xsl:stylesheet version="2.0"',
      '    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"',
      '    xmlns:cfdi="http://www.sat.gob.mx/cfd/4"',
      '    xmlns:tfd="http://www.sat.gob.mx/TimbreFiscalDigital">',
      '',
      '  <!-- Plantilla principal de transformación -->',
      '  <xsl:output method="xml" indent="yes" encoding="UTF-8"/>',
      '',
      '  <xsl:template match="/">',
      '    <FacturaElectronica>',
      '      <xsl:apply-templates select="//cfdi:Comprobante"/>',
      '    </FacturaElectronica>',
      '  </xsl:template>',
      '',
      '  <!-- Transformación de Comprobante -->',
      '  <xsl:template match="cfdi:Comprobante">',
      '    <Encabezado>',
      '      <Version><xsl:value-of select="@Version"/></Version>',
      '      <Serie><xsl:value-of select="@Serie"/></Serie>',
      '      <Folio><xsl:value-of select="@Folio"/></Folio>',
      '      <Fecha><xsl:value-of select="@Fecha"/></Fecha>',
      '      <FormaPago><xsl:value-of select="@FormaPago"/></FormaPago>',
      '      <Total><xsl:value-of select="@Total"/></Total>',
      '      <Moneda><xsl:value-of select="@Moneda"/></Moneda>',
      '    </Encabezado>',
      '    <xsl:apply-templates select="cfdi:Emisor"/>',
      '    <xsl:apply-templates select="cfdi:Receptor"/>',
      '    <xsl:apply-templates select="cfdi:Conceptos"/>',
      '  </xsl:template>',
      '',
      '  <!-- Datos del Emisor -->',
      '  <xsl:template match="cfdi:Emisor">',
      '    <Emisor>',
      '      <RFC><xsl:value-of select="@Rfc"/></RFC>',
      '      <Nombre><xsl:value-of select="@Nombre"/></Nombre>',
      '      <RegimenFiscal><xsl:value-of select="@RegimenFiscal"/></RegimenFiscal>',
      '    </Emisor>',
      '  </xsl:template>',
      '',
      '</xsl:stylesheet>',
    ];

    for (let i = 0; i < xsltLines.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setGeneratedCode((prev) => prev + xsltLines[i] + "\n");
    }

    addTerminalLine("Código XSLT generado correctamente", "success");
    addTerminalLine("Iniciando validación contra esquema...", "prompt");

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Validation logs
    const logs = [
      "› Validando estructura XML...",
      "✓ Estructura XML válida",
      "› Verificando namespaces...",
      "✓ Namespaces correctos",
      "› Comprobando reglas de mapeo...",
      "✓ 45/45 reglas aplicadas",
      "› Validando contra XSD fiscal...",
      "✓ Cumple 100% del esquema XSD",
      "",
      "✓ VALIDACIÓN COMPLETADA EXITOSAMENTE",
    ];

    for (const log of logs) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setValidationLogs((prev) => [...prev, log]);
    }

    addTerminalLine("Validación completada exitosamente", "success");
    addTerminalLine("XSLT listo para descargar", "success");

    setIsProcessing(false);
    setValidationStatus("success");
  }, [xsdFile, xmlFile, addTerminalLine]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([generatedCode], { type: "application/xslt+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transformacion-fiscal.xslt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedCode]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">XSLT Generator Agent</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-32 h-8 bg-secondary border-border text-sm">
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Agente activo</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Configuration */}
        <div className="w-80 border-r border-border flex flex-col bg-card">
          <div className="panel-header">
            <Settings2 className="w-4 h-4 text-primary" />
            <span className="font-medium">Configuración de Insumos</span>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-5">
            <FileUploader
              label="Esquema XSD Fiscal"
              accept=".xsd"
              description="Archivo de esquema XML"
              onFileSelect={setXsdFile}
            />
            <FileUploader
              label="Archivo de Mapeo"
              accept=".xlsx,.xls,.json"
              description="Excel o JSON con reglas"
              onFileSelect={setMappingFile}
            />
            
            {/* Tipo de Documento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Tipo de Documento
              </Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Selecciona el tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Define el tipo de documento fiscal a generar
              </p>
            </div>

            <FileUploader
              label="XML GUF de Ejemplo"
              accept=".xml"
              description="Opcional - para pruebas"
              onFileSelect={setXmlFile}
            />

            {/* CONTEXTO_BASE Section */}
            <div className="space-y-3 p-3 rounded-lg border border-border bg-secondary/30">
              <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-primary" />
                CONTEXTO_BASE
              </Label>
              
              {/* Mode Switch */}
              <div className="flex items-center justify-between p-2 rounded bg-secondary">
                <span className="text-xs text-muted-foreground">
                  {isOptimizeMode ? "Optimizar XSLT existente" : "Generar desde cero"}
                </span>
                <Switch
                  checked={isOptimizeMode}
                  onCheckedChange={setIsOptimizeMode}
                />
              </div>
              
              {isOptimizeMode && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-xs text-muted-foreground">
                    Selecciona un XSLT existente de la base de datos o sube uno nuevo.
                  </p>
                  
                  {/* Select from database */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <Database className="w-3 h-3" />
                      Desde base de datos
                    </Label>
                    <Select value={selectedXsltRecord} onValueChange={setSelectedXsltRecord}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Selecciona un XSLT" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXISTING_XSLT_RECORDS.map((record) => (
                          <SelectItem key={record.value} value={record.value}>
                            {record.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">o</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  
                  {/* Upload XSLT */}
                  <FileUploader
                    label="Subir XSLT"
                    accept=".xslt,.xsl"
                    description="Cargar archivo XSLT"
                    onFileSelect={setExistingXsltFile}
                  />
                  
                  {(existingXsltFile || selectedXsltRecord) && (
                    <div className="p-2 rounded bg-primary/10 border border-primary/20">
                      <p className="text-xs text-primary">
                        ℹ️ Se aplicará: "Mantén la lógica existente y solo modifica los nodos afectados por el nuevo mapeo"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Instrucciones Adicionales
              </label>
              <Textarea
                placeholder="Ej: Usa el tipo de cambio de la fecha de emisión..."
                className="min-h-[100px] bg-secondary border-border resize-none"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Center Panel - Agent Activity */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Terminal Section */}
          <div className="h-1/3 border-b border-border flex flex-col">
            <div className="panel-header">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="font-medium">Terminal de Estado</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <TerminalOutput lines={terminalLines} isProcessing={isProcessing} />
            </div>
          </div>

          {/* Code Editor Section */}
          <div className="flex-1 flex flex-col">
            <div className="panel-header">
              <FileCode2 className="w-4 h-4 text-primary" />
              <span className="font-medium">Editor de Código</span>
              <span className="ml-auto text-xs text-muted-foreground">Solo lectura</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor code={generatedCode} />
            </div>
          </div>
        </div>

        {/* Right Panel - Validation */}
        <div className="w-80 border-l border-border bg-card flex flex-col">
          <div className="panel-header">
            <CheckSquare className="w-4 h-4 text-primary" />
            <span className="font-medium">Validación y Resultados</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ValidationPanel
              status={validationStatus}
              logs={validationLogs}
              onGenerate={simulateGeneration}
              onDownload={handleDownload}
              canGenerate={canGenerate}
              canDownload={canDownload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
