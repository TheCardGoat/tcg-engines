import {
  asPlayerId,
  type MatchRuntime,
  type MatchStaticResources,
  type PlayerId,
} from "@tcg/gundam-engine";
import { buildGundamInteractionView } from "@tcg/gundam-server-adapter";
import type { InteractionAction } from "@tcg/protocol";

const PASS_TURN_MOVE = "passTurn";

/**
 * Scaffolding helper: auto-submits `passTurn` for a given player whenever
 * they're the active player in a turn-level pass-eligible state. Mirror of
 * `attachAutoPassBot`, but for the turn boundary rather than step-level
 * battle passes — used by multi-turn fixtures where the viewer's turn hands
 * off to an opponent that has no UI seat to end their own turn.
 *
 * Same scope caveat as the step-level bot: single-seat E2E fixtures only.
 * NOT a production bot; does not reason about which moves are actually
 * *worth* making before conceding the turn. Once we need opponent actions
 * (deploy, attack, activate) during their turn, replace with a real bot.
 *
 * Self-terminates because `passTurn` flips control to the other player:
 * on the next `onStateUpdate` tick `activePlayer` no longer matches
 * `player` and the guard returns early. If the engine re-enters this
 * player's turn later (normal turn cycling), the bot fires again and
 * passes immediately, which is exactly what the fixture wants.
 */
export function attachAutoPassTurnBot(
  runtime: MatchRuntime,
  staticResources: MatchStaticResources,
  playerName: string,
): () => void {
  // SSR loader: bot attach is pointless — the runtime is discarded
  // after snapshot capture, and `tryAutoPassTurn` only fires when
  // the bot's seat becomes active, which never happens server-side
  // within a single loader run. Mirrors `auto-pass.ts`. Guarded on
  // `import.meta.env.SSR` so Node-based tests can still attach.
  if (import.meta.env.SSR) {
    return () => {};
  }

  const player = asPlayerId(playerName) as PlayerId;

  const tryAutoPassTurn = () => {
    const state = runtime.getState();

    // Only act when this bot's player is the active seat. Without this
    // guard the bot could race and submit on the viewer's behalf after
    // a turn handoff, spiralling the game forward on its own.
    if (state.ctx.status.activePlayer !== player) return;

    // `passTurn` rejects during pending combat (see pass-turn.ts
    // validate); bail early rather than submit and trigger a noisy
    // STALE_STATE / validation error.
    const g = state.G as { turnMetadata?: { pendingCombat?: unknown } };
    if (g.turnMetadata?.pendingCombat) return;

    // If a pending decision exists for someone other than this player,
    // passTurn would be invalid — priority belongs elsewhere. When the
    // pending decision is only this player's own, the engine-enumerated
    // moves list still gates whether passTurn is legal right now.
    const pending = state.ctx.status.pendingDecision ?? [];
    if (pending.some((p) => p !== player)) return;

    // Defer to the shared interaction protocol view for legality — the
    // move must be surfaced to clients as enabled before this fixture
    // submits it. If other actions are also available, this bot still
    // prefers passTurn because its job is exactly "end your turn asap".
    const view = buildGundamInteractionView({
      actorId: player,
      stateVersion: state.ctx._stateID,
      state,
      staticResources,
      pendingChoice: runtime.getPendingChoice({ role: "player", playerId: player }),
    });
    const canPassTurn = view.actions.some(
      (action: InteractionAction) => action.enabled && action.id === PASS_TURN_MOVE,
    );
    if (!canPassTurn) return;

    runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: PASS_TURN_MOVE,
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      player,
    );
  };

  // Check immediately in case we're installed when the bot's player is
  // already active, then subscribe for subsequent transitions. The
  // activePlayer guard keeps the cascade from looping forever.
  tryAutoPassTurn();
  return runtime.onStateUpdate(tryAutoPassTurn);
}
