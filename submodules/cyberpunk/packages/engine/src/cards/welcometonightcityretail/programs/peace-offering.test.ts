import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailPeaceOffering,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const peaceOffering = welcomeToNightCityRetailPeaceOffering;

describe("Peace Offering", () => {
  it("has the exact printed identity and ordered optional Gig-copy ability", () => {
    expect(peaceOffering).toMatchObject({
      canonicalId: "peace-offering",
      slug: "peace-offering",
      name: "Peace Offering",
      displayName: "Peace Offering",
      type: "program",
      color: "green",
      classifications: ["Braindance"],
      cost: 1,
      power: null,
      ram: 1,
      hasSellTag: true,
      timingTriggers: ["play"],
      printNumber: "101",
      rarity: "Common",
      rulesText:
        "You may set a Gig's value to the value of another Gig. Then, if you control a value-pair, draw 1.",
      reminderText: ["Discard programs after they resolve."],
    });
    expect(peaceOffering.abilities).toMatchObject([
      {
        kind: "triggered",
        trigger: { trigger: "play" },
        source: { selector: "self" },
        bindings: [
          {
            id: "selectedGigs",
            target: {
              selector: "gig",
              amount: 2,
              selection: {
                mode: "choose",
                min: 2,
                max: 2,
                canDecline: true,
                pairConstraint: "gig-copy",
              },
            },
          },
        ],
        effects: [
          {
            effect: "copyGigValue",
            source: { selector: "bound", id: "selectedGigs", index: 0 },
            target: { selector: "bound", id: "selectedGigs", index: 1 },
            optional: true,
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [{ condition: "hasGigPair", controller: "friendly" }],
          },
        ],
      },
    ]);
  });

  it("offers every Gig in an exact, declineable, ordered two-Gig choice", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [peaceOffering],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 6 },
        ],
      },
      { gigArea: [{ dieType: "d8", faceValue: 5 }] },
    );
    engine.playCard(peaceOffering, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice).toMatchObject({
      type: "chooseTarget",
      chooserId: P1,
      payload: {
        type: "effectTarget",
        targetKind: "gig",
        min: 2,
        max: 2,
        canDecline: true,
        pairConstraint: "gig-copy",
      },
    });
    if (choice?.type !== "chooseTarget") throw new Error("Expected a Gig choice");
    expect(choice.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        ...engine.getGigDice(P1).map((die) => die.id),
        ...engine.getGigDice(P2).map((die) => die.id),
      ]),
    );
  });

  it("plays for exactly 1 Eddie when no Legend can contribute to payment", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [peaceOffering],
      eddies: 1,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 5 },
      ],
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(peaceOffering, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeDefined();
  });

  it("uses the first selected Gig as source, can target either player, and draws for the resulting friendly pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [peaceOffering],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 4 }] },
      { preserveDeckOrder: true },
    );
    engine.playCard(peaceOffering, { as: P1 });
    const rivalSource = engine.findGigIdByType(P2, "d4");
    const friendlyTarget = engine.findGigIdByType(P1, "d6");
    engine.resolveEffectTargetIds([rivalSource, friendlyTarget], { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.id === friendlyTarget)?.faceValue).toBe(4);
    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1)[0]?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      peaceOffering.id,
    );
  });

  it("may decline the copy and still performs the following value-pair draw", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [peaceOffering],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 5 },
          { dieType: "d10", faceValue: 7 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );
    const valuesBefore = engine.getGigDice(P1).map((die) => die.faceValue);
    engine.playCard(peaceOffering, { as: P1 });
    expect(engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1)).toMatchObject({
      success: true,
    });

    expect(engine.getGigDice(P1).map((die) => die.faceValue)).toEqual(valuesBefore);
    expect(engine.getHandCount(P1)).toBe(1);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("auto-skips an impossible copy but still draws from an existing pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [peaceOffering],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.playCard(peaceOffering, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getGigDice(P1).map((die) => die.faceValue)).toEqual([3, 3]);
    expect(engine.getHandCount(P1)).toBe(1);
  });

  it("does not draw when the copy leaves friendly Gigs without a value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [peaceOffering],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 5 },
        ],
      },
      { preserveDeckOrder: true },
    );
    engine.playCard(peaceOffering, { as: P1 });
    engine.resolveEffectTargetIds(
      [engine.findGigIdByType(P2, "d4"), engine.findGigIdByType(P2, "d6")],
      { as: P1 },
    );

    expect(engine.getGigDice(P2).find((die) => die.dieType === "d6")?.faceValue).toBe(2);
    expect(engine.getHandCount(P1)).toBe(0);
  });

  it("rejects selecting two Gigs that already have the same value", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [peaceOffering],
      eddies: 1,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 5 },
      ],
    });
    engine.playCard(peaceOffering, { as: P1 });
    const sameValueIds = engine
      .getGigDice(P1)
      .filter((die) => die.faceValue === 2)
      .map((die) => die.id);

    const failure = engine.executeMove(
      "resolveEffectTarget",
      { args: { targetIds: sameValueIds } },
      P1,
    );
    expect(failure).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeDefined();
  });

  it("rejects copying a value that is not on the target Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [peaceOffering],
      eddies: 1,
      gigArea: [
        { dieType: "d6", faceValue: 5 },
        { dieType: "d4", faceValue: 4 },
        { dieType: "d8", faceValue: 2 },
      ],
    });
    engine.playCard(peaceOffering, { as: P1 });
    const source = engine.findGigIdByType(P1, "d6");
    const target = engine.findGigIdByType(P1, "d4");

    const failure = engine.executeMove(
      "resolveEffectTarget",
      { args: { targetIds: [source, target] } },
      P1,
    );
    expect(failure).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
    expect(engine.getGigDice(P1).find((die) => die.id === target)?.faceValue).toBe(4);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeDefined();
  });
});
