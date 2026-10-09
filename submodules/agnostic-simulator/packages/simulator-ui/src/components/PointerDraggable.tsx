import { useDraggable } from "@dnd-kit/core";
import type { CSSProperties, HTMLAttributes, MouseEvent, PointerEvent, ReactNode } from "react";
import { useSuppressClickAfterDrag } from "../hooks/useSuppressClickAfterDrag";

export interface PointerDraggableState {
  readonly isDragging: boolean;
}

export type PointerDraggableTransformBehavior = "move-source" | "overlay-only";

export interface PointerDraggableProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "id"
> {
  readonly id: string;
  readonly disabled?: boolean;
  /**
   * Keep the source in place when a PointerDragDropSurface overlay owns the
   * moving visual. The default preserves the original source-moving behavior.
   */
  readonly transformBehavior?: PointerDraggableTransformBehavior;
  readonly children: ReactNode | ((state: PointerDraggableState) => ReactNode);
}

/** Design-free draggable primitive for use inside PointerDragDropSurface. */
export function PointerDraggable({
  id,
  disabled = false,
  transformBehavior = "move-source",
  children,
  style,
  onClickCapture,
  onPointerDownCapture,
  ...props
}: PointerDraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });
  const { resetOnPointerDown, suppressOnClick } = useSuppressClickAfterDrag(isDragging);
  const handlePointerDownCapture = (event: PointerEvent<HTMLDivElement>) => {
    resetOnPointerDown();
    onPointerDownCapture?.(event);
  };
  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (suppressOnClick(event)) return;
    onClickCapture?.(event);
  };
  const dragStyle: CSSProperties = {
    ...style,
    transform:
      transformBehavior === "move-source" && transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)${style?.transform ? ` ${style.transform}` : ""}`
        : style?.transform,
  };

  return (
    <div
      ref={setNodeRef}
      {...props}
      {...listeners}
      {...attributes}
      onPointerDownCapture={handlePointerDownCapture}
      onClickCapture={handleClickCapture}
      style={dragStyle}
      data-dragging={isDragging || undefined}
      data-drag-disabled={disabled || undefined}
    >
      {typeof children === "function" ? children({ isDragging }) : children}
    </div>
  );
}
