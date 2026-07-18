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
  it("draws 1, then discards 1 the first time it spends to attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorpoSecurity],
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
        hand: [welcomeToNightCityRetailCorpoSecurity],
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
});
