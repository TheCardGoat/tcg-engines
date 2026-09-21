import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckViktorVektorSitDownAndRelax,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailIndustrialAssembly,
  welcomeToNightCityRetailJudyAlvarezBraindanceMaestro,
  welcomeToNightCityRetailMaxtacAv,
  welcomeToNightCityRetailMuamarReyesElCapitan,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailTrustNoOne,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../src/active-effects/index.ts";
import { stripPrivateFields } from "../../src/logging/index.ts";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: gig adjust/swap, spend-icon, hidden areas", () => {
  it("adjusts a Gig only onto a printed face, distinguishing exact from up-to zero", () => {
    cover("6.3", "6.3.2", "6.3.3", "6.4", "6.4.1", "6.4.4", "6.4.5", "6.1.4");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailIndustrialAssembly],
      eddies: 1,
      gigArea: [{ dieType: "d8", faceValue: 4 }],
    });
    engine.spendAllLegends();
    engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the new face value",
    });
    expect(engine.resolveAdjustGig(4, { as: P1 })).toBeSuccessfulCommand();
    expect(engine.getGigValue(P1)).toBe(4);

    const exact = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailMuamarReyesElCapitan, faceDown: false, spent: false },
      ],
      gigArea: [{ dieType: "d8", faceValue: 4 }],
    });
    exact.activateAbility(welcomeToNightCityRetailMuamarReyesElCapitan, 1, { as: P1 });
    exact.resolveEffectTargetIds([exact.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Muamar still needs an exact nonzero adjustment",
    });
    const same = exact.expectFailure(() => exact.resolveAdjustGig(4, { as: P1 }));
    expect(same.errorCode).toBe("SAME_VALUE");
    exact.resolveAdjustGig(5, { as: P1 });
    expect(exact.getGigValue(P1)).toBe(5);

    const bounded = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailIndustrialAssembly],
      eddies: 1,
      gigArea: [{ dieType: "d8", faceValue: 4 }],
    });
    bounded.spendAllLegends();
    bounded.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P1 });
    bounded.resolveEffectTargetIds([bounded.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the new face value",
    });
    const over = bounded.expectFailure(() => bounded.resolveAdjustGig(9, { as: P1 }));
    expect(over.errorCode).toBe("VALUE_OUT_OF_RANGE");
    bounded.resolveAdjustGig(8, { as: P1 });
    expect(bounded.getGigDice(P1).find((die) => die.dieType === "d8")?.faceValue).toBe(8);
  });

  it("decreases a Gig to its minimum face (min Gig)", () => {
    cover("6.3.1", "6.3.3", "6.4", "6.4.2");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTrustNoOne],
      deck: [welcomeToNightCityRetailSketchyRipper],
      eddies: 1,
      gigArea: [{ dieType: "d6", faceValue: 4 }],
    });
    engine.playCard(welcomeToNightCityRetailTrustNoOne, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d6")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Trust No One still needs the decreased face value",
    });
    const belowMin = engine.expectFailure(() => engine.resolveAdjustGig(0, { as: P1 }));
    expect(belowMin.errorCode).toBe("VALUE_OUT_OF_RANGE");
    engine.resolveAdjustGig(1, { as: P1 });
    expect(engine.getGigDice(P1).find((die) => die.dieType === "d6")?.faceValue).toBe(1);
  });

  it("grants extra power from a value-pair when a Spend-icon ability pays 1 €$", () => {
    cover("6.5", "6.5.1", "11.16.1.1");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      legendArea: [
        {
          card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
          faceDown: false,
          spent: false,
        },
      ],
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 2 },
      ],
      eddies: 1,
    });
    const unitId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);
    const before = getEffectivePower(engine.getState(), unitId);
    expect(
      engine.activateAbility(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, 1, { as: P1 }),
    ).toBeSuccessfulCommand();
    expect(getEffectiveRules(engine.getState(), unitId)).toContain("blocker");
    expect(getEffectivePower(engine.getState(), unitId)).toBe(before + 1);
    expect(engine.getEddies(P1)).toBe(0);
    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("swaps Gigs without stealing and without changing face values", () => {
    cover("6.6", "6.6.1", "6.6.2", "6.7");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMaxtacAv],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      { gigArea: [{ dieType: "d8", faceValue: 6 }] },
    );
    engine.spendAllLegends();
    const friendly = engine.findGigIdByType(P1, "d4");
    const rival = engine.findGigIdByType(P2, "d8");
    engine.playCard(welcomeToNightCityRetailMaxtacAv, { as: P1 });
    const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(triggerChoice?.type).toBe("chooseTrigger");
    if (!triggerChoice || triggerChoice.type !== "chooseTrigger") {
      throw new Error("Expected optional MaxTac AV Play trigger");
    }
    const trigger = triggerChoice.payload.options.find(
      (option) =>
        option.sourceCardId ===
        engine.getCard(welcomeToNightCityRetailMaxtacAv, "field", P1).instanceId,
    );
    if (!trigger) throw new Error("Expected MaxTac AV trigger option");
    engine.executeMove("resolveTrigger", { args: { triggerId: trigger.triggerId } }, P1);
    engine.expectNoPendingChoice();
    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(rival);
    expect(engine.getGigDice(P2).map((die) => die.id)).toContain(friendly);
    expect(engine.getGigDice(P1).find((die) => die.id === rival)?.faceValue).toBe(6);
    expect(engine.getGigDice(P2).find((die) => die.id === friendly)?.faceValue).toBe(2);
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });

  it("activates a Spend-icon effect only when spent as that cost", () => {
    cover(
      "8.14",
      "10.4.2",
      "10.19",
      "10.19.2",
      "11.15",
      "11.15.1",
      "11.15.2",
      "11.15.3",
      "11.7",
      "11.7.1",
      "11.7.2",
      "11.7.2.1",
      "11.7.2.1.1",
    );
    const spend = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          {
            card: welcomeToNightCityRetailJudyAlvarezBraindanceMaestro,
            faceDown: false,
            spent: false,
          },
        ],
        deck: [welcomeToNightCityRetailFloorIt],
      },
      undefined,
      { preserveDeckOrder: true },
    );
    expect(
      spend.activateAbility(welcomeToNightCityRetailJudyAlvarezBraindanceMaestro, 1, { as: P1 }),
    ).toBeSuccessfulCommand();
    expect(
      spend.getCard(welcomeToNightCityRetailJudyAlvarezBraindanceMaestro, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    const afterSpend = spend.getState().G.turnMetadata.pendingChoice;
    if (afterSpend?.type === "chooseTarget") {
      spend.resolveEffectTarget(welcomeToNightCityRetailFloorIt, { as: P1 });
    }
    expect(
      spend
        .getCardsInZone("hand", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailFloorIt.id) ||
        spend
          .getCardsInZone("trash", P1)
          .some((c) => c.definitionId === welcomeToNightCityRetailFloorIt.id),
    ).toBe(true);

    const pay = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt],
        legendArea: [
          {
            card: welcomeToNightCityRetailJudyAlvarezBraindanceMaestro,
            faceDown: false,
            spent: false,
          },
        ],
        deck: [welcomeToNightCityRetailSketchyRipper],
        eddies: 0,
      },
      undefined,
      { preserveDeckOrder: true },
    );
    expect(pay.playCard(welcomeToNightCityRetailFloorIt, { as: P1 })).toBeSuccessfulCommand();
    expect(
      pay.getCard(welcomeToNightCityRetailJudyAlvarezBraindanceMaestro, "legendArea", P1).meta
        .spent,
    ).toBe(true);
    expect(
      pay
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailSketchyRipper.id),
    ).toBe(false);
  });

  it("hides rival hands, decks, face-down Legends, and face-down Eddies", () => {
    cover(
      "5.3",
      "5.3.1",
      "5.3.1.1",
      "5.3.1.2",
      "5.3.2",
      "5.3.2.1",
      "5.4",
      "5.4.1",
      "5.4.2",
      "5.4.3",
      "5.4.4",
      "5.4.5",
      "5.5.4",
      "5.5.5",
      "5.5.6",
      "5.7.4.1",
      "5.8.3.1",
      "5.3.2.4",
      "5.3.2.4.1",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailSketchyRipper],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailTrustNoOne],
        legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      },
      { hand: [welcomeToNightCityRetailIndustrialAssembly] },
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    engine.sellCard(welcomeToNightCityRetailFloorIt, { as: P1 });

    const p1View = engine.getFilteredView(P1);
    const p2View = engine.getFilteredView(P2);
    expect(p1View.players[P1 as string]!.zones.hand).toBeInstanceOf(Array);
    const ownHand = p1View.players[P1 as string]!.zones.hand as { cardName: string | null }[];
    expect(ownHand.some((c) => c.cardName === "Sketchy Ripper")).toBe(true);
    expect(p2View.players[P1 as string]!.zones.hand).toBe(1);
    expect(p1View.players[P2 as string]!.zones.hand).toBe(1);
    const deckCount = engine.getCardsInZone("deck", P1).length;
    expect(p1View.players[P1 as string]!.zones.deck).toBe(deckCount);
    expect(p2View.players[P1 as string]!.zones.deck).toBe(deckCount);

    const rivalLegends = p2View.players[P1 as string]!.zones.legendArea as {
      cardName: string | null;
      faceDown: boolean;
    }[];
    expect(rivalLegends.every((c) => c.faceDown && c.cardName === null)).toBe(true);

    const ownEddies = p1View.players[P1 as string]!.zones.eddieArea as {
      cardName: string | null;
      revealed: boolean;
    }[];
    const rivalEddies = p2View.players[P1 as string]!.zones.eddieArea as {
      cardName: string | null;
      revealed: boolean;
    }[];
    expect(ownEddies.every((c) => !c.revealed && c.cardName === null)).toBe(true);
    expect(rivalEddies.every((c) => !c.revealed && c.cardName === null)).toBe(true);
    const sellLog = engine.getLastActionLog();
    if (sellLog?.messageKey !== "move.sellCard") throw new Error("Expected Sell action log");
    expect(stripPrivateFields(sellLog, P2)?.params).toMatchObject({ cardName: "Floor It" });
  });

  it("lets a search of a hidden deck fail to find without revealing", () => {
    cover("5.3.2.3", "5.3.2.4", "5.3.2.4.1", "5.3.2.5", "5.3.2.6", "11.13.4", "11.13.4.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: theHeistRetailStarterDeckViktorVektorSitDownAndRelax, faceDown: true },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
      },
      undefined,
      { preserveDeckOrder: true },
    );
    engine.spendAllLegends();
    engine.callLegend(theHeistRetailStarterDeckViktorVektorSitDownAndRelax, { as: P1 });
    engine.resolveScryTo("hand", [], { as: P1 });
    expect(engine.getHandCount(P1)).toBe(0);
    const p2View = engine.getFilteredView(P2);
    expect(p2View.players[P1 as string]!.zones.deck).toBe(engine.getCardsInZone("deck", P1).length);
  });
});
