import type { TransformResult as TransformResultType } from "@echo-lab/shared";

interface TransformResultProps {
  result: TransformResultType;
}

export function TransformResult({ result }: TransformResultProps) {
  return (
    <div className="animate-in fade-in duration-300 rounded-md border bg-muted/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-muted-foreground">Result:</p>
        <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 bg-secondary rounded">
          {result.transformation}
        </span>
      </div>
      <p className="font-mono text-sm break-all whitespace-pre-wrap">{result.result}</p>
    </div>
  );
}
