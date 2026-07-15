import {
  asPlayerId,
  type MatchRuntime,
  type MatchStaticResources,
  type PlayerId,
} from "@tcg/gundam-engine";
import { buildGundamInteractionView } from "@tcg/gundam-server-adapter";
import type { InteractionAction } from "@tcg/protocol";

/**
 * Scaffolding helper: auto-pass the opponent through the three step-level
 * pass moves the battle / end phases use — `passBlock`, `passBattleAction`,
 * `passActionStep`. Parallel to `attachAutoMulliganKeep`, with the same
 * scope caveats: single-seat E2E fixtures only. NOT production bot code,
 * NOT a replacement for `PassOnlyBot` once we need opponent decisions
 * beyond "always pass" (declareBlock, activate-while-standby, etc.).
 *
 * Without this, after the viewer declares an attack the opponent sits
 * forever in block-step — the simulator UI has no pass buttons for the
 * opponent seat (there's only one viewer per browser session), so the
 * flow-runner never advances to action-step → damage-step → main-phase.
 *
 * Picks the pass move off the shared interaction protocol view so fixture
 * automation consumes the same availability surface as live clients.
 */
const PASS_MOVE_NAMES = ["passBlock", "passBattleAction", "passActionStep"] as const;
type PassMoveName = (typeof PASS_MOVE_NAMES)[number];
const PASS_MOVE_NAME_SET: ReadonlySet<string> = new Set(PASS_MOVE_NAMES);

export function attachAutoPassBot(
  runtime: MatchRuntime,
  staticResources: MatchStaticResources,
  playerName: string,
): () => void {
  // SSR loader path: the fixture factory runs, the snapshot is
  // captured, and the runtime is discarded. Attaching a subscriber
  // here would either leak (auto-pass doesn't surface a handle for
  // dispose) or fire `tryAutoPass` once on a state that already hit
  // its final pre-snapshot shape. Either way the server gains
  // nothing. Client-side `useClientBot` re-attaches the same bot to
  // the reconstructed runtime post-hydration.
  //
  // Guard on `import.meta.env.SSR` rather than `typeof window ===
  // "undefined"` so Node-based unit tests (no jsdom) can still
  // attach the bot and assert its state-advancement behavior.
  if (import.meta.env.SSR) {
    return () => {};
  }

  const player = asPlayerId(playerName) as PlayerId;

  const tryAutoPass = () => {
    const state = runtime.getState();
    const view = buildGundamInteractionView({
      actorId: player,
      stateVersion: state.ctx._stateID,
      state,
      staticResources,
      pendingChoice: runtime.getPendingChoice({ role: "player", playerId: player }),
    });
    const passMove = view.actions.find(
      (action: InteractionAction): action is InteractionAction & { id: PassMoveName } =>
        action.enabled && PASS_MOVE_NAME_SET.has(action.id),
    )?.id;
    if (!passMove) return;

    runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: passMove,
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      player,
    );
  };

  // Fire immediately in case we're already in a state that needs a pass,
  // then subscribe for every subsequent state update. `onStateUpdate` may
  // re-enter us (our own submit triggers the next listener wave), but the
  // guard above returns early once no pass move is available, so the
  // cascade terminates naturally.
  tryAutoPass();
  return runtime.onStateUpdate(tryAutoPass);
}
