import { useCallback } from "react";

import { cx } from "../class-names";
import { useDnd, type DragData } from "../hooks/useDnd";

export interface DraggableProps {
  dragData: DragData;
  disabled?: boolean;
  children: React.ReactNode;
  onDragStart?: (data: DragData, event: React.DragEvent) => void;
  onDragEnd?: (data: DragData, event: React.DragEvent) => void;
}

export function Draggable({
  dragData,
  disabled = false,
  children,
  onDragStart,
  onDragEnd,
}: DraggableProps) {
  const { state, startDrag, endDrag } = useDnd();
  const isDragging = state.isDragging && state.dragData?.entityId === dragData.entityId;

  const handleDragStart = useCallback(
    (event: React.DragEvent) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      startDrag(dragData);
      event.dataTransfer?.setData("text/plain", dragData.entityId);
      event.dataTransfer?.setData(
        "application/json",
        JSON.stringify({ entityId: dragData.entityId, zoneId: dragData.zoneId }),
      );
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
      onDragStart?.(dragData, event);
    },
    [disabled, dragData, startDrag, onDragStart],
  );

  const handleDragEnd = useCallback(
    (event: React.DragEvent) => {
      endDrag();
      onDragEnd?.(dragData, event);
    },
    [dragData, endDrag, onDragEnd],
  );

  return (
    <div
      className={cx("draggable-wrapper", isDragging && "is-dragging")}
      draggable={!disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      aria-grabbed={isDragging}
      role="application"
      style={isDragging ? { opacity: 0.4 } : undefined}
    >
      {children}
    </div>
  );
}
