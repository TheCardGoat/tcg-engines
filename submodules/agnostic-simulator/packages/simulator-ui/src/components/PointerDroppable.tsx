import { useDroppable } from "@dnd-kit/core";
import type { HTMLAttributes, ReactNode } from "react";

export interface PointerDroppableState {
  readonly isOver: boolean;
}

export interface PointerDroppableProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "id"
> {
  readonly id: string;
  readonly disabled?: boolean;
  readonly children: ReactNode | ((state: PointerDroppableState) => ReactNode);
}

/** Design-free drop target primitive for use inside PointerDragDropSurface. */
export function PointerDroppable({
  id,
  disabled = false,
  children,
  ...props
}: PointerDroppableProps) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled });
  return (
    <div
      ref={setNodeRef}
      {...props}
      data-drop-over={isOver || undefined}
      data-drop-disabled={disabled || undefined}
    >
      {typeof children === "function" ? children({ isOver }) : children}
    </div>
  );
}
