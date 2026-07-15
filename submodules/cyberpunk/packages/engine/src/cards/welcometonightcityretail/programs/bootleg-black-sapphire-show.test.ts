import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailBootlegBlackSapphireShow,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog, stripPrivateFields } from "../../../logging/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Bootleg Black Sapphire Show", () => {
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
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailFieldOperator.id,
      welcomeToNightCityRetailSwordwiseHuscle.id,
    ]);
    expect(engine.getEddies(P1)).toBe(1);
    const sellFromDeckLog = result.moveLogs.find(
      (log) => log.type === "action" && log.messageKey === "effect.sellFromDeck.resolved",
    );
    if (sellFromDeckLog?.type !== "action") {
      throw new Error("Expected sell-from-deck action log");
    }
    expect(sellFromDeckLog?.params).toMatchObject({
      sourceCardName: "Bootleg Black Sapphire Show",
      soldCount: 1,
      soldCardNames: {
        __private: true,
        value: "Corpo Security",
        visibleTo: [P1],
      },
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
});
