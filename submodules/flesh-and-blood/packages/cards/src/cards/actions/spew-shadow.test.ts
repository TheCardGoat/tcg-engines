import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { kyloria } from "../allies/kyloria.ts";
import { spewShadowRed } from "./spew-shadow.ts";

/**
 * Spew Shadow (MON212) — Shadow Action, cost 2, 2{d}.
 *
 * Printed: "Choose an attack action card with cost 2 or less in your
 * banished zone. You may play it this turn. If it attacks a Light hero,
 * it gains +2{p}. Go again"
 *
 * The Light-hero pump is a this-turn latch on the chosen card's attacks
 * (`appliesTo.next` + `attacksOf: it` + Light defending-hero filter).
 */

describe("Spew Shadow (MON212) AAA", () => {
  it("happy: the chosen attack gets +2{p} against a Light hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [spewShadowRed],
        banished: [snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: boltyn, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(spewShadowRed);
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      optionalBoolean: true,
      ordering: "listed",
    });

    expectFabCard(Dash, spewShadowRed).toBeIn("graveyard");
    Dash.attackWith(snatchRed, { from: "banished" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: the chosen attack stays printed {p} against a non-Light hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [spewShadowRed],
        banished: [snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(spewShadowRed);
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      optionalBoolean: true,
      ordering: "listed",
    });
    Dash.attackWith(snatchRed, { from: "banished" });
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: attacking the Light hero's ALLY is not attacking a Light hero", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [spewShadowRed],
        banished: [snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: boltyn, hand: [], life: 20, arena: [kyloria], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(boltyn);

    Dash.play(spewShadowRed);
    game.helpers.resolveUntilIdle({
      entityTargets: "minimum",
      optionalBoolean: true,
      ordering: "listed",
    });
    Dash.attackWith(snatchRed, {
      from: "banished",
      targetInstanceId: Boltyn.cardIn("arena", kyloria).instanceId,
    });
    game.advanceCombatTo("defend");

    // The latch's "attacks a Light hero" filter keys on the declared hero
    // target; an attack aimed at Boltyn's ally has none.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: printed 2{d} still defends an opposing attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: boltyn,
        hand: [spewShadowRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(boltyn);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith(spewShadowRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Boltyn).toHaveLife(18);
    expectFabCard(Boltyn, spewShadowRed).toBeIn("graveyard");
  });
});
