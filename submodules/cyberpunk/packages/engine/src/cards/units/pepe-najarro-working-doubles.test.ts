import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailArasakaEmergencyRadioport,
  welcomeToNightCityRetailDetonate,
  welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailPepeNajarroWorkingDoubles,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../testing/index.ts";

const pepe = welcomeToNightCityRetailPepeNajarroWorkingDoubles;
const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;
const v = welcomeToNightCityRetailVStreetkid;
const adam = welcomeToNightCityRetailAdamSmasherEnderOfLegends;
const hanako = welcomeToNightCityRetailHanakoArasakaDaughterOfTheEmperor;
const faceplate = welcomeToNightCityRetailZetatechFaceplate;
const radioport = welcomeToNightCityRetailArasakaEmergencyRadioport;

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
  it("queues ATTACK with both spent triggers and can ready MERC Legends after Faceplate creates a value-pair", () => {
    // CR 11.21.2.1: spending the attacker and its ATTACK ability become pending together.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailDetonate],
        field: [{ card: pepe, spent: false, hasLag: false, attachedGears: [faceplate, radioport] }],
        legendArea: [
          { card: jackie, faceDown: false, spent: true },
          { card: v, faceDown: false, spent: true },
          { card: adam, faceDown: true, spent: true },
        ],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 3 },
          { dieType: "d10", faceValue: 4 },
        ],
      },
      undefined,
      { preserveDeckOrder: true },
    );
    engine.judgeSpendCard(jackie, { as: P1 });
    engine.judgeSpendCard(v, { as: P1 });
    engine.judgeSpendCard(adam, { as: P1 });

    engine.attackRival(pepe, { as: P1 });

    const pending = engine.getPrompt(P1).choice;
    expect(pending?.type).toBe("chooseTrigger");
    if (pending?.type !== "chooseTrigger") throw new Error("Expected simultaneous triggers");
    expect(pending.payload.options.map((option) => option.cardName)).toEqual(
      expect.arrayContaining([pepe.displayName, faceplate.displayName, radioport.displayName]),
    );
    expect(pending.payload.options).toHaveLength(3);

    const faceplateTrigger = pending.payload.options.find(
      (option) => option.cardName === faceplate.displayName,
    );
    if (!faceplateTrigger) throw new Error("Expected Faceplate trigger");
    engine.executeMove("resolveTrigger", { args: { triggerId: faceplateTrigger.triggerId } }, P1);
    const gigId = engine.findGigIdByType(P1, "d10");
    engine.resolveAdjustGig(gigId, 3, { as: P1 });

    expect(engine.getGigDice(P1).map((gig) => gig.faceValue)).toEqual([1, 2, 3, 3]);
    expect(engine.getHandCount(P1)).toBe(1);

    const afterFaceplate = engine.getPrompt(P1).choice;
    expect(afterFaceplate?.type).toBe("chooseTrigger");
    if (afterFaceplate?.type !== "chooseTrigger") throw new Error("Expected remaining triggers");
    const pepeTrigger = afterFaceplate.payload.options.find(
      (option) => option.cardName === pepe.displayName,
    );
    if (!pepeTrigger) throw new Error("Expected Pepe's ATTACK trigger");
    engine.executeMove("resolveTrigger", { args: { triggerId: pepeTrigger.triggerId } }, P1);

    const readyChoice = engine.getPrompt(P1).choice;
    expect(readyChoice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: { type: "effectTarget", min: 0, max: 2 },
    });
    engine.resolveEffectTargetIds(
      [engine.findCardId(jackie, "legendArea", P1), engine.findCardId(v, "legendArea", P1)],
      { as: P1, allowPendingChoice: true, reason: "Radioport still has its pending look choice" },
    );

    expect(engine.getCard(jackie, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(v, "legendArea", P1).meta.spent).toBe(false);
    expect(engine.getCard(adam, "legendArea", P1).meta.spent).toBe(true);
  });

  it("checks Pepe's value-pair when his pending ATTACK effect resolves", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: pepe, spent: false, hasLag: false, attachedGears: [faceplate] }],
      legendArea: [{ card: jackie, faceDown: false, spent: true }],
      gigArea: [
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 2 },
      ],
    });
    engine.judgeSpendCard(jackie, { as: P1 });

    engine.attackRival(pepe, { as: P1 });
    const pending = engine.getPrompt(P1).choice;
    if (pending?.type !== "chooseTrigger") throw new Error("Expected simultaneous triggers");
    expect(pending.payload.options).toHaveLength(2);
    const faceplateTrigger = pending.payload.options.find(
      (option) => option.cardName === faceplate.displayName,
    );
    if (!faceplateTrigger) throw new Error("Expected Faceplate trigger");
    engine.executeMove("resolveTrigger", { args: { triggerId: faceplateTrigger.triggerId } }, P1);
    engine.resolveAdjustGig(engine.findGigIdByType(P1, "d8"), 3, { as: P1 });

    expect(engine.getGigDice(P1).map((gig) => gig.faceValue)).toEqual([2, 3]);
    engine.expectNoPendingChoice();
    expect(engine.getCard(jackie, "legendArea", P1).meta.spent).toBe(true);
  });

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
