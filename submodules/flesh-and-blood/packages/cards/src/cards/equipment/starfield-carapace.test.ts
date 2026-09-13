import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { auricShardsRed } from "../instants/auric-shards.ts";
import { aphrodias } from "../weapons/aphrodias.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { starfieldCarapace } from "./starfield-carapace.ts";

/**
 * Starfield Carapace (AZS004) — printed:
 * 'Instant - Destroy this: Until end of turn, an Aphrodias you control costs
 * {r} less to activate and gets "Whenever this deals damage to an opposing
 * hero, create a Lightning Flow token." Blade Break'
 *
 * Mode B (fab-rules): CR 5.2 destroy-self is paid at activation; glossary
 * Instant — no action point, any layer, active player; the −1{r} activation
 * discount and the granted dealt-damage trigger are until-end-of-turn
 * continuous effects on the Aphrodias object (they outlive the destroyed
 * chest until the turn ends).
 */
describe("Starfield Carapace (AZS004) AAA", () => {
  it("happy: destroyed chest discounts Aphrodias to 0{r} and its arcane hit mints a Lightning Flow", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        chest: [starfieldCarapace],
        weapon1: [aphrodias],
        arena: [lightningFlow, auricShardsRed],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    // Zyggy's hero power: mint an aura with a holo counter (enters this turn).
    Zyggy.activate(zyggyStarlight);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabCard(Zyggy, auricShardsRed).toHaveCounters(1, "holo");

    // Starfield Carapace: destroy this to buff Aphrodias until end of turn.
    Zyggy.activate(starfieldCarapace);
    game.passBoth();
    Zyggy.chooseTargets(aphrodias);
    expectFabCard(Zyggy, starfieldCarapace).toBeIn("graveyard");

    // Aphrodias' printed {r} cost is fully discounted — 0 resource points left.
    Zyggy.activate(aphrodias);
    Zyggy.chooseTargetPlayers(Dash);
    game.passBoth();
    game.passBoth();

    expect(Dash.life()).toBe(18);
    // The granted trigger fired on the arcane damage to the opposing hero.
    expect(Zyggy.zone("arena")).toContain("token:lightning-flow");
  });

  it("boundary: without the carapace buff, Aphrodias' printed {r} cost cannot be paid at 0 resources", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        weapon1: [aphrodias],
        arena: [lightningFlow, auricShardsRed],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.activate(zyggyStarlight);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    // 0{r} left, nothing in hand to pitch: the undiscounted activation fails.
    Zyggy.expectActivationRejected(aphrodias);
  });

  it("timing: the grant outlives the destroyed chest this turn, then the window closes at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        chest: [starfieldCarapace],
        weapon1: [aphrodias],
        arena: [lightningFlow, auricShardsRed],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.activate(zyggyStarlight);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    Zyggy.activate(starfieldCarapace);
    game.passBoth();
    Zyggy.chooseTargets(aphrodias);

    // Source destroyed, grant still live: the discounted activation resolves.
    expectFabCard(Zyggy, starfieldCarapace).toBeIn("graveyard");
    Zyggy.activate(aphrodias);
    Zyggy.chooseTargetPlayers(game.as(dash));
    game.passBoth();
    game.passBoth();
    expect(game.as(dash).life()).toBe(18);

    // Once the turn passes, the until-EOT window (discount + this-turn holo
    // status) is gone and Aphrodias cannot be activated next turn.
    game.helpers.passPriorityTo(Zyggy);
    Zyggy.endTurn();
    game.as(dash).endTurn();

    Zyggy.expectActivationRejected(aphrodias);
  });
});
