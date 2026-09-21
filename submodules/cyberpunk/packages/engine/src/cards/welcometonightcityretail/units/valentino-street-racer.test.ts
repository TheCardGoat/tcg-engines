import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailNadiaFightingThroughGrief,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailValentinoStreetRacer,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Valentino Street Racer", () => {
  it("has the exact green Valentino/Vehicle identity and turn-scoped Adrenaline DSL", () => {
    expect(welcomeToNightCityRetailValentinoStreetRacer).toMatchObject({
      canonicalId: "valentino-street-racer",
      slug: "valentino-street-racer",
      name: "Valentino Street Racer",
      displayName: "Valentino Street Racer",
      type: "unit",
      color: "green",
      classifications: ["Valentino", "Vehicle"],
      cost: 3,
      power: 3,
      ram: 2,
      hasSellTag: false,
      rarity: "Common",
      printNumber: "091",
      timingTriggers: ["play"],
      rulesText:
        "{Play} Give another friendly Unit with cost 5 or less {Adrenaline} this turn. (A Unit with Adrenaline can attack the turn it's played.)",
      abilities: [
        {
          kind: "triggered",
          text: "{Play} Give another friendly Unit with cost 5 or less {Adrenaline} this turn.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "grantRule",
              target: {
                selector: "card",
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                maxCost: 5,
                excludeSelf: true,
                selection: { mode: "choose", min: 1, max: 1 },
              },
              rule: "adrenaline",
              duration: "turn",
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 3, enters with Lag, and rejects one less", () => {
    const success = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailValentinoStreetRacer],
      eddies: 3,
      field: [],
    });
    for (const legend of success.getCardsInZone("legendArea", P1)) {
      success.judgeSpendCard(legend, { as: P1 });
    }
    success.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(
      success.getCard(welcomeToNightCityRetailValentinoStreetRacer, "field", P1).meta.hasLag,
    ).toBe(true);

    const short = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailValentinoStreetRacer],
      eddies: 2,
    });
    for (const legend of short.getCardsInZone("legendArea", P1)) {
      short.judgeSpendCard(legend, { as: P1 });
    }
    expect(
      short.expectFailure(() =>
        short.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 }),
      ).errorCode,
    ).toBe("INSUFFICIENT_EDDIES");
  });

  it("gives another friendly Unit with cost 5 or less Adrenaline this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailValentinoStreetRacer],
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: true }],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });

    // The granted Adrenaline lets the Lagged Unit attack the turn it entered.
    engine.attackUnit(
      welcomeToNightCityRetailSwordwiseHuscle,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );
    expect(engine.getAttackState()?.defenderId).toBe(
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    );
  });

  it("cannot target itself or a friendly Unit with cost 6 or more", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailValentinoStreetRacer],
        field: [
          { card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: true },
          { card: welcomeToNightCityRetailNadiaFightingThroughGrief, spent: false, hasLag: true },
        ],
        eddies: 3,
      },
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: true }] },
    );

    engine.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
      throw new Error("Expected Valentino Street Racer to ask for an effect target.");
    }

    const eligibleIds = choice.payload.eligibleIds;
    expect(choice.payload).toMatchObject({ min: 1, max: 1, canDecline: false });
    expect(eligibleIds).toContain(
      engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1),
    );
    expect(eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailNadiaFightingThroughGrief, "field", P1),
    );
    expect(eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailValentinoStreetRacer, "field", P1),
    );
    expect(eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P2),
    );
  });

  it("creates no target choice when no other friendly cost-5-or-less Unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailValentinoStreetRacer],
        field: [{ card: welcomeToNightCityRetailNadiaFightingThroughGrief, spent: false }],
        eddies: 3,
      },
      { field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false }] },
    );
    engine.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });
    engine.expectNoPendingChoice();
  });

  it("granted Adrenaline expires at the end of the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailValentinoStreetRacer],
        field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, spent: false, hasLag: true }],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailValentinoStreetRacer, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    engine.completeTurn({ as: P1 });

    // The granted Adrenaline is an end-of-turn ActiveEffect and is gone now.
    const huscle = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    expect(getEffectiveRules(engine.getState(), huscle.instanceId)).not.toContain("adrenaline");
  });
});
