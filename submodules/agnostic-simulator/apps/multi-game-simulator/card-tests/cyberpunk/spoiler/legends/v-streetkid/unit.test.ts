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
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailAfterpartyAtLizzieS,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";

describe("V - Streetkid", () => {
  describe("UI prompt", () => {
    it("shows the legend as callable when face-down", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
        eddies: 2,
      });
      expectCallableLegend(engine, welcomeToNightCityRetailVStreetkid);
    });

    it("shows the legend as an attack candidate after entering the field", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailVStreetkid, spent: false }],
      });
      expectAttackCandidate(engine, welcomeToNightCityRetailVStreetkid);
    });

    it("does NOT show a spent legend as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailVStreetkid, spent: true }],
      });
      expectNotAttackCandidate(engine, welcomeToNightCityRetailVStreetkid);
    });
  });

  // ── GO SOLO ──────────────────────────────────────────────────────────

  describe(`GO SOLO (Pay this card's cost to play it as a ready unit. It can attack this turn.)`, () => {
    it("enters the field as a ready unit with no summoning sickness", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailVStreetkid, spent: false }],
      });

      engine.attackRival(welcomeToNightCityRetailVStreetkid);

      const attack = engine.getAttackState();
      expect(attack).not.toBeNull();
      expect(attack!.kind).toBe("direct");
    });

    it("spends V when she attacks", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailVStreetkid, spent: false }],
      });

      engine.attackRival(welcomeToNightCityRetailVStreetkid);

      expect(engine.getCard(welcomeToNightCityRetailVStreetkid).meta.spent).toBe(true);
    });

    it("cannot attack when spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailVStreetkid, spent: true }],
      });

      const failure = engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailVStreetkid),
      );
      expect(failure.errorCode).toBe("CARD_SPENT");
    });

    it("emits a localised action log for the direct attack", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: welcomeToNightCityRetailVStreetkid, spent: false }],
      });

      engine.attackRival(welcomeToNightCityRetailVStreetkid);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.attackRival");
      expect(log!.params.attackerName).toBe(welcomeToNightCityRetailVStreetkid.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toContain(welcomeToNightCityRetailVStreetkid.displayName);
    });
  });

  // ── DEFEATED ─────────────────────────────────────────────────────────

  describe(`DEFEATED Discard the top 3 cards of your deck. Then, choose 1 Braindance Program from your trash and add it to your hand.`, () => {
    // P1: V on field (ready, power 3) + Braindance Program in trash + 5-card deck
    // P2: Huscle on field (spent=true, power 5) — able to be attacked
    function makeDefeatedEngine() {
      return CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: welcomeToNightCityRetailVStreetkid, spent: false }],
          trash: [welcomeToNightCityRetailAfterpartyAtLizzieS],
          deck: 20,
        },
        {
          field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
        },
      );
    }

    // V (power 3) attacks Huscle (power 5, spent) → Huscle wins → V is defeated.
    function driveVToDefeat(engine: ReturnType<typeof makeDefeatedEngine>) {
      engine.attackUnit(
        welcomeToNightCityRetailVStreetkid,
        welcomeToNightCityRetailSwordwiseHuscle,
      );
      engine.resolveAttack(); // attack → react
      engine.resolveAttack({ as: P2, pass: true }); // react → fight
      engine.resolveAttack(); // fight → defeat
    }

    it("P1's deck decreases by 3 after V is defeated", () => {
      const engine = makeDefeatedEngine();
      const deckBefore = engine.getCardsInZone("deck", P1).length;

      driveVToDefeat(engine);

      expect(engine.getCardsInZone("deck", P1).length).toBe(deckBefore - 3);
    });

    it("moves the Braindance Program from P1's trash to P1's hand", () => {
      const engine = makeDefeatedEngine();
      const handBefore = engine.getHandCount(P1);

      driveVToDefeat(engine);

      expect(
        engine
          .getCardsInZone("trash", P1)
          .some((c) => c.definitionId === welcomeToNightCityRetailAfterpartyAtLizzieS.id),
      ).toBe(false);
      expect(engine.getHandCount(P1)).toBe(handBefore + 1);
    });

    it("V is removed from the game after being defeated (GO SOLO)", () => {
      const engine = makeDefeatedEngine();

      driveVToDefeat(engine);

      // GO SOLO: if it leaves the field, remove it from the game.
      expect(
        engine
          .getCardsInZone("trash", P1)
          .some((c) => c.definitionId === welcomeToNightCityRetailVStreetkid.id),
      ).toBe(false);
      expect(() => engine.getCard(welcomeToNightCityRetailVStreetkid)).toThrow();
    });

    it("emits a cardDefeated event for V", () => {
      const engine = makeDefeatedEngine();

      driveVToDefeat(engine);

      const evt = engine.getLastEvent("cardDefeated") as
        | { type: "cardDefeated"; cardId: string; playerId: string }
        | undefined;
      expect(evt).toBeDefined();
      expect(evt!.playerId).toBe(P1 as string);
    });

    it("does not error when P1 has no Braindance programs in trash", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          field: [{ card: welcomeToNightCityRetailVStreetkid, spent: false }],
          deck: 20,
        },
        {
          field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: true }],
        },
      );

      expect(() => driveVToDefeat(engine)).not.toThrow();
    });

    it("the fight action log records the correct winner and loser", () => {
      const engine = makeDefeatedEngine();

      driveVToDefeat(engine);

      const log = engine.getLastActionLog();
      expect(log).toBeDefined();
      expect(log!.messageKey).toBe("move.resolveAttack.fight.defenderWins");
      expect(log!.params.attackerName).toBe(welcomeToNightCityRetailVStreetkid.displayName);
      expect(log!.params.defenderName).toBe(welcomeToNightCityRetailSwordwiseHuscle.displayName);

      const text = formatActionLog(log!, enMessages);
      expect(text).toBe(
        `Fight: ${welcomeToNightCityRetailSwordwiseHuscle.displayName} (5) defeated ${welcomeToNightCityRetailVStreetkid.displayName} (3).`,
      );
    });
  });
});
