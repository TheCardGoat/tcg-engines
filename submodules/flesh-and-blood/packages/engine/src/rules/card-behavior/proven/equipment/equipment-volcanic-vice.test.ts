import { describe, expect, it } from "vitest";
import { FabTestEngine, buildFabRulesView } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { volcanicVice } from "../../../../../../cards/src/cards/equipment/volcanic-vice.ts";
import { richterScale } from "../../../../../../cards/src/cards/equipment/richter-scale.ts";

function hasSpellvoid(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.arms.find(
    (id) => state.objects[id]?.canonicalId === volcanicVice.canonicalId,
  );
  if (!instanceId) return false;
  const object = buildFabRulesView(state).object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  });
  return object?.current.keywords.some((keyword) => keyword.name === "spellvoid") ?? false;
}

describe("volcanic-vice (PEN018)", () => {
  it("gains Spellvoid 3 after its controller creates a Seismic Surge", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [volcanicVice], chest: [richterScale], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(hasSpellvoid(game, Bravo.id)).toBe(false);
    Bravo.activate(richterScale);
    game.passBoth();

    expect(Bravo.zone("arena").filter((id) => id === "token:seismic-surge")).toHaveLength(2);
    expect(hasSpellvoid(game, Bravo.id)).toBe(true);
  });

  it("does not gain Spellvoid without creating a Seismic Surge", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arms: [volcanicVice], deck: 6 },
      { hero: dash, deck: 6 },
    );

    expect(hasSpellvoid(game, game.as(bravo).id)).toBe(false);
  });
});
