import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { alphaEmergencyAtlus } from "@tcg/cyberpunk-cards";

const card = alphaEmergencyAtlus; // unit, cost 4, power 7, no abilities

describe("Emergency Atlus", () => {
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
    expect(card.cost).toBe(4);
    expect(card.power).toBe(7);
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
