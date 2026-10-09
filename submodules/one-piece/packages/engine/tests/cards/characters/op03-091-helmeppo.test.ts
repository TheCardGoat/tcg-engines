import { describe, expect, test } from "vite-plus/test";
import {
  op03Camie101,
  op03Corgy083,
  op03Helmeppo091,
  op02Kuzan121,
  eb01Doma005,
  op05SanGorou065,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-091 Helmeppo", () => {
  test.each([op03Camie101, op05SanGorou065])(
    "keeps $id at cost 0 after Kuzan leaves during the same turn",
    (vanilla) => {
      let engine = OnePieceTestEngine.create(
        {
          hand: [op03Helmeppo091, eb01Doma005],
          character: [op02Kuzan121, eb01Doma005, eb01Doma005, eb01Doma005],
          activeDon: 10,
        },
        { character: [vanilla] },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const vanillaId = engine.findCardInZone("north", "character", vanilla);
      const kuzanId = engine.findCardInZone("south", "character", op02Kuzan121);
      engine.playCard(op03Helmeppo091, "south");
      engine.resolveDecision("effectTargetSelection", { selectedIds: [vanillaId] }, "south");
      expect(
        engine
          .getView("south")
          .players.north.characters.find((card) => card?.instanceId === vanillaId)?.cost,
      ).toBe(0);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      engine.playCard(eb01Doma005, "south");
      engine.resolveDecision("playCharacterReplacement", { selectedIds: [kuzanId] }, "south");
      expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
        kuzanId,
      );
      expect(
        engine
          .getView("south")
          .players.north.characters.find((card) => card?.instanceId === vanillaId)?.cost,
      ).toBe(0);
      engine.endTurn("south");
      expect(
        engine
          .getView("south")
          .players.north.characters.find((card) => card?.instanceId === vanillaId)?.cost,
      ).toBe(vanilla.cost);
    },
  );

  test("sets only an opposing Character with no base effect to cost 0 this turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op03Helmeppo091], activeDon: op03Helmeppo091.cost },
      { character: [op03Camie101, op03Corgy083] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const vanillaId = engine.findCardInZone("north", "character", op03Camie101);
    const effectfulId = engine.findCardInZone("north", "character", op03Corgy083);

    engine.playCard(op03Helmeppo091, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Helmeppo's cost target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(vanillaId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(effectfulId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [vanillaId] }, "south");

    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === vanillaId)?.cost,
    ).toBe(0);
    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === vanillaId)?.cost,
    ).toBe(op03Camie101.cost);
  });
});
