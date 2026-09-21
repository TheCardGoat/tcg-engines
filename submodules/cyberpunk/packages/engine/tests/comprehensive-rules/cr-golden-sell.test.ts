import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailBootlegBlackSapphireShow,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailJudyAlvarezBraindanceMaestro,
  welcomeToNightCityRetailMaxtacSuppressionTeam,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailValentinoGuerrera,
} from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackPair,
  expectNotAttackCandidate,
  registerMatchers,
} from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: golden rules, sell effects, activation", () => {
  it("lets card text override the ready-Unit attack restriction", () => {
    cover("2.5");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailValentinoGuerrera, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );
    expectAttackPair(
      engine,
      welcomeToNightCityRetailValentinoGuerrera,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailValentinoGuerrera,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    ).toBeSuccessfulCommand();
  });

  it("lets a preventing effect stop ADRENALINE from attacking on the played turn", () => {
    cover("2.6", "11.22");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailMaxtacSuppressionTeam,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        hand: [welcomeToNightCityRetailRidingNomad],
        eddies: 5,
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.playCard(welcomeToNightCityRetailRidingNomad, { as: P2 });
    expectNotAttackCandidate(engine, welcomeToNightCityRetailRidingNomad, { as: P2 });
  });

  it("sells a deck card without a Sell Tag, in order, as the Sell action", () => {
    cover("2.3", "11.9.2.1", "11.9.2.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBootlegBlackSapphireShow, welcomeToNightCityRetailFloorIt],
        deck: [
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailSketchyRipper,
          welcomeToNightCityRetailCorpoSecurity,
        ],
        eddies: 5,
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    const sold = engine.findDeckCard(welcomeToNightCityRetailFieldOperator);
    const firstDraw = engine.findDeckCard(welcomeToNightCityRetailSketchyRipper);
    const secondDraw = engine.findDeckCard(welcomeToNightCityRetailCorpoSecurity);
    engine.judgeStackDeck([sold, firstDraw, secondDraw], { as: P1 });
    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });
    expect(
      engine
        .getCardsInZone("eddieArea", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailSketchyRipper.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(false);
    expect(welcomeToNightCityRetailFieldOperator.hasSellTag).toBe(false);
    const blocked = engine.expectFailure(() =>
      engine.sellCard(welcomeToNightCityRetailFloorIt, { as: P1 }),
    );
    expect(blocked.errorCode).toBe("ALREADY_SOLD");
  });

  it("loses when Draw X tries to draw past the last remaining card", () => {
    cover("11.5.2.3", "1.9");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailBootlegBlackSapphireShow],
      deck: 3,
      eddies: 5,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 3 },
      ],
    });
    engine.spendAllLegends();
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(2);
    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });
    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P2);
    expect(engine.getWinReason()).toBe("deck_out_victory");
  });

  it("lets a face-up Legend pay an activation cost, and refuses a face-down Legend", () => {
    cover("5.7.6", "11.1.1.2", "2.2", "10.18", "10.19.1", "10.20.1");
    const faceUp = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 1,
    });
    expect(
      faceUp.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 }),
    ).toBeSuccessfulCommand();

    const faceDown = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailJudyAlvarezBraindanceMaestro,
          faceDown: true,
          spent: false,
        },
      ],
    });
    const hidden = faceDown.executeMove(
      "activateAbility",
      {
        args: {
          cardId: faceDown.findCardId(
            welcomeToNightCityRetailJudyAlvarezBraindanceMaestro,
            "legendArea",
            P1,
          ) as string,
          abilityIndex: 1,
        },
      },
      P1,
    );
    expect(hidden.success).toBe(false);
    if (hidden.success) throw new Error("expected face-down Legend activation to fail");
    expect(hidden.errorCode).toBe("LEGEND_FACE_DOWN");
  });
});
