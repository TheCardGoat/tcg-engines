/**
 * Shared board-tree types: the interaction state owned by NarutoBoard and
 * the "kit" prop bundle threaded through DesktopBoard/MobileBoard/SeatHalf.
 */

import type { AttackerKind, PlayerId } from "@tcg-engines/naruto-engine";
import {
  resolveCardInteractionState,
  type CardInteractionAction,
  type CardInteractionState,
} from "@tcg/simulator-ui";

import type { ActionPill, AttackTarget } from "../projection/interactions.ts";
import type { NarutoProjection } from "../projection/projectSimulator.ts";

export type EntityZoneKind =
  | "hand"
  | "character"
  | "support"
  | "leader"
  | "summon"
  | "trash"
  | "deck";

export type Selection =
  | { readonly kind: "hand"; readonly uid: string }
  | { readonly kind: "character"; readonly uid: string }
  | { readonly kind: "support"; readonly uid: string }
  | { readonly kind: "leader"; readonly uid: string }
  | { readonly kind: "summon"; readonly uid: string }
  | null;

export type NarutoDropTarget = "battler" | "support" | "play-support";

/** A legal hand-card deployment currently being dragged across the board. */
export interface NarutoDrag {
  readonly handUid: string;
  /** A card can legally support both deployment outcomes. */
  readonly targets: readonly NarutoDropTarget[];
}

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
  readonly dragging: NarutoDrag | null;
  /** Click on any card/slot entity on the board. */
  readonly onEntityClick: (uid: string, zone: EntityZoneKind, owner: PlayerId) => void;
  /** Click a contextual action pill. */
  readonly onPill: (pill: ActionPill) => void;
  /** Open the selected card's readable detail sheet without changing its action state. */
  readonly onOpenDetails: () => void;
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

export function cardActionsFor(kit: BoardKit, uid: string): readonly CardInteractionAction[] {
  return pillsFor(kit, uid).map((pill) => ({
    id: pill.id,
    sourceEntityIds: [uid],
    label: pill.label,
    ...(pill.enabled ? {} : { disabledReason: pill.reason ?? "Unavailable" }),
  }));
}

export function cardInteractionStateFor(kit: BoardKit, uid: string): CardInteractionState {
  const targetable = isChoiceTarget(kit, uid) || isAttackTarget(kit, uid);
  return resolveCardInteractionState({
    entityId: uid,
    actions: cardActionsFor(kit, uid),
    selectedEntityId: kit.selection?.uid,
    targetableEntityIds: targetable ? new Set([uid]) : undefined,
  });
}

/** Legal board destinations for a hand card's deployment actions. */
export function dragTargetsFor(pills: readonly ActionPill[]): readonly NarutoDropTarget[] {
  const targets: NarutoDropTarget[] = [];
  if (pills.some((pill) => pill.enabled && pill.intent.kind === "summon")) {
    targets.push("battler");
  }
  if (pills.some((pill) => pill.enabled && pill.intent.kind === "set-support")) {
    targets.push("support");
  }
  if (pills.some((pill) => pill.enabled && pill.intent.kind === "activate-support-hand")) {
    targets.push("play-support");
  }
  return targets;
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
