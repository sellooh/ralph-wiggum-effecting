import { useCallback, useEffect } from "react";
import { useAtom } from "@effect-atom/atom-react";
import type { TransformationType } from "@echo-lab/shared";
import { toast } from "sonner";
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

/**
 * Get a user-friendly error message based on error type
 */
function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    // Check for typed errors with _tag discriminator
    if ("_tag" in error) {
      switch (error._tag) {
        case "InvalidInput":
          return `Invalid input: ${"message" in error ? error.message : "Please check your input"}`;
        case "TransformationFailed":
          return `Transformation failed: ${"message" in error ? error.message : "Unable to process"}`;
      }
    }
    // Fall back to message property if available
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return "An unexpected error occurred";
}

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

  // Show toast notification when an error occurs
  useEffect(() => {
    if (transform.isError && transform.error) {
      const errorMessage = getErrorMessage(transform.error);
      toast.error(errorMessage);
    }
  }, [transform.isError, transform.error]);

  const handleTransform = useCallback(() => {
    if (!inputText.trim() || transform.isPending) return;
    transform.mutate({
      text: inputText,
      transformation: selectedTransformation,
    });
  }, [inputText, selectedTransformation, transform]);

  // Handle Cmd/Ctrl + Enter keyboard shortcut
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleTransform();
      }
    },
    [handleTransform],
  );

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter text to transform..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-32 resize-none"
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Select
          value={selectedTransformation}
          onValueChange={(value) => setSelectedTransformation(value as TransformationType)}
        >
          <SelectTrigger className="w-full sm:w-48">
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

        <Button
          onClick={handleTransform}
          disabled={!inputText.trim() || transform.isPending}
          className="w-full sm:w-auto transition-all duration-200 active:scale-95"
        >
          {transform.isPending ? "Transforming..." : "Transform"}
        </Button>
      </div>

      {transform.isError && transform.error && (
        <p className="text-sm text-destructive">{getErrorMessage(transform.error)}</p>
      )}

      {transform.isSuccess && transform.data && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 rounded-md border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground mb-1">Result:</p>
          <p className="font-mono text-sm break-all">{transform.data.result}</p>
        </div>
      )}
    </div>
  );
}
