import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailPepeNajarroWorkingDoubles,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

const pepe = welcomeToNightCityRetailPepeNajarroWorkingDoubles;
const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;
const v = welcomeToNightCityRetailVStreetkid;
const adam = welcomeToNightCityRetailAdamSmasherEnderOfLegends;
const hanako = welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor;

function pairFixture() {
  const engine = CyberpunkTestEngine.createWithFixture({
    field: [{ card: pepe, spent: false, hasLag: false }],
    legendArea: [
      { card: jackie, faceDown: false, spent: true },
      { card: v, faceDown: false, spent: true },
      { card: adam, faceDown: true, spent: true },
    ],
    gigArea: [
      { dieType: "d6", faceValue: 3 },
      { dieType: "d8", faceValue: 3 },
    ],
  });
  engine.judgeSpendCard(jackie, { as: P1 });
  engine.judgeSpendCard(v, { as: P1 });
  engine.judgeSpendCard(adam, { as: P1 });
  return engine;
}

describe("Pepe Najarro — Working Doubles", () => {
  it("has the exact printed identity and conditional up-to-two ready ability", () => {
    expect(pepe).toMatchObject({
      canonicalId: "pepe-najarro-working-doubles",
      slug: "pepe-najarro-working-doubles",
      name: "Pepe Najarro",
      subname: "Working Doubles",
      displayName: "Pepe Najarro: Working Doubles",
      type: "unit",
      color: "green",
      classifications: ["Valentino"],
      cost: 4,
      power: 6,
      ram: 2,
      hasSellTag: false,
      printNumber: "086",
      rarity: "Uncommon",
      rulesText:
        "{Attack} If you control a value-pair of Gigs, ready up to 2 MERC Legends in your Legends area.",
    });
    expect(pepe.abilities).toMatchObject([
      {
        kind: "triggered",
        trigger: { trigger: "attack" },
        source: { selector: "self" },
        effects: [
          {
            effect: "ready",
            target: {
              selector: "card",
              controller: "friendly",
              zones: ["legendArea"],
              cardTypes: ["legend"],
              classifications: ["Merc"],
              state: "spent",
              face: "faceUp",
              selection: { mode: "choose", min: 0, max: 2 },
            },
            conditions: [{ condition: "hasGigPair", controller: "friendly" }],
          },
        ],
      },
    ]);
  });

  it("plays for exactly 4 Eddies and enters the field with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({ hand: [pepe], eddies: 4 });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(pepe, { as: P1 });

    expect(engine.getCard(pepe, "field", P1).meta.hasLag).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("with a value-pair offers exactly the spent face-up MERC Legends", () => {
    const engine = pairFixture();
    engine.attackRival(pepe, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: { type: "effectTarget", min: 0, max: 2, canDecline: true },
    });
    if (choice?.type !== "chooseTarget") throw new Error("Expected a Legend choice");
    expect(choice.payload.eligibleIds).toHaveLength(2);
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(jackie, "legendArea", P1),
        engine.findCardId(v, "legendArea", P1),
      ]),
    );
  });

  it("can choose both eligible MERC Legends and readies both", () => {
    const engine = pairFixture();
    engine.attackRival(pepe, { as: P1 });
    const ids = [
      engine.findCardId(jackie, "legendArea", P1),
      engine.findCardId(v, "legendArea", P1),
    ];

    engine.resolveEffectTargetIds(ids, { as: P1 });

    expect(engine.getCard(jackie, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(v, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(adam, "legendArea", P1).meta.spent).toBe(true);
  });

  it("can choose only one and leaves the other eligible Legend spent", () => {
    const engine = pairFixture();
    engine.attackRival(pepe, { as: P1 });
    engine.resolveEffectTargetIds([engine.findCardId(jackie, "legendArea", P1)], { as: P1 });

    expect(engine.getCard(jackie, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(v, "legendArea", P1).meta.spent).toBe(true);
  });

  it("can choose zero and leaves both eligible Legends spent", () => {
    const engine = pairFixture();
    engine.attackRival(pepe, { as: P1 });

    expect(
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [] } }, P1),
    ).toMatchObject({ success: true });
    expect(engine.getCard(jackie, "legendArea", P1).meta.spent).toBe(true);
    expect(engine.getCard(v, "legendArea", P1).meta.spent).toBe(true);
  });

  it("does not trigger the ready choice without a friendly value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: pepe, spent: false, hasLag: false }],
      legendArea: [{ card: jackie, faceDown: false, spent: true }],
      gigArea: [
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 3 },
      ],
    });
    engine.judgeSpendCard(jackie, { as: P1 });

    engine.attackRival(pepe, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCard(jackie, "legendArea", P1).meta.spent).toBe(true);
  });

  it("excludes ready MERC and spent non-MERC Legends", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: pepe, spent: false, hasLag: false }],
      legendArea: [
        { card: jackie, faceDown: false, spent: true },
        { card: v, faceDown: false, spent: false },
        { card: hanako, faceDown: false, spent: true },
      ],
      gigArea: [
        { dieType: "d6", faceValue: 4 },
        { dieType: "d8", faceValue: 4 },
      ],
    });
    engine.judgeSpendCard(jackie, { as: P1 });
    engine.judgeSpendCard(hanako, { as: P1 });
    engine.attackRival(pepe, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type !== "chooseTarget") throw new Error("Expected a Legend choice");

    expect(choice.payload.eligibleIds).toEqual([engine.findCardId(jackie, "legendArea", P1)]);
  });

  it("excludes a face-up spent MERC Legend on the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        { card: pepe, spent: false, hasLag: false },
        { card: adam, faceDown: false, spent: true, hasLag: false },
      ],
      legendArea: [
        { card: jackie, faceDown: false, spent: true },
        { card: hanako, faceDown: false, spent: true },
      ],
      gigArea: [
        { dieType: "d6", faceValue: 4 },
        { dieType: "d8", faceValue: 4 },
      ],
    });
    engine.judgeSpendCard(jackie, { as: P1 });
    engine.judgeSpendCard(hanako, { as: P1 });
    engine.attackRival(pepe, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type !== "chooseTarget") throw new Error("Expected a Legend choice");

    expect(choice.payload.eligibleIds).toEqual([engine.findCardId(jackie, "legendArea", P1)]);
  });
});
