import { useDroppable } from "@dnd-kit/core";

import type { PlayerId } from "@tcg-engines/naruto-engine";

import cards from "./cards.module.css";
import type { BoardKit } from "./types.ts";

export function DropSlot({
  kind,
  owner,
  slot,
  kit,
  className = "",
}: {
  readonly kind: import("./types.ts").NarutoDropTarget;
  readonly owner: PlayerId;
  readonly slot: number;
  readonly kit: BoardKit;
  readonly className?: string;
}) {
  const enabled = kit.dragging?.targets.includes(kind) === true && owner === kit.projection.viewer;
  const { isOver, setNodeRef } = useDroppable({
    id: `naruto-drop:${kind}:${owner}:${slot}`,
    // Register every local empty slot before a drag starts. Enabling a target
    // only after onDragStart makes dnd-kit collision detection timing-dependent,
    // especially for short touch drags.
    disabled: !kit.interactive || owner !== kit.projection.viewer,
  });
  const dropOver = enabled && isOver;

  return (
    <span
      ref={setNodeRef}
      className={[
        cards.slot,
        enabled ? cards.dropTarget : "",
        dropOver ? cards.dropTargetOver : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid={`naruto-drop-${kind}-${owner}-${slot}`}
      data-slot-index={slot}
      data-drop-valid={enabled || undefined}
      data-drop-over={dropOver || undefined}
      aria-label={enabled ? `Drop to ${kind} slot ${slot + 1}` : undefined}
    >
      {enabled ? (
        <span className={cards.dropTargetLabel} aria-hidden="true">
          {kind === "battler" ? "Summon here" : "Set support"}
        </span>
      ) : null}
    </span>
  );
}
