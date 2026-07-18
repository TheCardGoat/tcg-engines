import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, op02Koby098, op10KinEmon026, op10Tashigi032 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-032 Tashigi", () => {
  test("may rest itself instead of an opponent effect removing another green Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Tashigi032, op10KinEmon026] },
      { hand: [op02Koby098, eb01Fourtricks025], activeDon: op02Koby098.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const tashigiId = engine.findCardInZone("south", "character", op10Tashigi032);
    const protectedId = engine.findCardInZone("south", "character", op10KinEmon026);

    engine.playCard(op02Koby098, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === tashigiId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
