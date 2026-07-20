import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op01TrafalgarLaw002, op02Sanji026 } from "@tcg/op-cards";
import { prb02JewelryBonneyP085PirateFoil085 } from "../../../../../cards/src/cards/PRB02/characters/085-jewelry-bonney-p-085-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-085 Jewelry Bonney - P-085 (Pirate Foil)", () => {
  test("with an included Supernovas Leader and no more Life may put an opposing low-cost Character face-up at either Life position", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01TrafalgarLaw002,
        hand: [prb02JewelryBonneyP085PirateFoil085],
        life: [eb01Doma005, eb01Doma005, eb01Doma005],
        deck: [eb01Doma005, eb01MountainGod018],
        activeDon: prb02JewelryBonneyP085PirateFoil085.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const northLifeBefore = engine.getView("south").players.north.lifeCount;

    engine.playCard(prb02JewelryBonneyP085PirateFoil085, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Bonney's opposing target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([lowCostId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [lowCostId] }, "south");

    const position = engine.pendingDecision("effectLifePosition", "south").steps[0];
    if (position?.kind !== "chooseOption")
      throw new Error("Expected Bonney's Life position choice.");
    expect(position.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectLifePosition", { optionId: "bottom" }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(lowCostId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(highCostId);
    expect(view.players.north.lifeCount).toBe(northLifeBefore + 1);
    expect(engine.getState().players.north.life.at(-1)).toBe(lowCostId);
    expect(engine.getState().cards[lowCostId]?.faceUp).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not offer the effect when the Leader lacks Supernovas", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op02Sanji026,
        hand: [prb02JewelryBonneyP085PirateFoil085],
        life: [eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: prb02JewelryBonneyP085PirateFoil085.cost,
      },
      { character: [eb01Doma005] },
    );

    engine.playCard(prb02JewelryBonneyP085PirateFoil085, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("does not offer the effect when its controller has more Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op01TrafalgarLaw002,
        hand: [prb02JewelryBonneyP085PirateFoil085],
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        activeDon: prb02JewelryBonneyP085PirateFoil085.cost,
      },
      {
        life: [eb01Doma005],
        deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [eb01Doma005],
      },
    );

    engine.playCard(prb02JewelryBonneyP085PirateFoil085, "south");
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
