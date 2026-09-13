import { describe, expect, it } from "vitest";
import { FabTestEngine, buildFabRulesView } from "../../../../index.ts";
import { bravo, dash, heartOfFyendal } from "../../../fixtures.ts";
import { skeraStrapping } from "../../../../../../cards/src/cards/equipment/skera-strapping.ts";
import { bareDestructionRed } from "../../../../../../cards/src/cards/actions/bare-destruction.ts";
import { wreckerRompBlue } from "../../../../../../cards/src/cards/actions/wrecker-romp.ts";

function hasSpellvoid(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.arms.find(
    (id) => state.objects[id]?.canonicalId === skeraStrapping.canonicalId,
  );
  if (!instanceId) return false;
  const object = buildFabRulesView(state).object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  });
  return object?.current.keywords.some((keyword) => keyword.name === "spellvoid") ?? false;
}

describe("skera-strapping (PEN004)", () => {
  it("gains Spellvoid 3 after its controller pitches a 6-power card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [skeraStrapping],
        hand: [wreckerRompBlue, bareDestructionRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);

    expect(hasSpellvoid(game, Bravo.id)).toBe(false);
    Bravo.must.pitch(wreckerRompBlue).playAttack(bareDestructionRed);
    game.passBoth();
    expect(game.getState().players[Bravo.id]!.history.turn.pitchedPower6).toBe(true);
    expect(hasSpellvoid(game, Bravo.id)).toBe(true);
  });

  it("does not gain Spellvoid when the pitched card has less than 6 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [skeraStrapping],
        hand: [heartOfFyendal, bareDestructionRed],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false },
    );
    const Bravo = game.as(bravo);

    Bravo.must.pitch(heartOfFyendal).playAttack(bareDestructionRed);
    game.passBoth();
    expect(hasSpellvoid(game, Bravo.id)).toBe(false);
  });
});
