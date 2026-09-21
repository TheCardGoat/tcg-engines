import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRiotShield,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Riot Shield (registration)", () => {
  it("has the exact printed identity, attachment scope, Blocker, and rival Go Solo tax", () => {
    expect(welcomeToNightCityRetailRiotShield).toMatchObject({
      canonicalId: "riot-shield",
      slug: "riot-shield",
      name: "Riot Shield",
      displayName: "Riot Shield",
      type: "gear",
      color: "green",
      classifications: ["Weapon"],
      cost: 2,
      power: 1,
      ram: 2,
      hasSellTag: true,
      printNumber: "094",
      rarity: "Uncommon",
      keywords: ["blocker"],
      rulesText:
        "(Equip to a friendly Unit or face-up Legend.)\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)\nRivals must pay +2 €$ to use {Go Solo}.",
      attachment: {
        target: {
          selector: "card",
          controller: "friendly",
          zones: ["field", "legendArea"],
          cardTypes: ["unit", "legend"],
          face: "faceUp",
        },
      },
      abilities: [
        { kind: "keyword", keyword: "blocker", source: { selector: "host" } },
        {
          kind: "static",
          effects: [
            {
              effect: "grantRivalGoSoloCostIncrease",
              target: { selector: "self" },
              amount: 2,
              duration: "continuous",
            },
          ],
        },
      ],
    });
  });
});

describe("Riot Shield — Blocker + Rivals pay +2 €$ for Go Solo", () => {
  it("pays exactly 2 Eddies and equips through the public command to a friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailRiotShield],
      field: [welcomeToNightCityRetailFieldOperator],
      eddies: 2,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.attachGear(welcomeToNightCityRetailRiotShield, welcomeToNightCityRetailFieldOperator, {
      as: P1,
    });

    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.attachedGearIds,
    ).toHaveLength(1);
  });

  it("cannot equip through the public command to a friendly face-down Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailRiotShield],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      eddies: 2,
    });

    const failure = engine.expectFailure(() =>
      engine.attachGear(welcomeToNightCityRetailRiotShield, welcomeToNightCityRetailVStreetkid, {
        as: P1,
      }),
    );

    expect(failure.errorCode).toBe("INVALID_CHOICE");
  });

  it("grants Blocker to the equipped friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {},
    );
    const host = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);

    expect(getEffectiveRules(engine.getState(), host.instanceId)).toContain("blocker");
  });

  it("registers a rival Go Solo cost increase while attached", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {},
    );

    const modifier = engine
      .getState()
      .G.activeEffects.find((e) => e.kind === "rivalGoSoloCostIncrease");
    expect(modifier).toBeDefined();
    expect(modifier?.amount).toBe(2);
    expect(modifier?.playerId).toBe(P1);
  });

  it("does not increase the controller's own Go Solo cost", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 5,
      },
      {},
    );
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P1);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P1);

    expect(result.success).toBe(true);
  });

  it("lets a rival Go Solo once they pay the +2 €$ (the legend funds 1 itself, 6 eddies cover the rest)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 7,
      },
    );

    engine.completeTurn();
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P2);
    const eddiesBefore = engine.getEddies(P2);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P2);

    expect(result.success).toBe(true);
    // The Go Solo legend is the preferred payment source (it re-enters the
    // field ready), so the eddie pool only covers 6 of the 7 €$ cost.
    expect(engine.getEddies(P2)).toBe(eddiesBefore - 6);
  });

  it("rejects a rival Go Solo when only the printed base cost is available", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
        eddies: 4,
      },
    );
    engine.completeTurn();
    const vId = engine.findCardId(welcomeToNightCityRetailVStreetkid, "legendArea", P2);

    const result = engine.executeMove("goSolo", { args: { cardId: vId as string } }, P2);

    expect(result).toMatchObject({ success: false, errorCode: "INSUFFICIENT_EDDIES" });
    expect(engine.getCard(welcomeToNightCityRetailVStreetkid, "legendArea", P2)).toBeDefined();
  });

  it("equips to a face-up Legend as host and projects the cost modifier", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {},
    );

    const modifier = engine
      .getState()
      .G.activeEffects.find((e) => e.kind === "rivalGoSoloCostIncrease");
    expect(modifier).toBeDefined();
    const host = engine.getCard(
      welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
      "legendArea",
      P1,
    );
    expect(getEffectiveRules(engine.getState(), host.instanceId)).toContain("blocker");
  });

  it("does not project a cost modifier while not in play", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
      {},
    );

    const modifier = engine
      .getState()
      .G.activeEffects.find((e) => e.kind === "rivalGoSoloCostIncrease");
    expect(modifier).toBeUndefined();
  });

  it("redirects a rival direct attack into a fight when the host Blocks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailRiotShield],
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1).meta.spent).toBe(
      true,
    );
    expect(engine.getState().G.attackState).toMatchObject({ kind: "fight" });
  });

  it("declares a host Blocker keyword and a +2 rival Go Solo cost modifier", () => {
    const card = welcomeToNightCityRetailRiotShield;
    expect(card.abilities).toContainEqual(
      expect.objectContaining({
        kind: "keyword",
        keyword: "blocker",
        source: { selector: "host" },
      }),
    );

    const staticAbility = card.abilities.find((a) => a.kind === "static")!;
    expect(staticAbility.effects[0]).toMatchObject({
      effect: "grantRivalGoSoloCostIncrease",
      amount: 2,
      duration: "continuous",
    });
  });
});
