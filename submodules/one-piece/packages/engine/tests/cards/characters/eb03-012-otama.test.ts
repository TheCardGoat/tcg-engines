import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Otama012,
  op01TonyTonyChopper015,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-012 Otama", () => {
  test("rests itself, then maps the Animal-or-SMILE low-cost Character branch", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb03Otama012],
      },
      {
        character: [op01TonyTonyChopper015, eb01Doma005, eb01MountainGod018],
      },
    );
    const otamaId = engine.findCardInZone("south", "character", eb03Otama012);
    const animalId = engine.findCardInZone("north", "character", op01TonyTonyChopper015);
    const wrongTraitId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooExpensiveId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(otamaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const branch = engine.pendingDecision("effectActionChoice", "south").steps[0];
    expect(branch?.kind).toBe("chooseOption");
    if (branch?.kind !== "chooseOption") throw new Error("Expected Otama's rest choice.");
    expect(branch.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Otama's Character target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([animalId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooExpensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [animalId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === otamaId)?.rested).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === animalId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("lets the controller choose how many opposing active DON!! cards to rest", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb03Otama012],
      },
      {
        activeDon: 2,
      },
    );
    const otamaId = engine.findCardInZone("south", "character", eb03Otama012);

    engine.activateEffect(otamaId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "south");

    const count = engine.pendingDecision("effectRestDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Otama's DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "south");

    expect(engine.getView("south").players.north).toMatchObject({
      activeDon: 1,
      restedDon: 1,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
