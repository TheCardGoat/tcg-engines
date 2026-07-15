import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1, P2 } from "@cyberpunk-engine/testing/index.ts";
import {
  boxTopperRetailGoroTakemuraHandsUnclean,
  boxTopperRetailJackieWellesPourOneOutForMe,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";

// T-Bug — Amateur Philosopher: "{Defeated} Look at all friendly face-down
// Legends. Then, you may Call a Legend for free. (You can only Call a Legend
// once per turn.)"
const tbug = welcomeToNightCityRetailTBugAmateurPhilosopher; // unit, cost 4, power 4
const goro = boxTopperRetailGoroTakemuraHandsUnclean; // a face-down friendly Legend
const jackie = boxTopperRetailJackieWellesPourOneOutForMe; // a second face-down Legend

// T-Bug (power 4) attacks a 5-power spent defender and is defeated, firing its
// Defeated trigger. The engine handles the look-at privately then suspends on
// the optional free-Call choice.
function defeatedTBug() {
  const engine = CyberpunkTestEngine.createWithFixture(
    {
      field: [{ card: tbug, spent: false, hasLag: false }],
      legendArea: [
        { card: goro, faceDown: true },
        { card: jackie, faceDown: true },
      ],
    },
    {
      field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 3 }], // 2 + 3 = 5 > 4
    },
  );
  engine.attackUnit(tbug, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
  engine.resolveFullFight({ as: P1 });
  return engine;
}

describe("T-Bug — Amateur Philosopher", () => {
  describe("{Defeated} Look at all friendly face-down Legends. Then, you may Call a Legend for free", () => {
    it("looks at the friendly face-down Legends, then lets the controller Call one for free", () => {
      const engine = defeatedTBug();
      const eddiesBefore = engine.getEddies(P1);

      // The Defeated trigger fires: look-at ran, then the optional free-Call
      // choice is pending.
      expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");

      // Call Goro for free.
      engine.resolveEffectTarget(goro, { as: P1 });

      // Goro flips face-up; Jackie stays face-down.
      expect(engine.getCard(goro).meta.faceDown).toBe(false);
      expect(engine.getCard(jackie).meta.faceDown).toBe(true);
      // "For free" — no Eddie was spent on the Call.
      expect(engine.getEddies(P1)).toBe(eddiesBefore);
      // T-Bug itself reached the trash from the fight.
      expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).toContain(tbug.id);

      // The look-at was private to P1: the rival never receives a cardsRevealed
      // event for the looked-at Legends.
      const lookEvents = engine.getEvents("cardsRevealed");
      expect(lookEvents.length).toBeGreaterThan(0);
      expect(lookEvents.some((e) => e.playerId === P2)).toBe(false);
    });

    it("may decline the free Call so no Legend flips", () => {
      const engine = defeatedTBug();

      expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");

      // Decline the optional free Call.
      engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

      // Both Legends remain face-down.
      expect(engine.getCard(goro).meta.faceDown).toBe(true);
      expect(engine.getCard(jackie).meta.faceDown).toBe(true);
    });

    it("skips the free Call if a Legend was already Called this turn, but the look-at still happens", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          eddies: 5,
          field: [{ card: tbug, spent: false, hasLag: false }],
          legendArea: [
            { card: goro, faceDown: true },
            { card: jackie, faceDown: true },
          ],
        },
        {
          field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 3 }],
        },
      );

      // Call Jackie first (the one-per-turn Call), then defeat T-Bug.
      engine.callLegend(jackie, { as: P1 });
      expect(engine.getCard(jackie).meta.faceDown).toBe(false);

      engine.attackUnit(tbug, welcomeToNightCityRetailCorpoSecurity, { as: P1 });
      engine.resolveFullFight({ as: P1 });

      // One Call per turn already used → the free-Call is skipped (no prompt);
      // the remaining face-down Legend stays face-down.
      expect(engine.getPrompt(P1).choice).toBeNull();
      expect(engine.getCard(goro).meta.faceDown).toBe(true);
      // The look-at still occurred before the guarded Call.
      expect(engine.getEvents("cardsRevealed").length).toBeGreaterThan(0);
    });
  });
});
