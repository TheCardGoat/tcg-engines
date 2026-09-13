import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailAdamSmasherEnderOfLegends,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailMaxtacSquadron,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("MaxTac Squadron (registration)", () => {
  it("is registered with the ingested card data", () => {
    expect(welcomeToNightCityRetailMaxtacSquadron).toBeDefined();
    expect(welcomeToNightCityRetailMaxtacSquadron.slug).toBe("maxtac-squadron");
    expect(welcomeToNightCityRetailMaxtacSquadron.type).toBe("unit");
    expect(welcomeToNightCityRetailMaxtacSquadron.color).toBe("green");
    expect(welcomeToNightCityRetailMaxtacSquadron.set.code).toBe("welcometonightcityretail");
    expect(welcomeToNightCityRetailMaxtacSquadron.cost).toBe(3);
    expect(welcomeToNightCityRetailMaxtacSquadron.power).toBe(4);
  });
});

describe("MaxTac Squadron — At the end of your turn, if this Unit is spent, ready a friendly face-up Legend", () => {
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
      {},
    );

    engine.judgeSpendCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, { as: P1 });
    engine.judgeSpendCard(welcomeToNightCityRetailAdamSmasherEnderOfLegends, { as: P1 });
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

    // A face-down legend is not a valid ready target.
    expect(() => engine.resolveEffectTargetIds([adamId], { as: P1 })).toThrow();

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
  });

  it("may ready zero Legends (the choice is optional)", () => {
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

    const goroBefore = engine.getCard(
      welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
      "legendArea",
      P1,
    ).meta.spent;
    engine.resolveEffectTargetIds([], { as: P1 });

    expect(
      engine.getCard(welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, "legendArea", P1).meta
        .spent,
    ).toBe(goroBefore);
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
      },
    });
  });
});
