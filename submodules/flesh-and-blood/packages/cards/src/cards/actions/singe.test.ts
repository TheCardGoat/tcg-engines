import { singeBlue } from "./singe.ts";
import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dromai } from "../heroes/dromai.ts";
import { aetherAshwing } from "../tokens/aether-ashwing.ts";
import { singeRed } from "./singe.ts";

/**
 * Singe (UPR179) — Wizard Action, cost 1. Deal 1 arcane to target hero and
 * up to 3 target allies they control.
 *
 * Up-to is `entityTargets: "maximum"` vs `"minimum"` (never `"all"`).
 * The ally scan uses the stamped target-controller of the chosen hero.
 */

describe("Singe (UPR179) AAA", () => {
  it("happy: deals 1 arcane to the hero and up to 3 allies they control", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [singeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dromai,
        arena: [aetherAshwing, aetherAshwing, aetherAshwing],
        hand: [],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dromai = game.as(dromai);

    Kano.exec({
      move: "begin-play",
      payload: { instanceId: Kano.findCardInZone("hand", singeRed) },
    });
    Kano.target(Dromai);
    expect(Kano.expectDecision("entity-target").candidates).toHaveLength(3);
    game.untilIdle({ entityTargets: "maximum", optionals: "decline" });

    expectFabPlayer(Dromai).toHaveLife(19);
    expect(Dromai.cardsIn("arena", aetherAshwing)).toHaveLength(0);
    expectFabCard(Kano, singeRed).toBeIn("graveyard");
  });

  it("boundary: minimum ally targets leave all three Aether Ashwings in arena", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [singeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dromai,
        arena: [aetherAshwing, aetherAshwing, aetherAshwing],
        hand: [],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dromai = game.as(dromai);

    Kano.play(singeRed, { target: Dromai.id });
    game.untilIdle({ entityTargets: "minimum", optionals: "decline" });

    expectFabPlayer(Dromai).toHaveLife(19);
    expect(Dromai.cardsIn("arena", aetherAshwing)).toHaveLength(3);
    expectFabCard(Kano, singeRed).toBeIn("graveyard");
  });

  it("timing: targeting Kano cannot damage Dromai's allies", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [singeRed],
        resourcePoints: 1,
        actionPoints: 1,
        life: 15,
        deck: 6,
      },
      {
        hero: dromai,
        arena: [aetherAshwing, aetherAshwing, aetherAshwing],
        hand: [],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dromai = game.as(dromai);

    Kano.play(singeRed, { target: Kano.id });
    game.untilIdle({ entityTargets: "maximum", optionals: "decline" });

    expectFabPlayer(Kano).toHaveLife(14);
    expectFabPlayer(Dromai).toHaveLife(20);
    expect(Dromai.cardsIn("arena", aetherAshwing)).toHaveLength(3);
  });

  it("happy: deals 1 arcane to the hero and up to 1 ally they control", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [singeBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dromai,
        arena: [aetherAshwing, aetherAshwing],
        hand: [],
        life: 20,
        resourcePoints: 0,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dromai = game.as(dromai);

    Kano.exec({
      move: "begin-play",
      payload: { instanceId: Kano.findCardInZone("hand", singeBlue) },
    });
    Kano.target(Dromai);
    expect(Kano.expectDecision("entity-target").candidates).toHaveLength(2);
    game.untilIdle({ entityTargets: "maximum", optionals: "decline" });

    expectFabPlayer(Dromai).toHaveLife(19);
    expect(Dromai.cardsIn("arena", aetherAshwing)).toHaveLength(1);
    expectFabCard(Kano, singeBlue).toBeIn("graveyard");
  });
});
