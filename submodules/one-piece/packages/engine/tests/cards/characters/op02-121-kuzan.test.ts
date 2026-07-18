import { describe, expect, test } from "vite-plus/test";
import { op02Hina110, op02Kuzan121, op02MonkeyDLuffy041 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-121 Kuzan", () => {
  test("during its controller's turn gives all opposing Characters -5 cost and no own Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02Kuzan121] },
      { character: [op02Hina110, op02MonkeyDLuffy041] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const kuzanId = engine.findCardInZone("south", "character", op02Kuzan121);
    const costFiveId = engine.findCardInZone("north", "character", op02Hina110);
    const costSevenId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);

    let view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === kuzanId)?.cost).toBe(
      10,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.cost,
    ).toBe(0);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costSevenId)?.cost,
    ).toBe(2);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.cost,
    ).toBe(5);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costSevenId)?.cost,
    ).toBe(7);

    engine.endTurn("north");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costFiveId)?.cost,
    ).toBe(0);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costSevenId)?.cost,
    ).toBe(2);
  });

  test("applies its cost reduction before the On Play cost-0 K.O. choice", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Kuzan121], activeDon: op02Kuzan121.cost },
      { character: [op02Hina110, op02MonkeyDLuffy041] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const costFiveId = engine.findCardInZone("north", "character", op02Hina110);
    const costSevenId = engine.findCardInZone("north", "character", op02MonkeyDLuffy041);

    engine.playCard(op02Kuzan121, "south");
    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Kuzan's cost-0 K.O. target.");
    expect(ko.candidates.map((candidate) => candidate.ref.id)).toEqual([costFiveId]);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(costSevenId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [costFiveId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(costFiveId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === costSevenId)?.cost,
    ).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });

  test("may choose no cost-0 Character after applying its reduction", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op02Kuzan121], activeDon: op02Kuzan121.cost },
      { character: [op02Hina110] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", op02Hina110);

    engine.playCard(op02Kuzan121, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.some((card) => card?.instanceId === targetId)).toBe(true);
    expect(view.players.north.characters.find((card) => card?.instanceId === targetId)?.cost).toBe(
      0,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
