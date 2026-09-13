import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { silverstrideDodgers } from "../../../../../../cards/src/cards/equipment/silverstride-dodgers.ts";
import { flurry } from "../../../../../../cards/src/cards/tokens/flurry.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

function dodgersDefense(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.legs.find(
    (id) => state.objects[id]?.canonicalId === silverstrideDodgers.canonicalId,
  );
  if (!instanceId) throw new Error("Silverstride Dodgers is not in the legs zone");
  const view = buildFabRulesView(state);
  return (
    view.object({
      instanceId,
      incarnation: state.objects[instanceId]!.incarnation,
    })?.current.numeric.defense ?? 0
  );
}

describe("silverstride-dodgers (AHA006)", () => {
  it("core mechanic: a controlled Flurry token grants +1 defense", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [silverstrideDodgers],
        arena: [flurry],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    expect(dodgersDefense(game, game.as(bravo).id)).toBe(2);
    expect(game.as(bravo).zone("arena")).toContain(flurry.canonicalId);
  });

  it("boundary: without a Flurry token, defense stays at the printed 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [silverstrideDodgers],
        arena: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );

    expect(dodgersDefense(game, game.as(bravo).id)).toBe(1);
  });

  it("boundary: Temper keeps Dodgers equipped after the first defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      { hero: bravo, legs: [silverstrideDodgers], arena: [flurry], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(silverstrideDodgers);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("legs")).toContain(silverstrideDodgers.canonicalId);
    expect(
      game.objectState(Bravo.findCardInZone("legs", silverstrideDodgers))?.defenseCounterTotal,
    ).toBe(-1);
  });
});
