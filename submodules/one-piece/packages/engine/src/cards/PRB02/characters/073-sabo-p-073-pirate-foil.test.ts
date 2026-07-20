import { eb01Doma005, eb01Fourtricks025 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb02SaboP073PirateFoil073 } from "../../../../../cards/src/cards/PRB02/characters/073-sabo-p-073-pirate-foil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-073 Sabo - P-073 (Pirate Foil)", () => {
  test("takes the selected end of Life, gains power for the turn, and cannot activate twice", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02SaboP073PirateFoil073],
      life: [eb01Doma005, eb01Fourtricks025],
      deck: [eb01Doma005, eb01Fourtricks025],
    });
    const saboId = engine.findCardInZone("south", "character", prb02SaboP073PirateFoil073);
    const bottomLifeId = engine.getState().players.south.life.at(-1)!;

    engine.activateEffect(saboId, "activateMain", "south");
    expect(engine.pendingDecision("effectOptional", "south").actorId).toBe("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostAddLifeToHand", "south").steps[0];
    if (cost?.kind !== "chooseOption") throw new Error("Expected Sabo's Life-end choice.");
    expect(cost.options.map((option) => option.id)).toEqual(["top", "bottom"]);
    engine.resolveDecision("effectCostAddLifeToHand", { optionId: "bottom" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(bottomLifeId);
    expect(view.players.south.lifeCount).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === saboId)?.power).toBe(
      (prb02SaboP073PirateFoil073.power ?? 0) + 1000,
    );
    expect(view.prompts).toHaveLength(0);
    expect(() => engine.activateEffect(saboId, "activateMain", "south")).toThrow(
      "This effect has already been used this turn.",
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === saboId)?.power).toBe(
      prb02SaboP073PirateFoil073.power,
    );
  });

  test("may decline without moving Life, gaining power, or leaving an unresolved prompt", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02SaboP073PirateFoil073],
      life: [eb01Doma005, eb01Fourtricks025],
    });
    const saboId = engine.findCardInZone("south", "character", prb02SaboP073PirateFoil073);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.activateEffect(saboId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(view.players.south.characters.find((card) => card?.instanceId === saboId)?.power).toBe(
      prb02SaboP073PirateFoil073.power,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("cannot activate without a Life card to pay the printed cost", () => {
    const engine = OnePieceTestEngine.create({
      character: [prb02SaboP073PirateFoil073],
      life: 0,
    });
    const saboId = engine.findCardInZone("south", "character", prb02SaboP073PirateFoil073);

    expect(() => engine.activateEffect(saboId, "activateMain", "south")).toThrow();
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === saboId)
        ?.power,
    ).toBe(prb02SaboP073PirateFoil073.power);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
