import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { basaltBoots } from "../../../../../../cards/src/cards/equipment/basalt-boots.ts";

function bootsDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.legs.find(
    (id) => state.objects[id]?.canonicalId === basaltBoots.canonicalId,
  );
  if (!instanceId) return undefined;
  return buildFabRulesView(state).object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("basalt-boots (PEN019)", () => {
  it("AAA: controlling a Seismic Surge token gives +1 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, legs: [basaltBoots], arena: [fabToken("seismic-surge")], life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Defender = game.as(bravo);
    expect(bootsDefense(game, Defender.id)).toBe(2);
    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(basaltBoots);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(18);
    expect(Defender.zone("legs")).toContain(basaltBoots.canonicalId);
  });

  it("boundary: without Seismic Surge, defense remains one", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [basaltBoots], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(bootsDefense(game, game.as(bravo).id)).toBe(1);
  });
});
