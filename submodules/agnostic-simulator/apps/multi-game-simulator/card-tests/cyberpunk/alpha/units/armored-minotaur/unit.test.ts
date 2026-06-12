import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
  expectPendingChoice,
  expectEligibleTargets,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaArmoredMinotaur,
  alphaSwordwiseHuscle,
  alphaRuthlessLowlife,
  alphaEmergencyAtlus,
  alphaDelamainCab,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const minotaur = alphaArmoredMinotaur; // unit, power 9, cost 6
const huscle = alphaSwordwiseHuscle; // unit, power 5
const lowlife = alphaRuthlessLowlife; // unit, power 1
const atlus = alphaEmergencyAtlus; // unit, power 7
const delamain = alphaDelamainCab; // unit, power 7

function expectMinotaurTargetChoice(engine: CyberpunkTestEngine, expectedCount: number): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  expect(choice?.type).toBe("chooseTarget");
  if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
    throw new Error("Expected Armored Minotaur target choice");
  }
  expect(choice.payload.targetKind).toBe("card");
  expect(choice.payload.min).toBe(1);
  expect(choice.payload.max).toBe(1);
  expect(choice.payload.eligibleIds).toHaveLength(expectedCount);
}

describe("Armored Minotaur", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: minotaur, spent: false }],
      });
      expectAttackCandidate(engine, minotaur);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: minotaur, spent: true }],
      });
      expectNotAttackCandidate(engine, minotaur);
    });

    it("presents rival units as targets after playing when street cred is high enough", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [{ dieType: "d12", faceValue: 12 }],
        },
        { field: [{ card: lowlife, spent: false }] },
      );

      engine.playCard(minotaur);

      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });
      expectEligibleTargets(engine, [lowlife], { as: P2 });
    });
  });

  describe(`[PLAY] Defeat a rival unit with power <= 5 when Street Cred >= 12`, () => {
    it("defeats a rival unit with power <= 5 when street cred >= 12", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      expect(engine.getStreetCred(P1)).toBe(12);

      engine.playCard(minotaur);
      expectMinotaurTargetChoice(engine, 1);
      engine.resolveEffectTarget(huscle);

      // Huscle (power 5) should be defeated and moved to P2's trash
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === huscle.id)).toBe(true);
      // Huscle should no longer be on P2's field
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === huscle.id)).toBe(false);
    });

    it("does NOT trigger when street cred < 12", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d6", faceValue: 5 },
            { dieType: "d4", faceValue: 4 },
            { dieType: "d8", faceValue: 2 },
          ],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      expect(engine.getStreetCred(P1)).toBe(11);

      engine.playCard(minotaur);

      // Huscle should still be on P2's field (condition not met)
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === huscle.id)).toBe(true);
    });

    it("defeats only the chosen rival unit when multiple power <= 5 targets exist", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        {
          field: [
            { card: huscle, spent: true },
            { card: lowlife, spent: true },
          ],
        },
      );

      engine.playCard(minotaur);
      expectMinotaurTargetChoice(engine, 2);
      engine.resolveEffectTarget(huscle);

      // Only the selected power <= 5 unit should be defeated.
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === huscle.id)).toBe(true);
      expect(p2Trash.some((c) => c.definitionId === lowlife.id)).toBe(false);
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === lowlife.id)).toBe(true);
    });

    it("cannot defeat a unit with power > 5", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        { field: [{ card: atlus, spent: true }] },
      );

      engine.playCard(minotaur);

      // Emergency Atlus (power 7) should survive — not a valid target
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === atlus.id)).toBe(true);
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === atlus.id)).toBe(false);
    });

    it("defeats only power <= 5 units, leaving power > 5 units unharmed", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        {
          field: [
            { card: huscle, spent: true },
            { card: delamain, spent: true },
          ],
        },
      );

      engine.playCard(minotaur);
      expectMinotaurTargetChoice(engine, 1);
      engine.resolveEffectTarget(huscle);

      // Huscle (power 5) should be defeated
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === huscle.id)).toBe(true);
      // Delamain (power 7) should survive
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === delamain.id)).toBe(true);
    });

    it("no valid targets: ability is skipped (no error)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        // Rival has no units on field
      );

      // Should not throw even though there are no valid targets
      expect(() => engine.playCard(minotaur)).not.toThrow();

      // Minotaur should still enter the field
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field.some((c) => c.definitionId === minotaur.id)).toBe(true);
    });

    it("action log shows the card was played", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      engine.playCard(minotaur);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.playCard");
      expect(log!.params.cardName).toBe(minotaur.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(minotaur.displayName);
    });

    it("defeated unit goes to rival's trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        { field: [{ card: lowlife, spent: true }] },
      );

      engine.playCard(minotaur);
      expectMinotaurTargetChoice(engine, 1);
      engine.resolveEffectTarget(lowlife);

      // Lowlife should be in P2's trash (not P1's)
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === lowlife.id)).toBe(true);

      const p1Trash = engine.getCardsInZone("trash", P1);
      expect(p1Trash.some((c) => c.definitionId === lowlife.id)).toBe(false);
    });

    it("Armored Minotaur enters field even if condition not met", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      expect(engine.getStreetCred(P1)).toBe(2);

      engine.playCard(minotaur);

      // Minotaur should be on P1's field despite condition not being met
      const p1Field = engine.getCardsInZone("field", P1);
      expect(p1Field.some((c) => c.definitionId === minotaur.id)).toBe(true);

      // Rival unit should NOT be defeated
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === huscle.id)).toBe(true);
    });

    it("triggers at exactly 12 street cred (boundary)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d8", faceValue: 8 },
            { dieType: "d4", faceValue: 4 },
          ],
        },
        { field: [{ card: lowlife, spent: true }] },
      );

      expect(engine.getStreetCred(P1)).toBe(12);

      engine.playCard(minotaur);
      expectMinotaurTargetChoice(engine, 1);
      engine.resolveEffectTarget(lowlife);

      // Should trigger at exactly 12
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === lowlife.id)).toBe(true);
    });

    it("triggers with street cred well above 12", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [minotaur],
          eddies: minotaur.cost,
          gigArea: [
            { dieType: "d10", faceValue: 10 },
            { dieType: "d8", faceValue: 8 },
            { dieType: "d6", faceValue: 6 },
          ],
        },
        { field: [{ card: huscle, spent: true }] },
      );

      expect(engine.getStreetCred(P1)).toBe(24);

      engine.playCard(minotaur);
      expectMinotaurTargetChoice(engine, 1);
      engine.resolveEffectTarget(huscle);

      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === huscle.id)).toBe(true);
    });
  });
});
