import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { fabToken } from "../../../../testing/test-fixtures.ts";
import { laughingKneeSlappers } from "../../../../../../cards/src/cards/equipment/laughing-knee-slappers.ts";

function bootsDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.legs.find(
    (id) => state.objects[id]?.canonicalId === laughingKneeSlappers.canonicalId,
  );
  if (!instanceId) return undefined;
  return buildFabRulesView(state).object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("laughing-knee-slappers (SUP065)", () => {
  it("AAA: controlling Might and Vigor gives +2 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        legs: [laughingKneeSlappers],
        arena: [fabToken("might"), fabToken("vigor")],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(bravo);
    expect(bootsDefense(game, Defender.id)).toBe(3);
    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(laughingKneeSlappers);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(19);
    expect(Defender.zone("graveyard")).toContain(laughingKneeSlappers.canonicalId);
  });

  it("boundary: either token alone leaves base defense", () => {
    for (const token of ["might", "vigor"] as const) {
      const game = FabTestEngine.start(
        { hero: bravo, legs: [laughingKneeSlappers], arena: [fabToken(token)], deck: 6 },
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      expect(bootsDefense(game, game.as(bravo).id)).toBe(1);
    }
  });
});
