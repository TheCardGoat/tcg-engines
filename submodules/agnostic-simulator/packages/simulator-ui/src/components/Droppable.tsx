import { useCallback, useState } from "react";

import type { ZoneRole } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { useDnd } from "../hooks/useDnd";

export interface DroppableProps {
  zoneId: string;
  zoneRole: ZoneRole;
  allowedDropRoles?: ZoneRole[];
  onDrop?: (entityId: string, targetZoneId: string, targetZoneRole: ZoneRole) => void;
  onDragEnter?: (entityId: string, zoneId: string) => void;
  onDragLeave?: (entityId: string, zoneId: string) => void;
  children: React.ReactNode;
}

export function Droppable({
  zoneId,
  zoneRole,
  allowedDropRoles,
  onDrop,
  onDragEnter,
  onDragLeave,
  children,
}: DroppableProps) {
  const { state, setDropTarget, endDrag } = useDnd();
  const [, setDragCounter] = useState(0);

  const isDropLegal = (_dragEntityKind: string | undefined): boolean => {
    if (!allowedDropRoles || allowedDropRoles.length === 0) return true;
    return allowedDropRoles.includes(zoneRole);
  };

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!event.dataTransfer) return;
      const dragData = state.dragData;
      if (!dragData) return;
      const legal = isDropLegal(dragData.entityKind);
      event.dataTransfer.dropEffect = legal ? "move" : "none";
    },
    [state.dragData],
  );

  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragCounter((c) => c + 1);
      const dragData = state.dragData;
      if (!dragData) return;
      const legal = isDropLegal(dragData.entityKind);
      setDropTarget(zoneId, zoneRole, legal);
      onDragEnter?.(dragData.entityId, zoneId);
    },
    [state.dragData, zoneId, zoneRole, setDropTarget, onDragEnter],
  );

  const handleDragLeave = useCallback(() => {
    setDragCounter((c) => {
      const next = c - 1;
      if (next === 0) setDropTarget(null, null, false);
      return next;
    });
    const dragData = state.dragData;
    if (dragData) onDragLeave?.(dragData.entityId, zoneId);
  }, [state.dragData, zoneId, setDropTarget, onDragLeave]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragCounter(0);
      const dragData = state.dragData;
      if (!dragData) return;
      const legal = isDropLegal(dragData.entityKind);
      setDropTarget(null, null, false);
      endDrag();
      if (legal) onDrop?.(dragData.entityId, zoneId, zoneRole);
    },
    [state.dragData, zoneId, zoneRole, setDropTarget, endDrag, onDrop],
  );

  const isTargeted = state.dropTargetId === zoneId;
  const isLegal = isTargeted && state.isDropLegal;
  const isIllegal = isTargeted && !state.isDropLegal;

  return (
    <div
      className={cx(
        "droppable-zone relative transition-colors",
        isLegal && "ring-2 ring-[var(--game-accent)]/60 ring-inset",
        isIllegal && "ring-2 ring-red-400/40 ring-inset",
      )}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-dropeffect={isLegal ? "move" : "none"}
      aria-label={`Drop zone ${zoneRole}`}
    >
      {isLegal && (
        <div
          className="pointer-events-none absolute inset-0 z-10 rounded-lg bg-[var(--game-accent)]/10"
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
