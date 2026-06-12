import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";

const card = alphaSwordwiseHuscle; // unit, cost 3, power 5, no abilities

describe("Swordwise Huscle", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: card, spent: false }],
      });
      expectAttackCandidate(engine, card);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: card, spent: true }],
      });
      expectNotAttackCandidate(engine, card);
    });
  });

  it("definition matches expected stats", () => {
    expect(card.type).toBe("unit");
    expect(card.cost).toBe(3);
    expect(card.power).toBe(5);
    expect(card.abilities).toEqual([]);
  });

  it("can be played from hand to field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [card],
      eddies: card.cost,
    });

    engine.playCard(card);

    const field = engine.getCardsInZone("field", P1);
    expect(field.some((c) => c.definitionId === card.id)).toBe(true);
  });
});
