import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-12 w-full resize-none rounded-md bg-transparent px-1 py-2 text-sm text-fg placeholder:text-subtle outline-none",
        className,
      )}
      {...props}
    />
  );
});
