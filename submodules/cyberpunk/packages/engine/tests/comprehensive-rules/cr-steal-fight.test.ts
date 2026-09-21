import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
  welcomeToNightCityRetailBonnieAndClyde,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailModdedKusanagi,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailSaulBrightStormrider,
  welcomeToNightCityRetailSynapseBurnout,
  welcomeToNightCityRetailVRoamerOfTheBadlands,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../src/active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import type { PreventGigStealPendingChoice } from "../../src/types/match-state.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";

beforeAll(() => {
  registerMatchers();
});

function bumpStolenGig(engine: CyberpunkTestEngine): void {
  const choice = engine.getState().G.turnMetadata.pendingChoice;
  if (!choice || choice.type !== "chooseTarget") {
    throw new Error(`Expected an adjustGig choice, got ${choice?.type ?? "none"}`);
  }
  const dieId = (choice.payload.dieId ?? choice.payload.eligibleIds?.[0]) as string | undefined;
  const die = dieId ? engine.getState().G.gigDice[dieId] : undefined;
  if (!die) {
    throw new Error("adjustGig choice did not identify a Gig");
  }
  const maxFace =
    die.dieType === "d4" ? 4 : die.dieType === "d6" ? 6 : die.dieType === "d8" ? 8 : die.faceValue;
  engine.resolveAdjustGig(Math.min(die.faceValue + 1, maxFace), { as: P1 });
}

describe("CR real-card: fight-win override, would-steal, while attacking/fighting", () => {
  it("lets card text decide the fight winner instead of power", () => {
    cover("9.17.4", "3.13.1.1", "10.1.1", "10.1.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
            spent: false,
            hasLag: false,
          },
        ],
      },
      {
        field: [{ card: welcomeToNightCityRetailYorinobuArasakaSteelDragon, spent: true }],
      },
    );
    expect(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.power).toBeLessThan(
      welcomeToNightCityRetailYorinobuArasakaSteelDragon.power,
    );
    engine.attackUnit(
      welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
      welcomeToNightCityRetailYorinobuArasakaSteelDragon,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((c) => c.definitionId === welcomeToNightCityRetailYorinobuArasakaSteelDragon.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("field", P1)
        .some(
          (c) => c.definitionId === welcomeToNightCityRetailJohnnySilverhandNeverStopFighting.id,
        ),
    ).toBe(true);
    expect(
      engine.getCard(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, "field", P1).meta
        .spent,
    ).toBe(false);
  });

  it("resolves a would-steal prevention after the Gig is chosen and before control changes", () => {
    cover("6.7.4");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
          },
        ],
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice as
      | PreventGigStealPendingChoice
      | undefined;
    expect(choice?.type).toBe("preventGigSteal");
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
    const dieId = choice!.payload.stealEntries[0]!.dieId as string;
    const cardId = choice!.payload.handEntries.find((entry) => entry.cost === 3)!.cardId as string;
    engine.resolvePreventGigSteal([{ dieId, cardId }], { as: P2 });
    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });

  it("does not change a Gig's value until after it has been stolen", () => {
    cover("6.7.5", "9.23.6", "9.24", "10.31", "10.31.3", "9.25");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailVRoamerOfTheBadlands, spent: false, hasLag: false },
        ],
      },
      { gigArea: [{ dieType: "d8", faceValue: 2 }] },
    );
    const stolenGigId = engine.findGigIdByType(P2, "d8");
    engine.attackRival(welcomeToNightCityRetailVRoamerOfTheBadlands, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getGigDice(P1).find((gig) => gig.id === stolenGigId)?.faceValue).toBe(2);
    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    const negative = engine.expectFailure(() => engine.resolveAdjustGig(-1, { as: P1 }));
    expect(negative.success).toBe(false);
    engine.resolveAdjustGig(7, { as: P1 });
    expect(engine.getGigDice(P1).find((gig) => gig.id === stolenGigId)?.faceValue).toBe(7);
    expect(engine.getAttackState()).toBeNull();
  });

  it("pends a steal-triggered effect once for each stolen Gig", () => {
    cover("10.16.3");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailVRoamerOfTheBadlands,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    expect(
      getEffectivePower(
        engine.getState(),
        engine.findCardId(welcomeToNightCityRetailVRoamerOfTheBadlands, "field", P1) as string,
      ),
    ).toBeGreaterThanOrEqual(10);
    engine.attackRival(welcomeToNightCityRetailVRoamerOfTheBadlands, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getEvents("gigStolen")).toHaveLength(2);
    for (let resolved = 0; resolved < 2; resolved += 1) {
      const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
      if (triggerChoice?.type === "chooseTrigger") {
        const vTrigger = triggerChoice.payload.options.find(
          (option) =>
            option.sourceCardId ===
            engine.findCardId(welcomeToNightCityRetailVRoamerOfTheBadlands, "field", P1),
        );
        if (!vTrigger) throw new Error("Expected a pending V: Roamer trigger");
        engine.executeMove("resolveTrigger", { args: { triggerId: vTrigger.triggerId } }, P1);
      }
      bumpStolenGig(engine);
    }
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("steals multiple Gigs at the same time as separate stolen Gigs", () => {
    cover("6.7.2.2.1", "9.23.5.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailModdedKusanagi,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
    );
    engine.attackRival(welcomeToNightCityRetailModdedKusanagi, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getGigCount(P1)).toBe(2);
    expect(engine.getGigCount(P2)).toBe(0);
    expect(engine.getEvents("gigStolen")).toHaveLength(2);
  });

  it("applies a while-attacking power bonus only on the attacking Unit", () => {
    cover("9.5", "9.29", "10.23.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailSaulBrightStormrider, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    const operatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    const saulId = engine.findCardId(welcomeToNightCityRetailSaulBrightStormrider, "field", P1);
    expect(getEffectivePower(engine.getState(), operatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(getEffectivePower(engine.getState(), operatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );
    expect(getEffectivePower(engine.getState(), saulId)).toBe(
      welcomeToNightCityRetailSaulBrightStormrider.power,
    );
    engine.resolveFullFight({ as: P1 });
    expect(getEffectivePower(engine.getState(), operatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
    expect(engine.getAttackState()).toBeNull();
  });

  it("applies a while-fighting bonus only after the Fight Step starts", () => {
    cover("9.16.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSynapseBurnout],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
        eddies: 1,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    const host = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);
    engine.playCard(welcomeToNightCityRetailSynapseBurnout, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power,
    );
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(
      welcomeToNightCityRetailOffdutyMalfini.power + 2,
    );
  });

  it("lets a face-up QUICK Legend use its other effect text during React", () => {
    cover("11.26.1.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
        legendArea: [
          {
            card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
            faceDown: false,
            spent: false,
          },
        ],
        eddies: 1,
      },
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
      },
    );
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailFieldOperator, {
      as: P2,
    });
    engine.resolveAttack({ as: P2 });
    expect(
      engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 }),
    ).toBeSuccessfulCommand();
  });
});
