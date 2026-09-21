import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean,
  embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch,
  welcomeToNightCityRetailRogueAmendiaresPreemSolo,
  welcomeToNightCityRetailTygerSWhisper,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const whisper = welcomeToNightCityRetailTygerSWhisper;

describe("Tyger's Whisper", () => {
  it("has the exact green power-0 Fixer/Tyger Claws identity and optional free-Call DSL", () => {
    expect(whisper).toMatchObject({
      canonicalId: "tyger-s-whisper",
      slug: "tyger-s-whisper",
      name: "Tyger's Whisper",
      displayName: "Tyger's Whisper",
      type: "unit",
      color: "green",
      classifications: ["Fixer", "Tyger Claws"],
      cost: 2,
      power: 0,
      ram: 1,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "090",
      timingTriggers: ["play"],
      rulesText:
        "{Play} You may Call a Legend for free. (You can only Call a Legend once per turn.)\n(Units with power 0 don't steal Gigs.)",
      reminderText: [
        "You can only Call a Legend once per turn.",
        "Units with power 0 don't steal Gigs.",
      ],
      abilities: [
        {
          kind: "triggered",
          text: "{Play} You may Call a Legend for free.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "callLegend",
              player: "friendly",
              free: true,
              optional: true,
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["legendArea"],
                cardTypes: ["legend"],
                face: "faceDown",
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 2 to play, enters with Lag, and rejects one less", () => {
    const success = CyberpunkTestEngine.createWithFixture({ hand: [whisper], eddies: 2 });
    for (const legend of success.getCardsInZone("legendArea", P1))
      success.judgeSpendCard(legend, { as: P1 });
    success.playCard(whisper, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCard(whisper, "field", P1).meta.hasLag).toBe(true);

    const short = CyberpunkTestEngine.createWithFixture({ hand: [whisper], eddies: 1 });
    for (const legend of short.getCardsInZone("legendArea", P1))
      short.judgeSpendCard(legend, { as: P1 });
    expect(short.expectFailure(() => short.playCard(whisper, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("can Call a face-down Legend for free when played", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [whisper],
      eddies: 2,
      legendArea: [{ card: welcomeToNightCityRetailRogueAmendiaresPreemSolo, faceDown: true }],
    });

    engine.playCard(whisper, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailRogueAmendiaresPreemSolo, { as: P1 });

    const legend = engine.getCard(
      welcomeToNightCityRetailRogueAmendiaresPreemSolo,
      "legendArea",
      P1,
    );
    expect(legend.meta.faceDown).toBe(false);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("may decline the free Call", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [whisper],
      eddies: 2,
      legendArea: [{ card: welcomeToNightCityRetailRogueAmendiaresPreemSolo, faceDown: true }],
    });
    engine.playCard(whisper, { as: P1 });
    engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1);
    expect(
      engine.getCard(welcomeToNightCityRetailRogueAmendiaresPreemSolo, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });

  it("does not offer another Call after a Legend was already Called this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [whisper],
      eddies: 7,
      legendArea: [
        { card: embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, faceDown: true },
        { card: embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, faceDown: true },
      ],
    });
    engine.callLegend(embracingPowerRetailStarterDeckSaburoArasakaStubbornPatriarch, { as: P1 });
    engine.playCard(whisper, { as: P1 });
    engine.expectNoPendingChoice();
    expect(
      engine.getCard(embracingPowerRetailStarterDeckGoroTakemuraHandsUnclean, "legendArea", P1).meta
        .faceDown,
    ).toBe(true);
  });

  it("creates no Call choice when no friendly face-down Legend exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [whisper],
      eddies: 2,
      legendArea: [],
    });
    engine.playCard(whisper, { as: P1 });
    engine.expectNoPendingChoice();
  });

  it("steals no Gigs when its zero-power direct attack resolves", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: whisper, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );
    engine.attackRival(whisper, { as: P1 });
    engine.resolveAttack({ as: P1 });
    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);
  });
});
