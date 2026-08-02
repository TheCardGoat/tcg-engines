/**
 * Shared board-tree types: the interaction state owned by NarutoBoard and
 * the "kit" prop bundle threaded through DesktopBoard/MobileBoard/SeatHalf.
 */

import type { AttackerKind, PlayerId } from "@tcg-engines/naruto-engine";

import type { ActionPill, AttackTarget } from "../projection/interactions.ts";
import type { NarutoProjection } from "../projection/projectSimulator.ts";

export type EntityZoneKind = "hand" | "character" | "support" | "leader" | "trash" | "deck";

export type Selection =
  | { readonly kind: "hand"; readonly uid: string }
  | { readonly kind: "character"; readonly uid: string }
  | { readonly kind: "support"; readonly uid: string }
  | { readonly kind: "leader"; readonly uid: string }
  | null;

/** Two-step DECLARE_ATTACK draft: attacker armed, waiting for a target click. */
export interface AttackDraft {
  readonly attackerUid: string;
  readonly attackerKind: AttackerKind;
  readonly power: number;
  readonly targets: readonly AttackTarget[];
  readonly hoverUid: string | null;
}

export interface BoardKit {
  readonly projection: NarutoProjection;
  readonly interactive: boolean;
  readonly selection: Selection;
  readonly attackDraft: AttackDraft | null;
  /** Click on any card/slot entity on the board. */
  readonly onEntityClick: (uid: string, zone: EntityZoneKind, owner: PlayerId) => void;
  /** Click a contextual action pill. */
  readonly onPill: (pill: ActionPill) => void;
  /** Hover/focus entity (inspector + attack-arrow reticle). */
  readonly onInspect: (
    uid: string | null,
    zone: EntityZoneKind | null,
    owner: PlayerId | null,
  ) => void;
  /** Cancel a cancellable pendingChoice (RESOLVE_CHOICE key=null). */
  readonly onCancelChoice: () => void;
}

/** Pills attached to an entity uid (empty when not interactive). */
export function pillsFor(kit: BoardKit, uid: string): readonly ActionPill[] {
  if (!kit.interactive) return [];
  return kit.projection.pills[uid] ?? [];
}

export function isChoiceTarget(kit: BoardKit, uid: string): boolean {
  const choice = kit.projection.choice;
  return (
    kit.interactive &&
    choice !== null &&
    choice.player === kit.projection.viewer &&
    choice.boardTargetUids.includes(uid)
  );
}

export function isAttackTarget(kit: BoardKit, uid: string): boolean {
  return kit.attackDraft !== null && kit.attackDraft.targets.some((t) => t.uid === uid);
}

export function isSelected(kit: BoardKit, uid: string): boolean {
  return kit.selection !== null && kit.selection.uid === uid;
}
