import { getContext, setContext } from "svelte";
import type { GatewayClientStore } from "@/features/gateway/gateway-client.svelte.js";
import { trackEvent } from "$lib/analytics/analytics.js";

/**
 * Manual Mode (Board State Correction) — UI-side state and dispatch.
 *
 * The mode is enabled via a bilateral proposal (see `proposal.ts` server
 * handler). Once on, the simulator reveals lore +/- controls and a
 * per-card correction menu that issue `manualSetLore`, `manualSetDamage`,
 * and `manualMoveCard` engine moves directly via the gateway WS — server
 * gates them on the per-game manual-mode flag.
 *
 * The state is exposed as a Svelte 5 `$state`-driven object behind a
 * context so deeply nested board components can react without prop
 * drilling.
 */
export interface ManualModeController {
  readonly enabled: boolean;
  setEnabled: (value: boolean) => void;
  requestEnable: () => void;
  requestDisable: () => void;
  setLore: (playerId: string, amount: number) => void;
  setDamage: (cardId: string, damage: number) => void;
  moveCard: (cardId: string, targetZoneId: string, position?: "top" | "bottom" | number) => void;
}

interface CreateOptions {
  gameId: string;
  getGateway: () => GatewayClientStore | null;
  getExpectedVersion: () => number;
  /**
   * Notified after a proposal is sent so the host can paint a
   * sender-side "Awaiting opponent…" banner. The server still owns the
   * authoritative deadline; we estimate it locally so the banner can
   * show immediately, and let it get refined when the server pushes
   * confirmation/rehydrates on rejoin.
   */
  onProposalSent?: (info: {
    intent: "enable_manual_mode" | "disable_manual_mode";
    estimatedDeadline: number;
  }) => void;
}

/** Optimistic local deadline matching server `PROPOSAL_DEADLINE_MS`. */
const PROPOSAL_DEADLINE_MS = 15_000;

const CONTEXT_KEY = Symbol("lorcana.manual-mode");

export function createManualModeController(opts: CreateOptions): ManualModeController {
  let enabled = $state(false);

  const sendExecuteMove = (
    moveType: "manualSetLore" | "manualSetDamage" | "manualMoveCard",
    payload: Record<string, unknown>,
  ): void => {
    const gateway = opts.getGateway();
    if (!gateway) return;
    gateway.send({
      type: "execute_move",
      gameId: opts.gameId,
      expectedVersion: opts.getExpectedVersion(),
      moveType,
      payload,
    });
  };

  const sendProposal = (actionType: "enable_manual_mode" | "disable_manual_mode"): void => {
    const gateway = opts.getGateway();
    if (!gateway) return;
    gateway.send({
      type: "proposal_send",
      gameId: opts.gameId,
      actionType,
    });
    // Disable is unilateral on the server — no bilateral handshake, so
    // we don't show the "Awaiting opponent…" banner for it. Only the
    // enable path needs the optimistic banner.
    if (actionType === "enable_manual_mode") {
      opts.onProposalSent?.({
        intent: actionType,
        estimatedDeadline: Date.now() + PROPOSAL_DEADLINE_MS,
      });
    }
  };

  return {
    get enabled() {
      return enabled;
    },
    setEnabled(value: boolean): void {
      enabled = value;
    },
    requestEnable(): void {
      sendProposal("enable_manual_mode");
      trackEvent("manual_mode_requested", {
        game_id: opts.gameId,
        role: "sender",
        intent: "enable",
      });
    },
    requestDisable(): void {
      sendProposal("disable_manual_mode");
      trackEvent("manual_mode_requested", {
        game_id: opts.gameId,
        role: "sender",
        intent: "disable",
      });
    },
    setLore(playerId, amount): void {
      sendExecuteMove("manualSetLore", { playerId, amount: Math.max(0, amount) });
      trackEvent("manual_mode_correction_applied", { game_id: opts.gameId, kind: "lore" });
    },
    setDamage(cardId, damage): void {
      sendExecuteMove("manualSetDamage", { cardId, damage: Math.max(0, damage) });
      trackEvent("manual_mode_correction_applied", { game_id: opts.gameId, kind: "damage" });
    },
    moveCard(cardId, targetZoneId, position): void {
      sendExecuteMove("manualMoveCard", {
        cardId,
        targetZoneId,
        ...(position !== undefined ? { position } : {}),
      });
      trackEvent("manual_mode_correction_applied", { game_id: opts.gameId, kind: "move" });
    },
  };
}

export function setManualModeContext(controller: ManualModeController): void {
  setContext(CONTEXT_KEY, controller);
}

export function getManualModeContext(): ManualModeController | null {
  return getContext<ManualModeController | null>(CONTEXT_KEY) ?? null;
}
