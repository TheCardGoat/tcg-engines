import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, markAsLinkUnit } from "@tcg/gundam-engine";
import { gd02GundamX056 } from "./056-gundam-x.ts";

describe("Gundam X (GD02-056)", () => {
  it("【During Pair·(Vulture) Pilot】【Destroyed】 retrieves a Lv.5+ Vulture from trash", () => {
    // Vulture unit with level >= 5 in trash to be retrieved.
    const vultureLv5: import("@tcg/gundam-types").UnitCard = {
      cardNumber: "TEST-VULTURE-5",
      name: "Vulture Retrieval Target",
      type: "unit",
      color: "purple",
      traits: ["vulture"],
      level: 5,
      cost: 3,
      ap: 4,
      hp: 4,
      keywordEffects: [],
      rarity: "common",
    };

    const engine = GundamTestEngine.create({
      play: [gd02GundamX056],
      trash: [vultureLv5],
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const gundamXId = p1.getCardsInZone("battleArea")[0]!;

    // Pair with a pilot that has the "vulture" trait.
    markAsLinkUnit(engine, gundamXId, { pilotTraits: ["vulture"] });

    // Confirm pair is established.
    expect(engine.getG().pilotAssignments[gundamXId]).toBeDefined();

    // Destroy the unit to trigger 【Destroyed】.
    const trashBefore = p1.getCardsInZone("trash");
    const vultureInTrash = trashBefore[0]!;

    engine.destroyUnit(gundamXId);

    // The Vulture Lv.5+ card should have moved from trash to hand.
    expect(p1.getHand()).toContain(vultureInTrash);
  });
});
