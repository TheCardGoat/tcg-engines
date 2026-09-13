import { useDroppable } from "@dnd-kit/core";
import type { PlayerId } from "@tcg-engines/naruto-engine";
import type { ReactNode } from "react";

import classes from "./board.module.css";
import type { BoardKit } from "./types.ts";

/**
 * The utility strip is the stable, full-width destination for playing a
 * support from hand. It stays registered before a drag begins so touch
 * collision detection does not depend on the drag-start render.
 */
export function SupportPlayDropZone({
  owner,
  kit,
  className,
  children,
}: {
  readonly owner: PlayerId;
  readonly kit: BoardKit;
  readonly className: string;
  readonly children: ReactNode;
}) {
  const enabled =
    kit.dragging?.targets.includes("play-support") === true && owner === kit.projection.viewer;
  const { isOver, setNodeRef } = useDroppable({
    id: `naruto-drop:play-support:${owner}`,
    disabled: !kit.interactive || owner !== kit.projection.viewer,
  });
  const dropOver = enabled && isOver;

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${enabled ? classes.supportPlayDropZone : ""} ${
        dropOver ? classes.supportPlayDropZoneOver : ""
      }`}
      data-testid={`naruto-drop-play-support-${owner}`}
      data-drop-valid={enabled || undefined}
      data-drop-over={dropOver || undefined}
      aria-label={enabled ? "Drop here to play support" : undefined}
    >
      {children}
      {enabled ? (
        <span className={classes.supportPlayDropOverlay} aria-hidden="true">
          <span className={classes.supportPlayDropGlyph} />
          <span>Play support</span>
        </span>
      ) : null}
    </div>
  );
}
