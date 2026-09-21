import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

function expectRitaDrawThenDiscard(engine: CyberpunkTestEngine): void {
  expect(engine.getCardsInZone("hand", P1)).toContainEqual(
    expect.objectContaining({ definitionId: welcomeToNightCityRetailCorpoSecurity.id }),
  );
  expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
  expect(engine.getState().G.turnMetadata.pendingChoice?.payload).toMatchObject({
    type: "discardFromHand",
  });

  engine.resolveDiscardFromHand([welcomeToNightCityRetailCorpoSecurity], { as: P1 });

  expect(engine.getCardsInZone("hand", P1)).toHaveLength(1);
  expect(engine.getCardsInZone("trash", P1)).toContainEqual(
    expect.objectContaining({ definitionId: welcomeToNightCityRetailCorpoSecurity.id }),
  );
  expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
}

describe("Rita Wheeler — No Stupid Questions", () => {
  it("has the exact printed identity, BLOCKER, and first-spend ordered trigger", () => {
    expect(welcomeToNightCityRetailRitaWheelerNoStupidQuestions).toMatchObject({
      canonicalId: "rita-wheeler-no-stupid-questions",
      slug: "rita-wheeler-no-stupid-questions",
      name: "Rita Wheeler",
      subname: "No Stupid Questions",
      displayName: "Rita Wheeler: No Stupid Questions",
      type: "unit",
      color: "blue",
      classifications: ["Ganger", "Mox"],
      cost: 4,
      power: 4,
      ram: 2,
      hasSellTag: false,
      printNumber: "125",
      rarity: "Common",
      keywords: ["blocker"],
      rulesText:
        "{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)\nThe first time this Unit is spent each turn, draw 1, then discard 1.",
      abilities: [
        { kind: "keyword", keyword: "blocker", source: { selector: "self" } },
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: { event: "cardSpent", player: "friendly", target: { selector: "self" } },
          },
          source: { selector: "self" },
          limits: ["firstTimeEachTurn"],
          effects: [
            { effect: "draw", player: "friendly", amount: 1 },
            { effect: "discardFromHand", player: "friendly", amount: 1 },
          ],
        },
      ],
    });
  });

  it("pays exactly 4 Eddies and enters the field with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailRitaWheelerNoStupidQuestions],
      eddies: 4,
    });
    for (const legend of engine.getCardsInZone("legendArea", P1)) {
      engine.judgeSpendCard(legend, { as: P1 });
    }

    engine.playCard(welcomeToNightCityRetailRitaWheelerNoStupidQuestions, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailRitaWheelerNoStupidQuestions, "field", P1).meta.hasLag,
    ).toBe(true);
  });

  it("draws 1, then discards 1 the first time it spends to attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [embracingPowerRetailStarterDeckMinotaur],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
            spent: false,
            hasLag: false,
          },
        ],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
      { preserveDeckOrder: true },
    );

    engine.attackRival(welcomeToNightCityRetailRitaWheelerNoStupidQuestions, { as: P1 });

    expectRitaDrawThenDiscard(engine);
  });

  it("draws 1, then discards 1 the first time it spends as a BLOCKER", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [embracingPowerRetailStarterDeckMinotaur],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: welcomeToNightCityRetailRitaWheelerNoStupidQuestions, spent: false }],
      },
      {
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false, hasLag: false }],
      },
      { preserveDeckOrder: true },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackRival(embracingPowerRetailStarterDeckMinotaur, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailRitaWheelerNoStupidQuestions, { as: P1 });

    expectRitaDrawThenDiscard(engine);
  });

  it("does not trigger again when readied and spent a second time in the same turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [embracingPowerRetailStarterDeckMinotaur],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false },
        ],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expectRitaDrawThenDiscard(engine);
    engine.resolveFullFight({ as: P1 });
    engine.judgeReadyCard(welcomeToNightCityRetailRitaWheelerNoStupidQuestions, { as: P1 });
    const handBefore = engine.getHandCount(P1);
    const deckBefore = engine.getCardsInZone("deck", P1).length;

    engine.attackUnit(
      welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckBefore);
  });

  it("resets the first-spend limit on its controller's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [embracingPowerRetailStarterDeckMinotaur],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
        field: [
          {
            card: welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false },
        ],
      },
      { preserveDeckOrder: true },
    );
    engine.attackUnit(
      welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expectRitaDrawThenDiscard(engine);
    engine.resolveFullFight({ as: P1 });
    engine.completeTurn();
    engine.completeTurn();
    engine.judgeSpendCard(welcomeToNightCityRetailCorpoSecurity, { as: P2 });

    engine.attackUnit(
      welcomeToNightCityRetailRitaWheelerNoStupidQuestions,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );

    expect(engine.getState().G.turnMetadata.pendingChoice).toMatchObject({
      type: "chooseTarget",
      payload: { type: "discardFromHand" },
    });
  });
});
