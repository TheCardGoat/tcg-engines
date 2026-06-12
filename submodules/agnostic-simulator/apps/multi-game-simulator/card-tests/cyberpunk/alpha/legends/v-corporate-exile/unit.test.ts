import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCallableLegend,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaVCorporateExile,
  alphaSwordwiseHuscle,
  alphaArmoredMinotaur,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

const v = alphaVCorporateExile; // legend, power 8, cost 5
const huscle = alphaSwordwiseHuscle; // unit, power 5
const p1LeadGigs = [
  { dieType: "d4" as const, faceValue: 1 },
  { dieType: "d10" as const, faceValue: 1 },
  { dieType: "d12" as const, faceValue: 1 },
];

describe("V - Corporate Exile", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: v, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, v);
    });

    it("shows the legend as an attack candidate after entering the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: v, spent: false }],
      });
      expectAttackCandidate(engine, v);
    });

    it("does NOT show a spent legend as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: v, spent: true }],
      });
      expectNotAttackCandidate(engine, v);
    });
  });

  // ── GO SOLO ──────────────────────────────────────────────────────────

  describe(`GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)`, () => {
    it("can be paid from the legend area to enter the field ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: v, faceDown: false }],
        eddies: v.cost ?? 5,
      });
      const legend = engine.getCard(v, "legendArea", P1);

      const result = engine.executeMove(
        "goSolo",
        { args: { cardId: legend.instanceId as string } },
        P1,
      );

      expect(result.success).toBe(true);
      expect(engine.getCard(v, "field", P1).meta.spent).toBe(false);
      expect(engine.getCard(v, "field", P1).meta.playedThisTurn).toBe(false);
      expect(engine.getEddies(P1)).toBe(0);

      engine.attackRival(v);
      expect(engine.getAttackState()?.kind).toBe("direct");
    });

    it("enters the field as a ready unit with no summoning sickness", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: v, spent: false }],
      });

      engine.attackRival(v);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("spends V when he attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: v, spent: false }],
      });

      engine.attackRival(v);

      expect(engine.getCard(v).meta.spent).toBe(true);
    });

    it("cannot attack when spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: v, spent: true }],
      });

      const failure = engine.expectFailure(() => engine.attackRival(v));
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("emits a localised action log for the direct attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: v, spent: false }],
      });

      engine.attackRival(v);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.attackRival");
      expect(log!.params.attackerName).toBe(v.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(v.displayName);
    });

    it("steals a gig on successful direct attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: v, spent: false }], gigArea: p1LeadGigs.slice(0, 2) },
        { gigArea: [{ dieType: "d6", faceValue: 3 }] },
      );

      engine.attackRival(v);
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: steal

      expect(engine.getGigCount(P1)).toBeGreaterThanOrEqual(1);
      expect(engine.getGigCount(P2)).toBe(0);
    });

    it("steals only 1 gig at power 8 (below 10 threshold)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: v, spent: false }] },
        {
          gigArea: [
            { dieType: "d6", faceValue: 3 },
            { dieType: "d8", faceValue: 4 },
          ],
        },
      );
      const p2GigsBefore = engine.getGigCount(P2);

      engine.attackRival(v);
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> steal
      engine.resolveAttack(); // steal: steal

      // Power 8 < 10 → steal exactly 1 gig
      expect(engine.getGigCount(P2)).toBe(p2GigsBefore - 1);
    });

    it("can attack a spent rival unit and win the fight", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: v, spent: false }] }, // V power 8
        { field: [{ card: huscle, spent: true }] }, // Huscle power 5
      );

      engine.attackUnit(v, huscle);
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> fight
      engine.resolveAttack(); // fight -> defeat
      engine.resolveAttack(); // defeat -> cleared

      // V survives, Huscle is trashed
      expect(engine.getCard(v).zone).toBe("field");
      expect(engine.getCardsInZone("trash", P2).some((c) => c.definitionId === huscle.id)).toBe(
        true,
      );
    });

    it("emits a localised action log when V wins a fight", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: v, spent: false }] }, // V power 8 — attacker, wins
        { field: [{ card: huscle, spent: true }] }, // Huscle power 5 — defender, loses
      );

      engine.attackUnit(v, huscle);
      engine.resolveAttack(); // offensive -> defensive
      engine.resolveAttack({ as: P2, pass: true }); // defensive -> fight
      engine.resolveAttack(); // fight -> defeat
      engine.resolveAttack(); // defeat -> cleared

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.resolveAttack.fight.attackerWins");
      expect(log!.params.attackerName).toBe(v.displayName);
      expect(log!.params.defenderName).toBe(huscle.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toBe(`${v.displayName} defeated ${huscle.displayName}.`);
    });

    it("appears as an attack candidate in the prompt layer", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: v, spent: false }],
      });

      const prompt = engine.getPrompt(P1);
      const attackRivalMove = prompt.availableMoves.find((m) => m.moveId === "attackRival");
      expect(attackRivalMove).toBeDefined();
      expect(attackRivalMove!.inputSpec.type).toBe("selectCard");
      if (attackRivalMove!.inputSpec.type === "selectCard") {
        const vInstance = engine.getCard(v);
        expect(attackRivalMove!.inputSpec.candidates).toContain(vInstance.instanceId);
      }
    });

    it("cannot attack a ready rival unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: v, spent: false }] },
        { field: [{ card: huscle, spent: false }] }, // Huscle is ready
      );

      const failure = engine.expectFailure(() => engine.attackUnit(v, huscle));
      expect(failure.errorCode).toBe("TARGET_READY");
    });

    it("is removed from the game when defeated in combat", () => {
      // Armored Minotaur (power 9) vs V (power 8) — Minotaur wins.
      const engine = CyberpunkTestEngine.createWithFixture(
        { field: [{ card: v, spent: true }] },
        { field: [{ card: alphaArmoredMinotaur, spent: false }] },
      );

      // V is on the field.
      expect(engine.getCard(v, "field", P1).zone).toBe("field");

      // P2 attacks V with Armored Minotaur and wins.
      engine.attackUnit(alphaArmoredMinotaur, v, { as: P2 });
      engine.resolveAttack(); // offensive → defensive
      engine.resolveAttack({ as: P1, pass: true }); // defensive → fight
      engine.resolveAttack(); // fight → defeat
      engine.resolveAttack(); // defeat → cleared

      // V is removed from the game, not in trash or field.
      expect(engine.getCardsInZone("trash", P1).some((c) => c.definitionId === v.id)).toBe(false);
      expect(engine.getCardsInZone("field", P1).some((c) => c.definitionId === v.id)).toBe(false);
      expect(() => engine.getCard(v)).toThrow();
    });
  });
});
