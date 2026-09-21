import { beforeAll, describe, expect, it } from "vite-plus/test";
import {
  promoLucynaKushinada,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDumDumMaelstromTriggerman,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRebootOptics,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
  welcomeToNightCityRetailSketchyRipper,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailVStreetkid,
} from "@tcg/cyberpunk-cards";
import { availableEddies } from "../../src/moves/eddie-resources.ts";
import { getEffectivePower } from "../../src/active-effects/index.ts";
import { stripPrivateFields } from "../../src/logging/index.ts";
import { CyberpunkTestEngine, P1, P2, registerMatchers } from "../../src/testing/index.ts";
import { ALL_DICE } from "../../src/testing/test-engine.ts";
import "../../src/testing/matchers.d.ts";
import { cover } from "./covered-rules.ts";
import { passTurn } from "./helpers.ts";

beforeAll(() => {
  registerMatchers();
});

describe("CR real-card: overview, costs, card types, areas", () => {
  it("is a two-player game with distinct owners and controllers", () => {
    cover("1.4", "1.7", "1.7.1", "1.7.2", "1.7.2.1", "1.7.2.2", "1.7.3", "1.8");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [welcomeToNightCityRetailSwordwiseHuscle] },
      { field: [welcomeToNightCityRetailCorpoSecurity] },
    );
    expect(engine.getState().ctx.playerIds).toEqual([P1, P2]);
    const friendly = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    const rival = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    expect(friendly.ownerId).toBe(P1);
    expect(friendly.controllerId).toBe(P1);
    expect(rival.ownerId).toBe(P2);
    expect(rival.controllerId).toBe(P2);
  });

  it("wins at start of turn with 7 Gigs, before Ready", () => {
    cover("1.5", "1.10", "1.10.1", "1.13", "8.6.1");
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [welcomeToNightCityRetailSketchyRipper] },
      { gigArea: ALL_DICE },
    );
    engine.judgeAddGigDie(P2, "d4", 1);
    expect(engine.getGigCount(P2)).toBe(7);
    expect(engine.isGameOver()).toBe(false);
    passTurn(engine, P1);
    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P2);
    expect(engine.getWinReason()).toBe("gig_victory");
  });

  it("loses immediately when required to draw from an empty deck", () => {
    cover("1.6", "1.14", "1.14.1", "1.17", "8.6.4", "8.6.4.1", "5.5.8");
    const engine = CyberpunkTestEngine.createWithFixture(
      { deck: 1, field: [welcomeToNightCityRetailSwordwiseHuscle] },
      { deck: 0 },
    );
    passTurn(engine, P1);
    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P1);
    expect(engine.getWinReason()).toBe("deck_out_victory");
  });

  it("lets a player concede at any time", () => {
    cover("1.16", "1.16.1");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [welcomeToNightCityRetailSwordwiseHuscle],
    });
    expect(engine.concede({ as: P1 })).toBeSuccessfulCommand();
    expect(engine.isGameOver()).toBe(true);
    expect(engine.getWinnerId()).toBe(P2);
  });

  it("reveals a Sell-Tag card during the action, then keeps its face-down Eddie hidden", () => {
    cover(
      "3.12",
      "3.12.1",
      "5.8",
      "5.8.1",
      "5.8.1.1",
      "5.8.1.2",
      "5.8.1.3",
      "5.8.2",
      "5.8.2.1",
      "5.8.2.3",
      "5.8.3",
      "5.8.4",
      "8.11",
      "8.11.1",
      "8.11.2",
      "11.9",
      "11.9.1",
      "11.9.1.1",
      "11.9.2",
    );
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailRebootOptics],
      eddies: 0,
    });
    engine.spendAllLegends();
    engine.sellCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    expect(engine.getEddies(P1)).toBe(1);
    const eddie = engine.getCardsInZone("eddieArea", P1)[0]!;
    expect(eddie.definitionId).toBe(welcomeToNightCityRetailFloorIt.id);
    expect(eddie.meta.spent).toBe(false);
    expect(eddie.meta.revealed).toBe(false);
    expect(eddie.meta.faceDown).toBe(true);
    const p1View = engine.getFilteredView(P1);
    const p2View = engine.getFilteredView(P2);
    const ownSold = (
      p1View.players[P1 as string]!.zones.eddieArea as { cardName: string | null }[]
    )[0];
    const rivalSold = (
      p2View.players[P1 as string]!.zones.eddieArea as { cardName: string | null }[]
    )[0];
    expect(ownSold?.cardName).toBeNull();
    expect(rivalSold?.cardName).toBeNull();
    const sellLog = engine.getLastActionLog();
    if (sellLog?.messageKey !== "move.sellCard") throw new Error("Expected Sell action log");
    expect(stripPrivateFields(sellLog, P2)?.params).toMatchObject({ cardName: "Floor It" });
    const failure = engine.expectFailure(() =>
      engine.sellCard(welcomeToNightCityRetailRebootOptics, { as: P1 }),
    );
    expect(failure.errorCode).toBe("ALREADY_SOLD");
    passTurn(engine, P1);
    const hidden = engine.getCardsInZone("eddieArea", P1)[0]!;
    expect(hidden.meta.faceDown).toBe(true);
    expect(hidden.meta.revealed).toBe(false);
    const after = engine.getFilteredView(P2);
    const rivalEddie = (
      after.players[P1 as string]!.zones.eddieArea as { cardName: string | null }[]
    )[0];
    expect(rivalEddie?.cardName).toBeNull();
  });

  it("cannot sell a card without a Sell Tag", () => {
    cover("3.12.1", "8.11");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSketchyRipper],
      eddies: 0,
    });
    const failure = engine.expectFailure(() =>
      engine.sellCard(welcomeToNightCityRetailSketchyRipper, { as: P1 }),
    );
    expect(failure.errorCode).toBe("NO_SELL_TAG");
  });

  it("pays 1 €$ to Call a Legend once per Main phase", () => {
    cover(
      "3.3",
      "3.4",
      "3.4.1",
      "4.3",
      "4.3.1",
      "5.7.3",
      "8.10",
      "8.12",
      "8.12.1",
      "11.10",
      "11.10.1",
      "11.11",
      "11.11.1",
      "11.11.1.1",
      "11.11.1.2",
      "11.11.1.3",
      "11.11.2",
      "11.11.2.1",
    );
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        { card: welcomeToNightCityRetailVStreetkid, faceDown: true },
        { card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true },
      ],
      eddies: 2,
    });
    expect(
      engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 }),
    ).toBeSuccessfulCommand();
    const called = engine.getCard(welcomeToNightCityRetailVStreetkid, "legendArea", P1);
    expect(called.meta.faceDown).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
    const spent = engine.getEvents("eddiesSpent");
    expect(spent).toEqual([
      expect.objectContaining({ amount: 1, forWhat: "callLegend", playerId: P1 }),
    ]);
    const second = engine.expectFailure(() =>
      engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 }),
    );
    expect(second.errorCode).toBe("ALREADY_CALLED");
  });

  it("does not charge the retired beta 2 €$ Call a Legend cost", () => {
    cover("8.12", "11.11.1");
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      eddies: 2,
    });
    engine.spendAllLegends();
    engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("pays 1 €$ with a ready face-down Legend", () => {
    cover("3.5", "3.6", "3.7", "5.7.2", "5.7.2.1", "11.8", "11.8.1", "11.16", "11.16.1");
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      eddies: 0,
    });
    expect(
      engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 }),
    ).toBeSuccessfulCommand();
    const called = engine.getCard(welcomeToNightCityRetailVStreetkid, "legendArea", P1);
    expect(called.meta.faceDown).toBe(false);
    expect(called.meta.spent).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });

  it("lets a face-up Sell-Tag Legend pay 1 €$ and blocks a face-up Legend without one", () => {
    cover("3.12.2", "5.7.2", "5.7.2.2");
    const withTag = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSketchyRipper],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: false }],
      eddies: 1,
    });
    expect(
      withTag.playCard(welcomeToNightCityRetailSketchyRipper, { as: P1 }),
    ).toBeSuccessfulCommand();
    expect(withTag.getEddies(P1)).toBe(0);
    expect(withTag.getCard(welcomeToNightCityRetailVStreetkid, "legendArea", P1).meta.spent).toBe(
      true,
    );

    const noTag = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailSketchyRipper],
      legendArea: [{ card: promoLucynaKushinada, faceDown: false }],
      eddies: 1,
    });
    expect(availableEddies(noTag.getState(), P1)).toBe(1);
    const failure = noTag.expectFailure(() =>
      noTag.playCard(welcomeToNightCityRetailSketchyRipper, { as: P1 }),
    );
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(noTag.getCard(promoLucynaKushinada, "legendArea", P1).meta.spent).toBe(false);
  });

  it("plays a Unit ready with Lag and cannot attack until Lag clears", () => {
    cover(
      "3.11",
      "3.11.1",
      "3.11.1.1",
      "4.6",
      "4.7",
      "4.8",
      "5.6",
      "5.6.2",
      "5.6.2.1",
      "5.6.2.2",
      "5.6.3",
      "5.6.4",
      "8.13",
      "8.14.1",
      "9.3.1.1",
      "11.3",
      "11.3.1",
      "11.3.1.1",
      "11.3.1.2",
      "11.3.2",
      "11.4",
      "11.4.1",
      "11.4.2",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailSwordwiseHuscle], eddies: 3 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    engine.spendAllLegends();
    engine.playCard(welcomeToNightCityRetailSwordwiseHuscle, { as: P1 });
    const unit = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    expect(unit.meta.hasLag).toBe(true);
    expect(unit.meta.spent).toBe(false);
    expect(engine.getEddies(P1)).toBe(0);
    const lag = engine.expectFailure(() =>
      engine.attackUnit(
        welcomeToNightCityRetailSwordwiseHuscle,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    );
    expect(lag.errorCode).toBe("LAG");
  });

  it("lets an ADRENALINE Unit attack the turn it is played", () => {
    cover("11.23", "11.23.1", "11.23.2");
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailRidingNomad], eddies: 5 },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );
    engine.spendAllLegends();
    engine.playCard(welcomeToNightCityRetailRidingNomad, { as: P1 });
    const nomad = engine.getCard(welcomeToNightCityRetailRidingNomad, "field", P1);
    expect(nomad.meta.hasLag).toBe(true);
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailRidingNomad,
        welcomeToNightCityRetailCorpoSecurity,
        {
          as: P1,
        },
      ),
    ).toBeSuccessfulCommand();
  });

  it("plays a Program, resolves it, and moves it to trash", () => {
    cover(
      "4.13",
      "4.14",
      "4.14.2",
      "5.9",
      "5.9.2",
      "5.9.3",
      "5.9.4",
      "10.1",
      "10.2",
      "10.4.1",
      "11.20",
      "11.20.1",
      "11.20.2",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailCorporateSurveillance], eddies: 2 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );
    engine.spendAllLegends();
    engine.playCard(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (choice?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    }
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((c) => c.definitionId === welcomeToNightCityRetailCorporateSurveillance.id),
    ).toBe(true);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
  });

  it("equips Gear to a friendly Unit, adding its power", () => {
    cover(
      "3.17",
      "3.17.1",
      "3.17.2",
      "3.17.3",
      "3.17.3.1",
      "3.17.3.2",
      "3.17.4",
      "4.9",
      "4.10",
      "4.10.1",
      "4.10.2",
      "4.10.3",
      "11.6",
      "11.6.1",
      "11.6.2",
      "11.6.4",
      "11.6.5",
    );
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMantisBlades],
      field: [{ card: welcomeToNightCityRetailSwordwiseHuscle, hasLag: false }],
      eddies: 1,
    });
    engine.spendAllLegends();
    const before = getEffectivePower(
      engine.getState(),
      engine.findCardId(welcomeToNightCityRetailSwordwiseHuscle, "field", P1),
    );
    engine.attachGear(
      welcomeToNightCityRetailMantisBlades,
      welcomeToNightCityRetailSwordwiseHuscle,
      {
        as: P1,
      },
    );
    const host = engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(1);
    expect(getEffectivePower(engine.getState(), host.instanceId)).toBe(before + 2);
  });

  it("plays GO SOLO as a ready Unit that can attack and is removed if it leaves the field", () => {
    cover(
      "4.2",
      "4.2.1",
      "4.5",
      "4.5.1",
      "5.7.5",
      "11.25",
      "11.25.1",
      "5.13",
      "5.13.2",
      "5.13.2.2",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [
          { card: welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown, faceDown: false },
        ],
        eddies: 5,
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    engine.spendAllLegends();
    const legendId = engine.findCardId(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "legendArea",
      P1,
    );
    expect(
      engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1),
    ).toMatchObject({
      success: true,
    });
    const onField = engine.getCard(
      welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
      "field",
      P1,
    );
    expect(onField.meta.hasLag).toBe(false);
    expect(onField.meta.spent).toBe(false);
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailSashaYakovlevaWonTLetYouDown,
        welcomeToNightCityRetailCorpoSecurity,
        { as: P1 },
      ),
    ).toBeSuccessfulCommand();
  });

  it("treats a null-cost Legend as unpayable to the field", () => {
    cover("3.11.2", "3.11.2.1", "3.11.2.2", "4.5.3");
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: promoLucynaKushinada, faceDown: false }],
      eddies: 10,
    });
    const legendId = engine.findCardId(promoLucynaKushinada, "legendArea", P1);
    const result = engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1);
    expect(result.success).toBe(false);
  });

  it("allows sell, Call a Legend, and play in any Main-phase order", () => {
    cover("8.4", "8.4.2", "8.9", "8.10", "8.10.1", "8.1", "8.3");
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFloorIt, welcomeToNightCityRetailSketchyRipper],
      legendArea: [{ card: welcomeToNightCityRetailVStreetkid, faceDown: true }],
      eddies: 2,
    });
    engine.playCard(welcomeToNightCityRetailSketchyRipper, { as: P1 });
    engine.callLegend(welcomeToNightCityRetailVStreetkid, { as: P1 });
    engine.sellCard(welcomeToNightCityRetailFloorIt, { as: P1 });
    expect(engine.getCardsInZone("field", P1)).toHaveLength(1);
    expect(engine.getCard(welcomeToNightCityRetailVStreetkid, "legendArea", P1).meta.faceDown).toBe(
      false,
    );
    expect(engine.getCardsInZone("eddieArea", P1)).toHaveLength(1);
  });

  it("counts Street Cred as Gig face values and Null when the Gig area is empty", () => {
    cover(
      "5.10",
      "5.10.2",
      "5.10.3",
      "5.10.5",
      "5.11",
      "5.11.1",
      "5.11.2",
      "5.11.3",
      "5.11.4",
      "6.1",
      "6.1.1",
      "6.1.2",
      "6.1.3",
      "6.3",
      "11.2",
      "11.2.1",
      "11.2.2",
      "11.2.3",
    );
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d12", faceValue: 12 },
        ],
      },
      {},
    );
    expect(engine.getGigCount(P1)).toBe(2);
    expect(engine.getStreetCred(P1)).toBe(13);
    expect(engine.getGigCount(P2)).toBe(0);
    expect(engine.getStreetCred(P2)).toBe(0);
  });

  it("resolves optional CALL 'you may' by declining", () => {
    cover("2.1", "2.1.1", "2.7", "2.8", "11.18", "11.18.1", "11.18.2", "11.11.1.4");
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailSwordwiseHuscle,
          attachedGears: [welcomeToNightCityRetailMantisBlades],
        },
      ],
      legendArea: [{ card: welcomeToNightCityRetailDumDumMaelstromTriggerman, faceDown: true }],
      eddies: 1,
    });
    engine.spendAllLegends();
    engine.callLegend(welcomeToNightCityRetailDumDumMaelstromTriggerman, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseCardToMove");
    engine.executeMove("resolveCardToMove", { args: { pass: true } }, P1);
    expect(
      engine.getCard(welcomeToNightCityRetailSwordwiseHuscle, "field", P1).meta.attachedGearIds,
    ).toHaveLength(1);
  });
});
