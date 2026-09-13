import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { flashBoltBlue } from "../../../../../../cards/src/cards/instants/flash-bolt.ts";
import { blackstoneGreaves } from "../../../../../../cards/src/cards/equipment/blackstone-greaves.ts";

function greavesDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.legs.find(
    (id) => state.objects[id]?.canonicalId === blackstoneGreaves.canonicalId,
  );
  if (!instanceId) return undefined;
  return buildFabRulesView(state).object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("blackstone-greaves (PEN096)", () => {
  it("AAA: dealing arcane damage this turn gives +1 defense", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [blackstoneGreaves],
        hand: [flashBoltBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(greavesDefense(game, Bravo.id)).toBe(1);
    Bravo.play(flashBoltBlue, { target: game.as(dash).id });
    game.passBoth();
    game.passBoth();

    expect(game.as(dash).life()).toBe(19);
    expect(greavesDefense(game, Bravo.id)).toBe(2);
  });

  it("boundary: without arcane damage, defense remains one", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [blackstoneGreaves], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(greavesDefense(game, game.as(bravo).id)).toBe(1);
  });
});
