import { asPlayerId } from "@tcg/gundam-engine";

import { createDevRuntime, DEV_PLAYER_ONE, type DevRuntime } from "../dev-runtime.ts";

/**
 * Lands directly on Player One's real alter-hand decision with five visible
 * opening cards. Player Two remains pending after the redraw so the fixture
 * can settle on the replacement hand without immediately cascading into the
 * Shield, EX Base, EX Resource, and first-turn draw setup sequence.
 */
export function loadMulliganAnimationDemo(): DevRuntime {
  const dev = createDevRuntime({
    p1: { deck: 30, resourceDeck: 10 },
    p2: { deck: 30, resourceDeck: 10 },
    seed: "mulligan-animation-demo-0",
  });
  const state = dev.runtime.getState();
  const result = dev.runtime.executeCommand(
    {
      commandID: "fixture:mulligan-animation-demo:choose-first-player",
      move: "chooseFirstPlayer",
      prevStateID: state.ctx._stateID,
      actorRole: "player",
      args: { playerId: DEV_PLAYER_ONE },
    },
    asPlayerId(DEV_PLAYER_ONE),
  );

  if (!result.success) {
    throw new Error(`Could not prepare mulligan animation fixture: ${result.error}`);
  }

  return dev;
}
