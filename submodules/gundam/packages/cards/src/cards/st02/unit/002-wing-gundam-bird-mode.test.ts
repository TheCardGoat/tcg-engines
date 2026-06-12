import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, activeResources, expectSuccess } from "@tcg/gundam-engine";
import { st02WingGundamBirdMode002 } from "./002-wing-gundam-bird-mode.ts";

describe("Wing Gundam (Bird Mode) (ST02-002)", () => {
  it("【Deploy】 Place 1 EX Resource — resource area gains a card", () => {
    const engine = GundamTestEngine.create({
      hand: [st02WingGundamBirdMode002],
      resourceArea: activeResources(4),
      deck: 5,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.deployUnit(st02WingGundamBirdMode002));

    // `placeResource` moves the source card into the resource area; the
    // `resourceType: "EX"` field doesn't conjure a new card, it just tags
    // the placement mode. Net result: resourceArea gains one entry.
    expect(p1.getCardsInZone("resourceArea").length).toBe(resourcesBefore + 1);
  });
});
