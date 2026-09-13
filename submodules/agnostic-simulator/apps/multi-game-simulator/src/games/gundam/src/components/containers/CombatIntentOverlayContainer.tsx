import { useLayoutEffect, useMemo, useRef } from "react";
import type { SimulatorCombatEndpoint, SimulatorCombatIntent } from "@tcg/simulator-contract";
import { CombatIntentOverlay, useSimulatorViewportLayout } from "@tcg/simulator-ui";

import { useBoardProjection } from "../../game/index.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import type { BoardProjection } from "../../game/types.ts";
import { projectDirectAttackPresentation } from "./direct-attack-presentation.ts";
import { findCardByInstanceId } from "./mappers.ts";

interface PendingCombatProjection {
  readonly stage: string;
  readonly attackerId: string;
  readonly attackerPlayerId: string;
  readonly target: string;
  readonly blockerId?: string;
}

interface GundamProjectionState {
  readonly turnMetadata?: { readonly pendingCombat?: PendingCombatProjection };
}

const GUNDAM_ENTITY_SELECTOR = (entityId: string) =>
  `[data-sim-entity-id="${cssEscape(entityId)}"]`;
const GUNDAM_PLAYER_SELECTOR = (playerId: string) =>
  `[data-sim-player-target-id="${cssEscape(playerId)}"]`;

