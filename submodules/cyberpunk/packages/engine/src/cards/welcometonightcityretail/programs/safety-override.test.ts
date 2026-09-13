import { describe, expect, it } from "vite-plus/test";

import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailPlacideVoodooSentinel,
  welcomeToNightCityRetailSafetyOverride,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Safety Override (registration)", () => {
  it("is registered with the ingested card data", () => {
    expect(welcomeToNightCityRetailSafetyOverride).toBeDefined();
    expect(welcomeToNightCityRetailSafetyOverride.slug).toBe("safety-override");
    expect(welcomeToNightCityRetailSafetyOverride.type).toBe("program");
    expect(welcomeToNightCityRetailSafetyOverride.color).toBe("yellow");
    expect(welcomeToNightCityRetailSafetyOverride.set.code).toBe("welcometonightcityretail");
    expect(welcomeToNightCityRetailSafetyOverride.cost).toBe(2);
  });
});

describe("Safety Override — next time a friendly Unit loses a fight this turn, defeat the opposing rival Unit", () => {
  it("defeats the opposing rival Unit when a friendly Unit loses a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailPlacideVoodooSentinel.id),
    ).toBe(true);
  });

  it("is consumed after one friendly loss (single use)", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });

    const hasSafetyEffect = () =>
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss");

    expect(hasSafetyEffect()).toBe(true);

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });
    expect(hasSafetyEffect()).toBe(false);
  });

  it("does not trigger when a friendly Unit wins the fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailOffdutyMalfini,
      welcomeToNightCityRetailFieldOperator,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss"),
    ).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailFieldOperator.id),
    ).toBe(true);
  });

  it("expires at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.completeTurn();
    engine.completeTurn();

    expect(
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss"),
    ).toBe(false);
  });

  it("is a no-op while no friendly Unit loses a fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailOffdutyMalfini, spent: false, hasLag: false }],
        eddies: 2,
      },
      {},
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });

    expect(
      engine
        .getState()
        .G.activeEffects.some((e) => e.kind === "defeatRivalOnNextFriendlyFightLoss"),
    ).toBe(true);
    expect(engine.getCardsInZone("trash", P2)).toHaveLength(0);
  });

  it("defeats only the opposing rival Unit, not a bystander", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSafetyOverride],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailPlacideVoodooSentinel, spent: true },
          { card: welcomeToNightCityRetailOffdutyMalfini, spent: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailSafetyOverride, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailPlacideVoodooSentinel,
      {
        as: P1,
      },
    );
    engine.resolveFullFight({ as: P1 });

    expect(
      engine
        .getCardsInZone("trash", P2)
        .some((card) => card.definitionId === welcomeToNightCityRetailOffdutyMalfini.id),
    ).toBe(false);
  });

  it("declares a Quick play trigger that grants a one-turn friendly-fight-loss defeat", () => {
    const card = welcomeToNightCityRetailSafetyOverride;
    expect(card.keywords).toContain("quick");
    const ability = card.abilities.find((a) => a.kind === "triggered")!;
    expect(ability.trigger).toMatchObject({ trigger: "play" });
    expect(ability.effects.map((e) => e.effect)).toEqual(["grantNextFriendlyFightLossDefeat"]);
    expect(ability.effects[0]).toMatchObject({
      effect: "grantNextFriendlyFightLossDefeat",
      duration: "turn",
    });
  });
});
