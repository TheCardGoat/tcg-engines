import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailAugmentedNegotiators,
  welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Johnny Silverhand — Never Stop Fighting (registration)", () => {
  it("is registered with the ingested card data", () => {
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting).toBeDefined();
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.slug).toBe(
      "johnny-silverhand-never-stop-fighting",
    );
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.type).toBe("unit");
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.color).toBe("red");
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.set.code).toBe(
      "welcometonightcityretail",
    );
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.cost).toBe(6);
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.power).toBe(8);
  });
});

describe("Johnny Silverhand — Never Stop Fighting", () => {
  it("wins a fight against a CORPO Unit even at lower power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailYorinobuArasakaSteelDragon, spent: true }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailYorinobuArasakaSteelDragon,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getCardsInZone("trash", P2)
        .some(
          (card) => card.definitionId === welcomeToNightCityRetailYorinobuArasakaSteelDragon.id,
        ),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("field", P1)
        .some(
          (card) =>
            card.definitionId === welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.id,
        ),
    ).toBe(true);
  });

  it("does NOT auto-win against a non-CORPO Unit with higher power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getCardsInZone("trash", P1)
        .some(
          (card) =>
            card.definitionId === welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.id,
        ),
    ).toBe(true);
  });

  it("readies itself the first time it wins a fight each turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: true }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailOffdutyMalfini,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(false);
  });

  it("does not ready on a second fight won in the same turn (firstTimeEachTurn)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: true },
          { card: welcomeToNightCityRetailAugmentedNegotiators, spent: true },
        ],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailOffdutyMalfini,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(false);

    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailAugmentedNegotiators,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(true);
  });

  it("also auto-wins as the defender when a CORPO Unit attacks it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: true,
            hasLag: false,
          },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailYorinobuArasakaSteelDragon, spent: false, hasLag: false },
        ],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailYorinobuArasakaSteelDragon,
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });

    expect(
      engine
        .getCardsInZone("trash", P2)
        .some(
          (card) => card.definitionId === welcomeToNightCityRetailYorinobuArasakaSteelDragon.id,
        ),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("field", P1)
        .some(
          (card) =>
            card.definitionId === welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.id,
        ),
    ).toBe(true);
  });

  it("does not ready from a direct attack (no fight)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {},
    );

    engine.attackRival(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(true);
  });

  it("grants a continuous auto-win-against-Corpo rule to itself", () => {
    const card = welcomeToNightCityRetailJohnnySilverhandNeverStopFighting;
    const staticAbility = card.abilities.find((a) => a.kind === "static")!;
    expect(staticAbility.effects[0]).toMatchObject({
      effect: "grantFightWinAgainst",
      classifications: ["Corpo"],
      target: { selector: "self" },
      duration: "continuous",
    });
  });

  it("declares a first-time-each-turn fight-won trigger that readies itself", () => {
    const card = welcomeToNightCityRetailJohnnySilverhandNeverStopFighting;
    const triggered = card.abilities.find((a) => a.kind === "triggered")!;
    expect(triggered.limits).toContain("firstTimeEachTurn");
    expect(triggered.effects.map((e) => e.effect)).toContain("ready");
  });
});
