import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailMaxtacSquadron,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("MaxTac Squadron", () => {
  it("is the exact green 3-cost 4-power NCPD Unit with its end-turn ready trigger", () => {
    expect(welcomeToNightCityRetailMaxtacSquadron).toMatchObject({
      canonicalId: "maxtac-squadron",
      slug: "maxtac-squadron",
      name: "MaxTac Squadron",
      displayName: "MaxTac Squadron",
      type: "unit",
      color: "green",
      classifications: ["NCPD"],
      cost: 3,
      power: 4,
      ram: 3,
      hasSellTag: false,
      printNumber: "082",
      rulesText: "At the end of your turn, if this Unit is spent, ready a friendly face-up Legend.",
    });
  });
  it("readies a friendly face-up spent Legend at end of turn when MaxTac is spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaxtacSquadron, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
        ],
      },
      {},
    );

    engine.judgeSpendCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);

    engine.completeTurn({ as: P1 });
    engine.resolveEffectTargetIds(
      [engine.findCardId(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1)],
      { as: P1 },
    );

    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(false);
  });

  it("does NOT ready a Legend when MaxTac is not spent at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaxtacSquadron, spent: false, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
        ],
      },
      {},
    );

    engine.judgeSpendCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    engine.completeTurn({ as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("ignores face-down Legends (only face-up are valid targets)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaxtacSquadron, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: true },
        ],
      },
      {
        legendArea: [{ card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false }],
      },
    );

    engine.judgeSpendCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    engine.judgeSpendCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 });
    engine.judgeSpendCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P2 });
    engine.completeTurn({ as: P1 });

    const goroId = engine.findCardId(
      welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
      "legendArea",
      P1,
    );
    const adamId = engine.findCardId(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends,
      "legendArea",
      P1,
    );
    const rivalAdamId = engine.findCardId(
      welcomeToNightCityRetailAdamSmasherEnderOfLegends,
      "legendArea",
      P2,
    );

    // Neither a face-down Legend nor a rival Legend is a valid ready target.
    expect(() => engine.resolveEffectTargetIds([adamId], { as: P1 })).toThrow();
    expect(() => engine.resolveEffectTargetIds([rivalAdamId], { as: P1 })).toThrow();

    engine.resolveEffectTargetIds([goroId], { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(false);
    expect(
      engine.getCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("chooses which Legend to ready when multiple face-up Legends are eligible", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaxtacSquadron, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
      },
      {},
    );

    engine.judgeSpendCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    engine.judgeSpendCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 });
    engine.completeTurn({ as: P1 });

    engine.resolveEffectTargetIds(
      [engine.findCardId(welcomeToNightCityRetailAdamSmasherEnderOfLegends, "legendArea", P1)],
      { as: P1 },
    );

    expect(
      engine.getCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, "legendArea", P1).meta
        .spent,
    ).toBe(false);
    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(true);
  });

  it("is a no-op when no face-up spent Legend is eligible", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaxtacSquadron, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
        ],
      },
      {},
    );

    engine.completeTurn({ as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(false);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("cannot decline the mandatory ready choice when a spent Legend is eligible", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaxtacSquadron, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
          { card: welcomeToNightCityRetailAdamSmasherEnderOfLegends, faceDown: false },
        ],
      },
      {},
    );

    engine.judgeSpendCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    engine.judgeSpendCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 });
    engine.completeTurn({ as: P1 });

    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending).toMatchObject({
      type: "chooseTarget",
      payload: { min: 1, max: 1, canDecline: false },
    });
    expect(engine.executeMove("resolveEffectTarget", { args: { pass: true } }, P1)).toMatchObject({
      success: false,
      errorCode: "CANNOT_PASS",
    });
    engine.resolveEffectTargetIds(
      [engine.findCardId(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1)],
      { as: P1 },
    );

    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(false);
  });

  it("does not trigger at the end of the rival turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaxtacSquadron, spent: true, hasLag: false }],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
        ],
      },
      {},
    );
    engine.judgeSpendCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.completeTurn({ as: P2 });

    const squadronId = engine.getCard(
      welcomeToNightCityRetailMaxtacSquadron,
      "field",
      P1,
    ).instanceId;
    expect(
      engine.getEvents("effectTriggered").filter((event) => event.sourceCardId === squadronId),
    ).toEqual([]);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });

  it("declares an end-of-friendly-turn trigger gated by self spent with a ready effect", () => {
    const ability = welcomeToNightCityRetailMaxtacSquadron.abilities[0]!;
    expect(ability.trigger).toMatchObject({
      trigger: "event",
      event: { event: "turnEnded", player: "friendly" },
    });
    expect(ability.effects).toHaveLength(1);
    expect(ability.effects[0]).toMatchObject({
      effect: "ready",
      conditions: [{ condition: "cardState", state: "spent" }],
      target: {
        controller: "friendly",
        zones: ["legendArea"],
        cardTypes: ["legend"],
        face: "faceUp",
        state: "spent",
        selection: { mode: "choose", min: 1, max: 1 },
      },
    });
  });
});
