import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailGunpointDiplomacy,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailJudyAlvarezNothingToDoubt,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
  welcomeToNightCityRetailWeGottaLiveTogether,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../src/active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: effect choices and spend-icon conditions", () => {
  it("skips a required choice when no legal target exists", () => {
    cover("10.31.1", "10.6.2", "10.7");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    const handBefore = engine.getHandCount(P1);
    expect(engine.playCard(welcomeToNightCityRetailFloorIt, { as: P1 })).toBeSuccessfulCommand();
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getHandCount(P1)).toBe(handBefore);
  });

  it("checks a Spend-icon condition at activation and resolution", () => {
    cover("11.15.3.1", "10.3.2");
    const withGig = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      field: [
        {
          card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
          spent: false,
          hasLag: false,
        },
      ],
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });
    const handBeforeHit = withGig.getHandCount(P1);
    expect(
      withGig.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 }),
    ).toBeSuccessfulCommand();
    expect(withGig.getHandCount(P1)).toBe(handBeforeHit + 2);

    const withoutGig = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
      field: [
        {
          card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
          spent: false,
          hasLag: false,
        },
      ],
      gigArea: [{ dieType: "d10", faceValue: 7 }],
    });
    const handBeforeMiss = withoutGig.getHandCount(P1);
    const failure = withoutGig.expectFailure(() =>
      withoutGig.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, {
        as: P1,
      }),
    );
    expect(failure.errorCode).toBe("NO_VALID_TARGETS");
    expect(withoutGig.getHandCount(P1)).toBe(handBeforeMiss);
    expect(
      withoutGig.getCard(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, "field", P1).meta
        .spent,
    ).toBe(false);
  });

  it("resolves a Spend-icon effect before a played card's pending Play trigger", () => {
    cover("11.15.3.2", "10.14", "10.2.4");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailJudyAlvarezNothingToDoubt, spent: false, hasLag: false },
        ],
        deck: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailFieldOperator],
        eddies: 1,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }] },
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    expect(
      engine.activateAbility(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, 0, { as: P1 }),
    ).toBeSuccessfulCommand();
    expect(
      engine.getCard(welcomeToNightCityRetailJudyAlvarezNothingToDoubt, "field", P1).meta.spent,
    ).toBe(true);
    const afterSpend = engine.getState().G.turnMetadata.pendingChoice;
    expect(afterSpend?.type).toBe("chooseCardToPlay");
    engine.executeMove(
      "resolveCardToPlay",
      {
        args: {
          cardId: engine.findCardId(welcomeToNightCityRetailFloorIt, "trash", P1) as string,
        },
      },
      P1,
    );
    const afterPlay = engine.getState().G.turnMetadata.pendingChoice;
    expect(afterPlay?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1, zone: "field" });
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
  });

  it("makes sequential choices in written order, then lets the Rival choose", () => {
    cover("10.32");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailGunpointDiplomacy],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 4,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      { gigArea: [{ dieType: "d10", faceValue: 9 }] },
    );
    engine.playCard(welcomeToNightCityRetailGunpointDiplomacy, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    expect(engine.getState().G.turnMetadata.pendingChoice?.chooserId).toBe(P1);
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, {
      as: P1,
      allowPendingChoice: true,
      reason: "Rival still chooses which Gunpoint Diplomacy effect applies",
    });
    const rivalChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(rivalChoice?.type).toBe("chooseEffect");
    expect(rivalChoice?.chooserId).toBe(P2);
    engine.resolveChooseEffect("plus-power", { as: P2 });
    const unit = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    expect(getEffectivePower(engine.getState(), unit.instanceId as string)).toBe(
      (welcomeToNightCityRetailFieldOperator.power ?? 0) + 3,
    );
  });

  it("plays up to two trash Units as two consecutive choices", () => {
    cover("10.32");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailWeGottaLiveTogether],
        trash: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailFieldOperator],
        eddies: 3,
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    engine.spendAllLegends();
    engine.playCard(welcomeToNightCityRetailWeGottaLiveTogether, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    const firstId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "trash", P1);
    engine.executeMove("resolveCardToPlay", { args: { cardId: firstId as string } }, P1);
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseCardToPlay");
    const secondId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "trash", P1);
    engine.executeMove("resolveCardToPlay", { args: { cardId: secondId as string } }, P1);
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailCorpoSecurity.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
  });

  it("pays multiple activation costs in written order", () => {
    cover("10.19.3", "10.20", "10.20.3", "10.20.4", "10.20.6");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      legendArea: [
        {
          card: welcomeToNightCityRetailJackieWellesMamaSFavorite,
          faceDown: false,
          spent: false,
        },
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 0,
    });
    engine.spendAllLegends();
    const jackieId = engine.findCardId(
      welcomeToNightCityRetailJackieWellesMamaSFavorite,
      "legendArea",
      P1,
    );
    const goroId = engine.findCardId(
      welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
      "legendArea",
      P1,
    );
    engine.judgeSetCardMeta(jackieId, { spent: false });
    engine.judgeSetCardMeta(goroId, { spent: false });
    const spentBefore = engine.getEvents("cardSpent").length;
    engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 });
    expect(
      engine
        .getEvents("cardSpent")
        .slice(spentBefore)
        .map((event) => event.cardId),
    ).toEqual([jackieId, goroId]);
    expect(
      engine.getCard(welcomeToNightCityRetailJackieWellesMamaSFavorite, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("cannot activate an effect that needs a target when none exist", () => {
    cover("10.8");
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 1,
    });
    engine.spendAllLegends();
    engine.judgeSetCardMeta(
      engine.findCardId(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1),
      { spent: false },
    );
    const failure = engine.expectFailure(() =>
      engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 }),
    );
    expect(failure.success).toBe(false);
  });
});
