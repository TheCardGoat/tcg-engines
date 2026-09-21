import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailBootlegBlackSapphireShow,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailTheRelicExperimentalBiochip,
  welcomeToNightCityRetailTowerfall,
  welcomeToNightCityRetailWeGottaLiveTogether,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../src/active-effects/index.ts";
import { computeEffectiveCost } from "../../src/moves/compute-effective-cost.ts";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: negative power, replacement cost, pending lockout", () => {
  it("treats a negative modified power as 0 for comparisons", () => {
    cover("2.10", "2.10.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTowerfall],
        eddies: 6,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );
    engine.playCard(welcomeToNightCityRetailTowerfall, { as: P1 });
    engine.resolveChooseEffect("power-down", { as: P1 });
    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(welcomeToNightCityRetailFieldOperator.power).toBe(2);
    expect(
      engine
        .getState()
        .G.activeEffects.some(
          (effect) =>
            effect.kind === "powerModifier" &&
            effect.targetCardId === operator.instanceId &&
            effect.powerModifier === -5,
        ),
    ).toBe(true);
    expect(getEffectivePower(engine.getState(), operator.instanceId as string)).toBe(0);
  });

  it("bottom-decks an equipped Unit and its Gear together without an order prompt", () => {
    cover("4.12.3");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTowerfall],
        eddies: 6,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
    );
    engine.playCard(welcomeToNightCityRetailTowerfall, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseEffect") {
      engine.resolveChooseEffect("both", { as: P1 });
    }
    expect(
      engine
        .getCardsInZone("field", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("deck", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("deck", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailMantisBlades.id),
    ).toBe(true);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("pays a replacement cost instead of the printed cost", () => {
    cover("11.1.2.1");
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
    const id = engine.findCardId(welcomeToNightCityRetailWeGottaLiveTogether, "hand", P1);
    expect(welcomeToNightCityRetailWeGottaLiveTogether.cost).toBe(5);
    expect(computeEffectiveCost(engine.getState(), id, P1)).toBe(3);
    engine.playCard(welcomeToNightCityRetailWeGottaLiveTogether, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(welcomeToNightCityRetailWeGottaLiveTogether.cost).toBe(5);
  });

  it("undoes an invalid play and returns to the previous legal state", () => {
    cover("11.4.1.2");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailWeGottaLiveTogether],
      legendArea: [],
      eddies: 3,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
    });
    engine.spendAllLegends();
    const eddiesBefore = engine.getEddies(P1);
    const failure = engine.expectFailure(() =>
      engine.playCard(welcomeToNightCityRetailWeGottaLiveTogether, { as: P1 }),
    );
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getEddies(P1)).toBe(eddiesBefore);
    expect(
      engine
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailWeGottaLiveTogether.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailWeGottaLiveTogether.id),
    ).toBe(false);
  });

  it("allows any number of Eddies and further effect sells after a hand sell", () => {
    cover("5.8.2.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailBootlegBlackSapphireShow, welcomeToNightCityRetailFloorIt],
        deck: [
          welcomeToNightCityRetailFieldOperator,
          welcomeToNightCityRetailCorpoSecurity,
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
    engine.sellCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    const sold = engine.findDeckCard(welcomeToNightCityRetailFieldOperator);
    const firstDraw = engine.findDeckCard(welcomeToNightCityRetailCorpoSecurity);
    const secondDraw = engine
      .getCardsInZone("deck", P1)
      .find(
        (card) => card.instanceId !== sold.instanceId && card.instanceId !== firstDraw.instanceId,
      );
    engine.judgeStackDeck(secondDraw ? [sold, firstDraw, secondDraw] : [sold, firstDraw], {
      as: P1,
    });
    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });
    expect(engine.getCardsInZone("eddieArea", P1).length).toBeGreaterThanOrEqual(2);
  });

  it("places more than one Unit in the field area", () => {
    cover("5.6.5");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFieldOperator, welcomeToNightCityRetailCorpoSecurity],
      eddies: 5,
    });
    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.playCard(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(
      engine
        .getCardsInZone("field", P1)
        .filter(
          (c) =>
            c.definitionId === welcomeToNightCityRetailFieldOperator.id ||
            c.definitionId === welcomeToNightCityRetailCorpoSecurity.id,
        ),
    ).toHaveLength(2);
  });

  it("cannot activate another effect while the current one is still resolving", () => {
    cover("10.2.3", "10.18.1", "10.11", "10.11.1", "10.11.2", "10.11.3");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailIndustrialAssembly],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      eddies: 2,
      gigArea: [{ dieType: "d8", faceValue: 4 }],
    });
    engine.spendAllLegends();
    engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the new face value",
    });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeDefined();
    const blocked = engine.executeMove(
      "activateAbility",
      {
        args: {
          cardId: engine.findCardId(
            welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            "legendArea",
            P1,
          ) as string,
          abilityIndex: 1,
        },
      },
      P1,
    );
    expect(blocked.success).toBe(false);
    engine.resolveAdjustGig(8, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    engine.judgeSetCardMeta(
      engine.findCardId(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1),
      { spent: false },
    );
    expect(
      engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 }),
    ).toBeSuccessfulCommand();
  });

  it("does not let a Unit-targeted power effect change equipped Gear's printed power", () => {
    cover("3.17.3.3");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailTowerfall],
        eddies: 6,
        gigArea: [{ dieType: "d12", faceValue: 12 }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailSwordwiseHuscle,
            spent: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );
    engine.playCard(welcomeToNightCityRetailTowerfall, { as: P1 });
    engine.resolveChooseEffect("power-down", { as: P1 });
    const host = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P2);
    const gear = engine.getCard(welcomeToNightCityRetailMantisBlades, "field", P2);
    expect(host.meta.attachedGearIds).toContain(gear.instanceId);
    expect(welcomeToNightCityRetailMantisBlades.power).toBe(2);
    expect(gear.meta.powerModifier ?? 0).toBe(0);
    expect(
      engine
        .getState()
        .G.activeEffects.some(
          (effect) => effect.kind === "powerModifier" && effect.targetCardId === gear.instanceId,
        ),
    ).toBe(false);
  });

  it("reads 'this Unit' on equipped Gear as the host, not the Gear", () => {
    cover("10.1.3");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailTheRelicExperimentalBiochip],
          },
        ],
        trash: [welcomeToNightCityRetailSwordwiseHuscle],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
            powerModifier: 5,
          },
        ],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveFullFight({ as: P2 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    }
    expect(
      engine
        .getCardsInZone("field", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailSwordwiseHuscle.id),
    ).toBe(true);
    const deckIds = engine.getCardsInZone("deck", P1).map((c) => c.definitionId);
    expect(deckIds[deckIds.length - 1]).toBe(welcomeToNightCityRetailFieldOperator.id);
    expect(
      engine
        .getCardsInZone("deck", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailTheRelicExperimentalBiochip.id),
    ).toBe(false);
  });
});
