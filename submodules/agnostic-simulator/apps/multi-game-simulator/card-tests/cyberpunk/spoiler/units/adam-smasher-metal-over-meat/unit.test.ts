import { describe, it, expect } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import { spoilerAdamSmasherMetalOverMeat } from "@tcg/cyberpunk-cards";
import { alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";
import { alphaSwordwiseHuscle } from "@tcg/cyberpunk-cards";
import { alphaArmoredMinotaur } from "@tcg/cyberpunk-cards";
import { alphaCorpoSecurity } from "@tcg/cyberpunk-cards";

const adamSmasher = spoilerAdamSmasherMetalOverMeat;

// Low-cost units to populate fields.
const rivalUnit1 = alphaRuthlessLowlife; // cost 1, power 1
const rivalUnit2 = alphaSwordwiseHuscle; // cost 3, power 5
const friendlyUnit = alphaCorpoSecurity; // cost 2, power 2
const extraUnit = alphaArmoredMinotaur; // cost 5, power 9

describe("Adam Smasher - Metal Over Meat", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: adamSmasher, spent: false }],
      });
      expectAttackCandidate(engine, adamSmasher);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: adamSmasher, spent: true }],
      });
      expectNotAttackCandidate(engine, adamSmasher);
    });
  });

  describe("[PLAY] Defeat all other Units", () => {
    it("defeats all rival units on play", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          eddies: adamSmasher.cost,
        },
        {
          field: [
            { card: rivalUnit1, spent: true },
            { card: rivalUnit2, spent: false },
          ],
        },
      );

      engine.playCard(adamSmasher);

      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field).toHaveLength(0);
    });

    it("defeats all friendly units (except self) on play", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [adamSmasher],
        field: [{ card: friendlyUnit, spent: false }],
        eddies: adamSmasher.cost,
      });

      engine.playCard(adamSmasher);

      const p1Field = engine.getCardsInZone("field", P1);
      // Only Adam Smasher should remain
      expect(p1Field).toHaveLength(1);
      expect(p1Field[0]!.definitionId).toBe(adamSmasher.id);
    });

    it("defeats both friendly AND rival units simultaneously", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          field: [{ card: friendlyUnit, spent: false }],
          eddies: adamSmasher.cost,
        },
        {
          field: [
            { card: rivalUnit1, spent: true },
            { card: rivalUnit2, spent: false },
          ],
        },
      );

      engine.playCard(adamSmasher);

      // P1 field: only Adam Smasher
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field).toHaveLength(1);
      expect(p1Field[0]!.definitionId).toBe(adamSmasher.id);

      // P2 field: empty
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field).toHaveLength(0);
    });

    it("does NOT defeat Adam Smasher himself (excludeSelf)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          field: [{ card: friendlyUnit, spent: false }],
          eddies: adamSmasher.cost,
        },
        {
          field: [{ card: rivalUnit1, spent: true }],
        },
      );

      engine.playCard(adamSmasher);

      const p1Field = engine.getCardsInZone("field", P1);
      const smasherOnField = p1Field.find((c) => c.definitionId === adamSmasher.id);
      expect(smasherOnField).toBeDefined();
    });

    it("Adam Smasher remains on field after play", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          eddies: adamSmasher.cost,
        },
        {
          field: [
            { card: rivalUnit1, spent: true },
            { card: rivalUnit2, spent: false },
          ],
        },
      );

      engine.playCard(adamSmasher);

      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field).toHaveLength(1);
      expect(p1Field[0]!.definitionId).toBe(adamSmasher.id);
      expect(p1Field[0]!.zone).toBe("field");
    });

    it("enters field normally when no other units are present", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [adamSmasher],
        eddies: adamSmasher.cost,
      });

      expect(() => engine.playCard(adamSmasher)).not.toThrow();

      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field).toHaveLength(1);
      expect(p1Field[0]!.definitionId).toBe(adamSmasher.id);
    });

    it("defeated units go to their owner's trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          field: [{ card: friendlyUnit, spent: false }],
          eddies: adamSmasher.cost,
        },
        {
          field: [
            { card: rivalUnit1, spent: true },
            { card: rivalUnit2, spent: false },
          ],
        },
      );

      engine.playCard(adamSmasher);

      // Friendly unit goes to P1's trash
      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === friendlyUnit.id)).toBe(true);

      // Rival units go to P2's trash
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === rivalUnit1.id)).toBe(true);
      expect(p2Trash.some((c) => c.definitionId === rivalUnit2.id)).toBe(true);
    });

    it("action log shows the card was played", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          eddies: adamSmasher.cost,
        },
        {
          field: [{ card: rivalUnit1, spent: true }],
        },
      );

      engine.playCard(adamSmasher);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard");
    });

    it("works with many units on board", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          field: [
            { card: friendlyUnit, spent: false },
            { card: extraUnit, spent: false },
          ],
          eddies: adamSmasher.cost,
        },
        {
          field: [
            { card: rivalUnit1, spent: true },
            { card: rivalUnit2, spent: false },
          ],
        },
      );

      engine.playCard(adamSmasher);

      // P1 field: only Adam Smasher
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field).toHaveLength(1);
      expect(p1Field[0]!.definitionId).toBe(adamSmasher.id);

      // P2 field: empty
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field).toHaveLength(0);

      // All defeated units are in trash
      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === friendlyUnit.id)).toBe(true);
      expect(p1Trash.some((c) => c.definitionId === extraUnit.id)).toBe(true);

      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === rivalUnit1.id)).toBe(true);
      expect(p2Trash.some((c) => c.definitionId === rivalUnit2.id)).toBe(true);
    });

    it("emits cardMoved events for each defeated unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [adamSmasher],
          field: [{ card: friendlyUnit, spent: false }],
          eddies: adamSmasher.cost,
        },
        {
          field: [{ card: rivalUnit1, spent: true }],
        },
      );

      engine.playCard(adamSmasher);

      // At least 2 cardMoved events for defeated units (friendly + rival)
      const moveEvents = engine.getEvents("cardMoved");
      const defeatMoves = moveEvents.filter(
        (e) =>
          "fromZone" in e &&
          (e as { fromZone: string }).fromZone === "field" &&
          "toZone" in e &&
          (e as { toZone: string }).toZone === "trash",
      );
      expect(defeatMoves.length).toBeGreaterThanOrEqual(2);
    });
  });
});
