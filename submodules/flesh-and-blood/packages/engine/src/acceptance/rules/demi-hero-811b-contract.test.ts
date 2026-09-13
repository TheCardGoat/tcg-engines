import { describe, expect, it } from "vitest";
import { toFabCardDefinition } from "../../cards.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import type { FabMatchState } from "../../state.ts";
import type { ProposedEvent } from "../../rules/events.ts";
import { reduceFabGameEvent } from "../../kernel/event-reducer.ts";
import { commitProposedEventBatch } from "../../kernel/transaction-kernel.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { arakniBlackWidow } from "../../../../cards/src/cards/demi-heroes/arakni-black-widow.ts";

const PLAYER = "p1";
const OPPONENT = "p2";
const DEMI = "demi-instance";
const PROCESS = "process-1";

/**
 * CR 8.1.11b: a Demi-Hero that enters the arena is cleared when its controller
 * already controls a hero (the engine always seats a hero, so the promote
 * branch is unreachable in normal play). Demi-Heroes are not a playable type,
 * so this test dispatches a synthetic `enter-arena` event (the same plumbing a
 * resolving Demi-Hero layer would produce) through the production reducer.
 */
describe("CR 8.1.11b Demi-Hero resolution", () => {
  function stateWithDemiOnStack(): FabMatchState {
    const demiDef = toFabCardDefinition(arakniBlackWidow);
    const state = FabTestEngine.createStateForRulesTest({
      seed: "demi-hero-811b",
      player1Id: PLAYER,
      player2Id: OPPONENT,
      heroes: { [PLAYER]: bravo.canonicalId, [OPPONENT]: dash.canonicalId },
      cardDefinitions: {
        [bravo.canonicalId]: toFabCardDefinition(bravo),
        [dash.canonicalId]: toFabCardDefinition(dash),
        [demiDef.canonicalId]: demiDef,
      },
      cardsMaps: {
        canonicalIdsByInstance: { [DEMI]: demiDef.canonicalId },
        owners: { [PLAYER]: [DEMI], [OPPONENT]: [] },
      },
    });
    // Place the demi-hero instance on the stack (its default seed zone is hand).
    const hand = state.containers.zonesByPlayerId[PLAYER]!.hand;
    const idx = hand.indexOf(DEMI);
    if (idx >= 0) hand.splice(idx, 1);
    state.containers.zonesByPlayerId[PLAYER]!.stack = [DEMI];
    return state;
  }

  it("8.1.11b: a Demi-Hero entering the arena is cleared when the controller has a hero", () => {
    const state = stateWithDemiOnStack();
    // Sanity: the controller has a hero seated.
    expect(state.containers.zonesByPlayerId[PLAYER]!.heroZone.length).toBeGreaterThan(0);

    const source = snapshotObject(state, DEMI, PLAYER, "stack");
    const event: ProposedEvent = {
      name: "enter-arena",
      processId: PROCESS,
      cause: { kind: "rule", rule: "test", controllerId: PLAYER },
      controllerId: PLAYER,
      source,
      affected: [source],
      bindings: {},
      data: {
        object: source,
        destinationRef: null,
        from: "stack",
        to: "permanent",
        reason: "resolve",
      },
    };
    const result = commitProposedEventBatch(state, [event], reduceFabGameEvent).state;

    // The demi-hero was cleared to the graveyard; it did not remain in the arena
    // and was not promoted to the hero zone.
    expect(result.containers.zonesByPlayerId[PLAYER]!.graveyard).toContain(DEMI);
    expect(result.containers.zonesByPlayerId[PLAYER]!.arena).not.toContain(DEMI);
  });
});
