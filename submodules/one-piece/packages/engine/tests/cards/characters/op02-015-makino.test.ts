import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op02Makino015 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-015 Makino", () => {
  test("may rest itself to give only a red cost-1 Character +3000 until turn end", () => {
    const engine = OnePieceTestEngine.create({
      character: [
        { card: op02Makino015, playedOnTurn: 0 },
        { card: eb01Doma005, playedOnTurn: 0 },
        { card: eb01Fourtricks025, playedOnTurn: 0 },
      ],
    });
    const makinoId = engine.findCardInZone("south", "character", op02Makino015);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);
    const fourtricksId = engine.findCardInZone("south", "character", eb01Fourtricks025);

    engine.activateEffect(makinoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Makino's power target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(domaId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(fourtricksId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [domaId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === makinoId)
        ?.rested,
    ).toBe(true);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === domaId)
        ?.power,
    ).toBe(6000);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === domaId)
        ?.power,
    ).toBe(3000);
  });

  test("may decline the rest cost without changing its target's power", () => {
    const engine = OnePieceTestEngine.create({
      character: [
        { card: op02Makino015, playedOnTurn: 0 },
        { card: eb01Doma005, playedOnTurn: 0 },
      ],
    });
    const makinoId = engine.findCardInZone("south", "character", op02Makino015);
    const domaId = engine.findCardInZone("south", "character", eb01Doma005);

    engine.activateEffect(makinoId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === makinoId)?.rested,
    ).toBe(false);
    expect(view.players.south.characters.find((card) => card?.instanceId === domaId)?.power).toBe(
      3000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
