import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op02ArabesqueBrickFist067, op02Hydra090 } from "@tcg/op-cards";
import { op12Sanji070 } from "../../../../../cards/src/cards/OP12/characters/070-sanji.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-070 Sanji", () => {
  test("gains 1000 power for each complete group of five Events in trash", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12Sanji070],
      hand: [op02Hydra090],
      trash: [op02Hydra090, op02Hydra090, op02Hydra090, op02Hydra090, eb01Doma005],
      activeDon: 2,
    });
    const sanjiId = engine.findCardInZone("south", "character", op12Sanji070);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.power,
    ).toBe(op12Sanji070.power);

    engine.playCard(op02Hydra090, "south");
    const returnDon = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    if (returnDon?.kind !== "payCost") throw new Error("Expected Hydra's DON!! return cost.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [returnDon.candidates[0]!.ref.id] },
      "south",
    );

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === sanjiId)
        ?.power,
    ).toBe((op12Sanji070.power ?? 0) + 1000);
  });

  test("may return one DON!! instead of an opponent effect removing itself", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Sanji070], activeDon: 1 },
      { hand: [op02ArabesqueBrickFist067], activeDon: op02ArabesqueBrickFist067.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const sanjiId = engine.findCardInZone("south", "character", op12Sanji070);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sanjiId] }, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(sanjiId);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
