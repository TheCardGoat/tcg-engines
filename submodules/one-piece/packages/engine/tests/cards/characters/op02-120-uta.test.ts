import { describe, expect, test } from "vite-plus/test";
import { op02Tashigi105, op02Uta120 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-120 Uta", () => {
  test("may return two DON!! to buff its Leader and all Characters until its next turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op02Uta120],
        character: [op02Tashigi105],
        activeDon: 10,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const existingCharacterId = engine.findCardInZone("south", "character", op02Tashigi105);
    const leaderPowerBefore = engine.getView("south").players.south.leader.power;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;
    if (leaderPowerBefore === null) throw new Error("Expected the Leader to have power.");

    engine.playCard(op02Uta120, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const donCost = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(donCost?.kind).toBe("payCost");
    if (donCost?.kind !== "payCost") throw new Error("Expected Uta's DON!! -2 cost.");
    const returnedDonIds = donCost.candidates.slice(0, 2).map((candidate) => candidate.ref.id);
    expect(returnedDonIds).toHaveLength(2);
    engine.resolveDecision("effectCostReturnDon", { selectedIds: returnedDonIds }, "south");

    const utaId = engine.findCardInZone("south", "character", op02Uta120);
    let view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 2);
    expect(view.players.south.leader.power).toBe(leaderPowerBefore + 1000);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === existingCharacterId)?.power,
    ).toBe(6000);
    expect(view.players.south.characters.find((card) => card?.instanceId === utaId)?.power).toBe(
      9000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(leaderPowerBefore + 1000);
    expect(view.players.south.characters.find((card) => card?.instanceId === utaId)?.power).toBe(
      9000,
    );

    engine.endTurn("north");
    view = engine.getView("south");
    expect(view.players.south.leader.power).toBe(leaderPowerBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === existingCharacterId)?.power,
    ).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === utaId)?.power).toBe(
      8000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without returning DON!! or granting power", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Uta120], character: [op02Tashigi105], activeDon: op02Uta120.cost },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const existingCharacterId = engine.findCardInZone("south", "character", op02Tashigi105);
    const leaderPowerBefore = engine.getView("south").players.south.leader.power;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op02Uta120, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const utaId = engine.findCardInZone("south", "character", op02Uta120);
    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore);
    expect(view.players.south.leader.power).toBe(leaderPowerBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === existingCharacterId)?.power,
    ).toBe(5000);
    expect(view.players.south.characters.find((card) => card?.instanceId === utaId)?.power).toBe(
      8000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
