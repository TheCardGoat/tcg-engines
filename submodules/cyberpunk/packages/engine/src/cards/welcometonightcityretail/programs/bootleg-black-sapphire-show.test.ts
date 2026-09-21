import { describe, expect, it } from "vite-plus/test";
import { create } from "mutative";
import {
  welcomeToNightCityRetailAfterpartyAtLizzieS,
  welcomeToNightCityRetailBootlegBlackSapphireShow,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog, stripPrivateFields } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2, expectNotSellable } from "../../../testing/index.ts";

describe("Bootleg Black Sapphire Show", () => {
  it("is a 5-cost yellow Braindance Program with RAM 4 and a Sell Tag", () => {
    expect(welcomeToNightCityRetailBootlegBlackSapphireShow).toMatchObject({
      type: "program",
      color: "yellow",
      classifications: ["Braindance"],
      cost: 5,
      power: null,
      ram: 4,
      hasSellTag: true,
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
    });
    expect(welcomeToNightCityRetailBootlegBlackSapphireShow.abilities).toHaveLength(1);
  });

  it("sells the top card of the deck and draws 2 with even and odd friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailBootlegBlackSapphireShow],
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailSwordwiseHuscle,
      ],
      eddies: 5,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 3 },
      ],
    });
    const soldCard = engine.findDeckCard(welcomeToNightCityRetailCorpoSecurity);
    const firstDraw = engine.findDeckCard(welcomeToNightCityRetailFieldOperator);
    const secondDraw = engine.findDeckCard(welcomeToNightCityRetailSwordwiseHuscle);
    engine.judgeStackDeck([soldCard, firstDraw, secondDraw], { as: P1 });

    const result = engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });

    expect(engine.getCardsInZone("eddieArea", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("eddieArea", P1)[0]?.meta).toMatchObject({
      faceDown: true,
      revealed: true,
      spent: false,
    });
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFieldOperator.id,
      welcomeToNightCityRetailSwordwiseHuscle.id,
    ]);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailBootlegBlackSapphireShow.id,
    );
    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getState().G.players[P1]!.soldThisTurn).toBe(true);
    const sellFromDeckLog = result.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "effect.sellFromDeck.resolved",
    );
    if (sellFromDeckLog?.type !== "action") {
      throw new Error("Expected sell-from-deck action log");
    }
    expect(sellFromDeckLog?.params).toMatchObject({
      sourceCardName: "Bootleg Black Sapphire Show",
      soldCount: 1,
      soldCardNames: "Corpo Security",
    });
    const visibleSellFromDeckLog = stripPrivateFields(sellFromDeckLog, P1);
    expect(
      visibleSellFromDeckLog
        ? formatActionLog(
            {
              type: "actionLog",
              messageKey: visibleSellFromDeckLog.messageKey,
              params: visibleSellFromDeckLog.params,
              playerId: visibleSellFromDeckLog.playerId,
            },
            enMessages,
          )
        : "",
    ).toBe("Bootleg Black Sapphire Show sold Corpo Security from the top of the deck.");

    const drawLog = result.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "effect.draw.resolved",
    );
    if (drawLog?.type !== "action") {
      throw new Error("Expected draw action log");
    }
    expect(drawLog?.params).toMatchObject({
      sourceCardName: "Bootleg Black Sapphire Show",
      drawnCount: 2,
      drawnCardNames: {
        __private: true,
        value: "Field Operator, Swordwise Huscle",
        visibleTo: [P1],
      },
    });
    const visibleDrawLog = stripPrivateFields(drawLog, P1);
    expect(
      visibleDrawLog
        ? formatActionLog(
            {
              type: "actionLog",
              messageKey: visibleDrawLog.messageKey,
              params: visibleDrawLog.params,
              playerId: visibleDrawLog.playerId,
            },
            enMessages,
          )
        : "",
    ).toBe("Bootleg Black Sapphire Show drew 2 card(s).");
    expect(stripPrivateFields(drawLog, P2)?.params).toMatchObject({
      sourceCardName: "Bootleg Black Sapphire Show",
      drawnCount: 2,
    });
    expect(stripPrivateFields(drawLog, P2)?.params).not.toHaveProperty("drawnCardNames");
    expect(stripPrivateFields(sellFromDeckLog, P2)?.params).toMatchObject({
      sourceCardName: "Bootleg Black Sapphire Show",
      soldCount: 1,
      soldCardNames: "Corpo Security",
    });
  });

  it("still sells the top card but does not draw without both even and odd friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailBootlegBlackSapphireShow],
      deck: [
        welcomeToNightCityRetailCorpoSecurity,
        welcomeToNightCityRetailFieldOperator,
        welcomeToNightCityRetailSwordwiseHuscle,
      ],
      eddies: 5,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 4 },
      ],
    });
    const soldCard = engine.findDeckCard(welcomeToNightCityRetailCorpoSecurity);
    engine.judgeStackDeck([soldCard], { as: P1 });
    const deckCountBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });

    expect(engine.getCardsInZone("eddieArea", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckCountBefore - 1);
  });

  it("does not count a rival odd Gig toward the friendly parity condition", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBootlegBlackSapphireShow],
        deck: [
          welcomeToNightCityRetailCorpoSecurity,
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailSwordwiseHuscle,
        ],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );
    const soldCard = engine.findDeckCard(welcomeToNightCityRetailCorpoSecurity);
    engine.judgeStackDeck([soldCard], { as: P1 });
    const deckCountBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckCountBefore - 1);
  });

  it("uses the Sell action for the turn even when the Sell came from the Program effect", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [
        welcomeToNightCityRetailBootlegBlackSapphireShow,
        welcomeToNightCityRetailAfterpartyAtLizzieS,
      ],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 5,
    });

    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });

    expectNotSellable(engine, welcomeToNightCityRetailAfterpartyAtLizzieS, { as: P1 });
  });

  it("loses when its conditional draw reaches an empty deck after selling the last card", () => {
    const fixtureEngine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailBootlegBlackSapphireShow],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 5,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 3 },
      ],
    });
    const soldCard = fixtureEngine.findDeckCard(welcomeToNightCityRetailCorpoSecurity);
    fixtureEngine.judgeStackDeck([soldCard], { as: P1 });
    const exactDeckState = create(fixtureEngine.getState(), (draft) => {
      const player = draft.G.players[P1]!;
      const [topCardId, ...fillerIds] = player.zones.deck;
      if (!topCardId) throw new Error("Expected a top card");
      player.zones.deck = [topCardId];
      for (const fillerId of fillerIds) {
        const filler = draft.G.cardIndex[fillerId as string];
        if (filler) filler.zone = "trash";
        player.zones.trash.push(fillerId);
      }
    });
    const engine = CyberpunkTestEngine.fromState(exactDeckState);

    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });

    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P2);
    expect(engine.getWinReason()).toBe("deck_out_victory");
  });
});
