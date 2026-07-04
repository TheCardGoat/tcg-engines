import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaGoroTakemuraHandsUnclean,
  alphaJackieWellesPourOneOutForMe,
  alphaSaburoArasakaStubbornPatriach,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("T-Bug — Amateur Philosopher", () => {
  it("is a structured card with the expected slug", () => {
    expect(welcomeToNightCityRetailTBugAmateurPhilosopher.slug).toBe("t-bug-amateur-philosopher");
  });

  // Helper: t-bug (4 power) attacks a 5-power spent defender and is defeated.
  // Returns the engine after the fight resolves (defeated trigger fires).
  function setupDefeatedTBug() {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailTBugAmateurPhilosopher,
            spent: false,
            playedThisTurn: false,
          },
        ],
        legendArea: [
          { card: alphaGoroTakemuraHandsUnclean, faceDown: true },
          { card: alphaJackieWellesPourOneOutForMe, faceDown: true },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true, powerModifier: 3 }], // 2 + 3 = 5 > 4
      },
    );
    engine.attackUnit(welcomeToNightCityRetailTBugAmateurPhilosopher, alphaCorpoSecurity, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });
    return engine;
  }

  it("on defeat, may choose a friendly face-down Legend to Call for free (a/d)", () => {
    const engine = setupDefeatedTBug();
    const eddiesBefore = engine.getEddies(P1);

    // Defeated trigger fired → lookAt (no prompt) then callLegend suspends with a choice.
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");

    // Choose Goro → flip it for free.
    engine.resolveEffectTarget(alphaGoroTakemuraHandsUnclean, { as: P1 });

    expect(engine.getCard(alphaGoroTakemuraHandsUnclean).meta.faceDown).toBe(false);
    expect(engine.getCard(alphaJackieWellesPourOneOutForMe).meta.faceDown).toBe(true);
    // Free Call — Eddie total unchanged.
    expect(engine.getEddies(P1)).toBe(eddiesBefore);
    expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).toContain(
      welcomeToNightCityRetailTBugAmateurPhilosopher.id,
    );

    // The Defeated lookAt has `revealToOpponent: false`, so the look is private
    // to P1: the rival (P2) must never be the recipient of a cardsRevealed
    // event for the looked-at Legends.
    const lookEvents = engine.getEvents("cardsRevealed");
    expect(lookEvents.length).toBeGreaterThan(0);
    expect(lookEvents.some((e) => e.playerId === P2)).toBe(false);
  });

  it("on defeat, may decline the free Call so nothing flips (b)", () => {
    const engine = setupDefeatedTBug();

    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");

    // Decline the optional call.
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);

    expect(engine.getCard(alphaGoroTakemuraHandsUnclean).meta.faceDown).toBe(true);
    expect(engine.getCard(alphaJackieWellesPourOneOutForMe).meta.faceDown).toBe(true);
  });

  it("if a Legend was already Called this turn, the free Call is skipped but lookAt still occurs (c)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        eddies: 5,
        field: [
          {
            card: welcomeToNightCityRetailTBugAmateurPhilosopher,
            spent: false,
            playedThisTurn: false,
          },
        ],
        legendArea: [
          { card: alphaSaburoArasakaStubbornPatriach, faceDown: true },
          { card: alphaGoroTakemuraHandsUnclean, faceDown: true },
          { card: alphaJackieWellesPourOneOutForMe, faceDown: true },
        ],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true, powerModifier: 3 }],
      },
    );

    // Call Saburo first — flips it face-up and sets calledLegendThisTurn.
    engine.callLegend(alphaSaburoArasakaStubbornPatriach, { as: P1 });
    expect(engine.getCard(alphaSaburoArasakaStubbornPatriach).meta.faceDown).toBe(false);

    engine.attackUnit(welcomeToNightCityRetailTBugAmateurPhilosopher, alphaCorpoSecurity, {
      as: P1,
    });
    engine.resolveFullFight({ as: P1 });

    // calledLegendThisTurn already true → callLegend is a noAction: no choice prompt,
    // and the remaining face-down Legends stay face-down. The lookAt still occurred
    // (it ran before the guarded callLegend effect and emitted cardsRevealed).
    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCard(alphaGoroTakemuraHandsUnclean).meta.faceDown).toBe(true);
    expect(engine.getCard(alphaJackieWellesPourOneOutForMe).meta.faceDown).toBe(true);
  });
});
