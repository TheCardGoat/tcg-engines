import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailAugmentedNegotiators,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailMaxtacSquadron,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailRocknRockerboy,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

describe("Johnny Silverhand — Never Stop Fighting (registration)", () => {
  it("is the exact 6-cost red Merc Rocker Samurai Unit with both printed abilities", () => {
    const johnny = welcomeToNightCityRetailJohnnySilverhandNeverStopFighting;
    expect(johnny).toMatchObject({
      canonicalId: "johnny-silverhand-never-stop-fighting",
      slug: "johnny-silverhand-never-stop-fighting",
      type: "unit",
      color: "red",
      classifications: ["Merc", "Rocker", "Samurai"],
      cost: 6,
      power: 8,
      ram: 2,
      hasSellTag: false,
      printNumber: "011",
      set: { code: "welcometonightcityretail" },
    });
    expect(johnny.abilities).toHaveLength(2);
  });
});

describe("Johnny Silverhand — Never Stop Fighting", () => {
  it("readies after beating MaxTac even when Jackie replaces its defeat", () => {
    const johnny = welcomeToNightCityRetailJohnnySilverhandNeverStopFighting;
    const maxtac = welcomeToNightCityRetailMaxtacSquadron;
    const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: johnny, spent: false, hasLag: false }] },
      {
        field: [{ card: maxtac, spent: true, hasLag: false }],
        legendArea: [{ card: jackie, faceDown: false }],
        eddies: 1,
      },
    );
    engine.judgeSpendCard(jackie, { as: P2 });

    engine.attackUnit(johnny, maxtac, { as: P1 });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getPrompt(P2).choice?.type).toBe("redirectDefeat");
    engine.applyRedirectDefeat({ as: P2 });

    expect(engine.getEvents("attackResolved").at(-1)).toMatchObject({
      attackKind: "fight",
      result: "attackerWins",
    });
    expect(engine.getCard(maxtac, "field", P2)).toBeDefined();
    expect(engine.getCardsInZone("removedFromGame", P2).map((card) => card.definitionId)).toContain(
      jackie.id,
    );
    expect(engine.getCard(johnny, "field", P1).meta.spent).toBe(false);
  });

  it("readies after beating MaxTac when Jackie declines the replacement", () => {
    const johnny = welcomeToNightCityRetailJohnnySilverhandNeverStopFighting;
    const maxtac = welcomeToNightCityRetailMaxtacSquadron;
    const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: johnny, spent: false, hasLag: false }] },
      {
        field: [{ card: maxtac, spent: true, hasLag: false }],
        legendArea: [{ card: jackie, faceDown: false }],
        eddies: 1,
      },
    );
    engine.judgeSpendCard(jackie, { as: P2 });

    engine.attackUnit(johnny, maxtac, { as: P1 });
    engine.resolveFullFight({ as: P1 });
    engine.declineRedirectDefeat({ as: P2 });

    expect(engine.getEvents("attackResolved").at(-1)).toMatchObject({ result: "attackerWins" });
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      maxtac.id,
    );
    expect(engine.getCard(jackie, "legendArea", P2)).toBeDefined();
    expect(engine.getCard(johnny, "field", P1).meta.spent).toBe(false);
  });

  it("does not win or ready when both Units have equal power", () => {
    const johnny = welcomeToNightCityRetailJohnnySilverhandNeverStopFighting;
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: johnny, spent: false, hasLag: false }] },
      { field: [{ card: welcomeToNightCityRetailRocknRockerboy, spent: true }] },
    );

    engine.attackUnit(johnny, welcomeToNightCityRetailRocknRockerboy, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getEvents("attackResolved").at(-1)).toMatchObject({ result: "mutual" });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      johnny.id,
    );
    expect(
      engine
        .getEvents("effectTriggered")
        .some((event) => event.sourceCardId === engine.findCardId(johnny, "trash", P1)),
    ).toBe(false);
  });

  it("does not ready from a tied fight even when Jackie keeps Johnny in the field", () => {
    const johnny = welcomeToNightCityRetailJohnnySilverhandNeverStopFighting;
    const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: johnny, spent: false, hasLag: false }],
        legendArea: [{ card: jackie, faceDown: false }],
        eddies: 1,
      },
      { field: [{ card: welcomeToNightCityRetailRocknRockerboy, spent: true }] },
    );
    engine.judgeSpendCard(jackie, { as: P1 });

    engine.attackUnit(johnny, welcomeToNightCityRetailRocknRockerboy, { as: P1 });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getPrompt(P1).choice?.type).toBe("redirectDefeat");
    engine.applyRedirectDefeat({ as: P1 });

    expect(engine.getEvents("attackResolved").at(-1)).toMatchObject({ result: "mutual" });
    expect(engine.getCard(johnny, "field", P1).meta.spent).toBe(true);
    expect(
      engine
        .getEvents("effectTriggered")
        .some((event) => event.sourceCardId === engine.findCardId(johnny, "field", P1)),
    ).toBe(false);
  });

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
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(false);
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

  it("resets the first-fight-win ready limit on the next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: true },
          { card: welcomeToNightCityRetailAugmentedNegotiators, spent: true },
          {
            card: welcomeToNightCityRetailYorinobuArasakaSteelDragon,
            spent: false,
            hasLag: false,
          },
          { card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false },
        ],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailOffdutyMalfini,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
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

    engine.skipToNextPlayerTurn(P1);
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveFullSteal({ as: P2 });
    engine.attackUnit(
      welcomeToNightCityRetailYorinobuArasakaSteelDragon,
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });
    engine.skipToNextPlayerTurn(P2);
    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(false);
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
    expect(
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(false);
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

    expect(engine.getEvents("attackResolved").at(-1)).toMatchObject({ attackKind: "direct" });

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
    expect(triggered.trigger).toMatchObject({
      trigger: "event",
      event: {
        event: "fightResolved",
        player: "any",
        winner: { selector: "self" },
      },
    });
  });
});
