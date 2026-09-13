import { describe, expect, it } from "vite-plus/test";
import { activeResources, expectSuccess, GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { gd05ReGzBws023 } from "./023-re-gz-bws.ts";

describe("Re-GZ BWS (GD05-023)", () => {
  /** @behavioral-proof complete: Deploy timing and the exact active EX Resource result are public. */
  it("【Deploy】 places exactly 1 active EX Resource", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05ReGzBws023],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getCardsInZone("resourceArea");
    const cardId = p1.getHand()[0]!;

    expectSuccess(p1.deployUnit(cardId));

    expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    const placed = p1.getCardsInZone("resourceArea").filter((id) => !resourcesBefore.includes(id));
    expect(placed).toHaveLength(1);
    expect(p1.isExhausted(placed[0]!)).toBe(false);
  });
});
