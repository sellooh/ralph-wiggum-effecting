import { useAtom } from "@effect-atom/atom-react";
import type { TransformationType } from "@echo-lab/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inputTextAtom, selectedTransformationAtom } from "@/atoms";
import { useTransform } from "@/hooks/useTransform";

const transformationOptions: { value: TransformationType; label: string }[] = [
  { value: "uppercase", label: "Uppercase" },
  { value: "lowercase", label: "Lowercase" },
  { value: "reverse", label: "Reverse" },
  { value: "base64-encode", label: "Base64 Encode" },
  { value: "base64-decode", label: "Base64 Decode" },
  { value: "count", label: "Character Count" },
];

export function TransformCard() {
  const [inputText, setInputText] = useAtom(inputTextAtom);
  const [selectedTransformation, setSelectedTransformation] = useAtom(selectedTransformationAtom);
  const transform = useTransform();

  const handleTransform = () => {
    if (!inputText.trim()) return;
    transform.mutate({
      text: inputText,
      transformation: selectedTransformation,
    });
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter text to transform..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="min-h-32 resize-none"
      />

      <div className="flex items-center gap-3">
        <Select
          value={selectedTransformation}
          onValueChange={(value) => setSelectedTransformation(value as TransformationType)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select transformation" />
          </SelectTrigger>
          <SelectContent>
            {transformationOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleTransform} disabled={!inputText.trim() || transform.isPending}>
          {transform.isPending ? "Transforming..." : "Transform"}
        </Button>
      </div>

      {transform.isError && (
        <p className="text-sm text-destructive">
          Error: {transform.error?.message || "Something went wrong"}
        </p>
      )}

      {transform.isSuccess && transform.data && (
        <div className="rounded-md border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground mb-1">Result:</p>
          <p className="font-mono text-sm break-all">{transform.data.result}</p>
        </div>
      )}
    </div>
  );
}