export function CombatIntentOverlayContainer() {
  const view = useBoardProjection();
  const draft = useGundamInteractionDraft();
  const intent = useMemo(() => projectGundamCombatIntent(view), [view]);
  const viewportLayout = useSimulatorViewportLayout();
  const revealedMobileCombatRef = useRef(false);
  const combatId = intent?.id;
  const combatPhase = intent?.phase;
  const attackerId = intent?.attackerEntityId;
  const targetKind = intent?.currentTarget.kind;
  const targetId = intent?.currentTarget.id;

  useLayoutEffect(() => {
    if (viewportLayout !== "mobile") {
      revealedMobileCombatRef.current = false;
      return;
    }
    if (draft.active) return;

    if (!targetKind || !targetId) {
      if (!revealedMobileCombatRef.current) return;
      revealedMobileCombatRef.current = false;
      const frame = window.requestAnimationFrame(() => {
        const board = document.querySelector<HTMLElement>(
          ".gundam-simulator-root [data-sim-board]",
        );
        if (board) board.scrollTop = board.scrollHeight - board.clientHeight;
      });
      return () => window.cancelAnimationFrame(frame);
    }

    const frame = window.requestAnimationFrame(() => {
      const board = document.querySelector<HTMLElement>(".gundam-simulator-root [data-sim-board]");
      const targetSelector =
        targetKind === "entity"
          ? GUNDAM_ENTITY_SELECTOR(targetId)
          : targetKind === "player"
            ? GUNDAM_PLAYER_SELECTOR(targetId)
            : null;
      const target = targetSelector
        ? (board?.querySelector<HTMLElement>(targetSelector) ??
          document.querySelector<HTMLElement>(targetSelector))
        : null;
      if (!board || !target) return;
      revealedMobileCombatRef.current = true;

      const boardRect = board.getBoundingClientRect();
      const attacker = attackerId
        ? board.querySelector<HTMLElement>(GUNDAM_ENTITY_SELECTOR(attackerId))
        : null;
      const defendingField =
        targetKind === "player"
          ? target
              .closest<HTMLElement>("[data-seat-side]")
              ?.querySelector<HTMLElement>('[data-seat-row="field"]')
          : null;
      const focusTarget = defendingField ?? target;
      const focusRects = [attacker, focusTarget]
        .filter((element): element is HTMLElement => element !== null)
        .map((element) => element.getBoundingClientRect());
      const focusTop = Math.min(...focusRects.map((rect) => rect.top));
      const focusBottom = Math.max(...focusRects.map((rect) => rect.bottom));
      const focusTopInBoard = focusTop - boardRect.top + board.scrollTop;
      const focusBottomInBoard = focusBottom - boardRect.top + board.scrollTop;
      const minimumScroll = focusBottomInBoard - board.clientHeight + 12;
      const maximumScroll = focusTopInBoard - 12;

      if (minimumScroll <= maximumScroll) {
        board.scrollTop = Math.max(
          0,
          Math.min(maximumScroll, Math.max(minimumScroll, board.scrollTop)),
        );
      } else {
        const targetRect = focusTarget.getBoundingClientRect();
        const visibleTop = boardRect.top + 12;
        const visibleBottom = boardRect.bottom - 12;
        if (targetRect.top < visibleTop) {
          board.scrollTop += targetRect.top - visibleTop;
        } else if (targetRect.bottom > visibleBottom) {
          board.scrollTop += targetRect.bottom - visibleBottom;
        }
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [attackerId, combatId, combatPhase, draft.active, targetId, targetKind, viewportLayout]);

  return (
    <CombatIntentOverlay
      // Board guidance belongs below the timeout panel (30) and battle ribbon (40).
      // Tailwind v4 places the important modifier at the end of a utility.
      className="z-[25]!"
      intent={intent}
      containerSelector=".board-bg"
      labelAvoidSelector='[data-combat-label-obstacle], [data-seat-row="field"] [data-sim-entity-id]'
      entitySelector={GUNDAM_ENTITY_SELECTOR}
      playerSelector={GUNDAM_PLAYER_SELECTOR}
    />
  );
}

export function projectGundamCombatIntent(view: BoardProjection): SimulatorCombatIntent | null {
  const combat = (view.G as GundamProjectionState).turnMetadata?.pendingCombat;
  if (!combat) return null;

  const defenderPlayerId = view.players
    .map((player) => String(player.playerId))
    .find((playerId) => playerId !== combat.attackerPlayerId);
  if (!defenderPlayerId) return null;

  const declaredTarget: SimulatorCombatEndpoint =
    combat.target === "direct"
      ? { kind: "player", id: defenderPlayerId }
      : { kind: "entity", id: combat.target };
  const currentTarget: SimulatorCombatEndpoint = combat.blockerId
    ? { kind: "entity", id: combat.blockerId }
    : declaredTarget;
  const redirected = Boolean(combat.blockerId);
  const resolving = combat.stage === "damage-step" || combat.stage === "battle-end";
  const attackerName = cardName(view, combat.attackerId, "Attacking Unit");
  const directPresentation = projectDirectAttackPresentation(view, defenderPlayerId);
  const declaredTargetName =
    combat.target === "direct"
      ? directPresentation.targetDescription
      : cardName(view, combat.target, "target Unit");
  const blockerName = combat.blockerId ? cardName(view, combat.blockerId, "Blocker") : null;

  return {
    id: `gundam-combat:${combat.attackerId}`,
    attackerEntityId: combat.attackerId,
    declaredTarget,
    currentTarget,
    phase: redirected ? "redirected" : resolving ? "resolving" : "declared",
    attackKind: combat.target === "direct" ? "direct" : "fight",
    declaredTargetLabel: redirected
      ? combat.target === "direct"
        ? directPresentation.protectedLabel
        : `Protected · ${declaredTargetName}`
      : combat.target === "direct"
        ? directPresentation.badgeLabel
        : `Target · ${declaredTargetName}`,
    ...(redirected && blockerName ? { currentTargetLabel: "Attacks blocker" } : {}),
    ariaLabel:
      redirected && blockerName
        ? `${attackerName} attacked ${declaredTargetName}. ${blockerName} blocks; the original target is protected.`
        : `${attackerName} attacks ${declaredTargetName}.`,
  };
}

function cardName(view: BoardProjection, cardId: string, fallback: string): string {
  return findCardByInstanceId(view, cardId)?.definition?.name ?? fallback;
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/["\\\n\r\f]/g, (character) => `\\${character}`);
}
