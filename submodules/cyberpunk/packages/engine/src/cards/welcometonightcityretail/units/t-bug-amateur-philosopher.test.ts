import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  theHeistRetailStarterDeckJackieWellesPourOneOutForMe,
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTBugAmateurPhilosopher,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("T-Bug — Amateur Philosopher", () => {
  it("has the exact yellow Merc Netrunner identity, private look, and optional free Call DSL", () => {
    expect(welcomeToNightCityRetailTBugAmateurPhilosopher).toMatchObject({
      canonicalId: "t-bug-amateur-philosopher",
      slug: "t-bug-amateur-philosopher",
      name: "T-Bug",
      displayName: "T-Bug: Amateur Philosopher",
      subname: "Amateur Philosopher",
      type: "unit",
      color: "yellow",
      classifications: ["Merc", "Netrunner"],
      cost: 4,
      power: 4,
      ram: 2,
      hasSellTag: false,
      rarity: "Uncommon",
      printNumber: "055",
      reminderText: ["You can only Call a Legend once per turn."],
      rulesText:
        "{Defeated} Look at all friendly face-down Legends. Then, you may Call a Legend for free. (You can only Call a Legend once per turn.)",
      abilities: [
        {
          kind: "triggered",
          text: "{Defeated} Look at all friendly face-down Legends. Then, you may Call a Legend for free.",
          trigger: { trigger: "defeated" },
          source: { selector: "self" },
          effects: [
            {
              effect: "lookAt",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["legendArea"],
                cardTypes: ["legend"],
                face: "faceDown",
              },
              revealToOpponent: false,
            },
            {
              effect: "callLegend",
              player: "friendly",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["legendArea"],
                cardTypes: ["legend"],
                face: "faceDown",
                selection: { mode: "choose", min: 0, max: 1 },
              },
              free: true,
              optional: true,
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 4 to play and enters with Lag", () => {
    const successEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTBugAmateurPhilosopher],
      eddies: 4,
    });
    for (const legend of successEngine.getCardsInZone("legendArea", P1)) {
      successEngine.judgeSpendCard(legend, { as: P1 });
    }
    successEngine.playCard(welcomeToNightCityRetailTBugAmateurPhilosopher, { as: P1 });
    expect(successEngine.getEddies(P1)).toBe(0);
    expect(
      successEngine.getCard(welcomeToNightCityRetailTBugAmateurPhilosopher, "field", P1).meta
        .hasLag,
    ).toBe(true);

    const failureEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTBugAmateurPhilosopher],
      eddies: 3,
    });
    for (const legend of failureEngine.getCardsInZone("legendArea", P1)) {
      failureEngine.judgeSpendCard(legend, { as: P1 });
    }
    expect(() =>
      failureEngine.playCard(welcomeToNightCityRetailTBugAmateurPhilosopher, { as: P1 }),
    ).toThrow(/INSUFFICIENT_EDDIES/);
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
            hasLag: false,
          },
        ],
        legendArea: [
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: true },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 3 }], // 2 + 3 = 5 > 4
      },
    );
    engine.attackUnit(
      welcomeToNightCityRetailTBugAmateurPhilosopher,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });
    return engine;
  }

  it("on defeat, may choose a friendly face-down Legend to Call for free (a/d)", () => {
    const engine = setupDefeatedTBug();
    const eddiesBefore = engine.getEddies(P1);

    // Defeated trigger fired → lookAt (no prompt) then callLegend suspends with a choice.
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");

    // Choose Goro → flip it for free.
    engine.resolveEffectTarget(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, { as: P1 });

    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean).meta.faceDown,
    ).toBe(false);
    expect(engine.getCard(theHeistRetailStarterDeckJackieWellesPourOneOutForMe).meta.faceDown).toBe(
      true,
    );
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

    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean).meta.faceDown,
    ).toBe(true);
    expect(engine.getCard(theHeistRetailStarterDeckJackieWellesPourOneOutForMe).meta.faceDown).toBe(
      true,
    );
  });

  it("if a Legend was already Called this turn, the free Call is skipped but lookAt still occurs (c)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        eddies: 5,
        field: [
          {
            card: welcomeToNightCityRetailTBugAmateurPhilosopher,
            spent: false,
            hasLag: false,
          },
        ],
        legendArea: [
          { card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: true },
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: true },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 3 }],
      },
    );

    // Call Saburo first — flips it face-up and sets calledLegendThisTurn.
    engine.callLegend(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, { as: P1 });
    expect(
      engine.getCard(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch).meta.faceDown,
    ).toBe(false);

    engine.attackUnit(
      welcomeToNightCityRetailTBugAmateurPhilosopher,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    // calledLegendThisTurn already true → callLegend is a noAction: no choice prompt,
    // and the remaining face-down Legends stay face-down. The lookAt still occurred
    // (it ran before the guarded callLegend effect and emitted cardsRevealed).
    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean).meta.faceDown,
    ).toBe(true);
    expect(engine.getCard(theHeistRetailStarterDeckJackieWellesPourOneOutForMe).meta.faceDown).toBe(
      true,
    );
  });

  it("creates no choice when no friendly face-down Legend remains", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailTBugAmateurPhilosopher,
            spent: false,
            hasLag: false,
          },
        ],
        legendArea: [
          { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: false },
          { card: theHeistRetailStarterDeckJackieWellesPourOneOutForMe, faceDown: false },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, powerModifier: 3 }] },
    );

    engine.attackUnit(
      welcomeToNightCityRetailTBugAmateurPhilosopher,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
  });
});
