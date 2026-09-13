import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { aetherSinkYellow } from "./aether-sink.ts";

/**
 * Aether Sink (ARC017) — Mechanologist Action Item, yellow, cost 1.
 *
 * Printed: "Aether Sink enters the arena with a steam counter on it.
 * Action - {r}: If there are no steam counters on Aether Sink, put a steam
 * counter on it. Go again
 * Instant - Remove a steam counter from Aether Sink: Aether Sink gains
 * Arcane Barrier 2 until end of turn."
 */

describe("Aether Sink (ARC017) AAA", () => {
  it("happy: enters with 1 steam; Instant removes it and grants Arcane Barrier 2", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [aetherSinkYellow], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const _Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Dash.play(aetherSinkYellow);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, aetherSinkYellow).toBeIn("arena");
    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(1, "steam");

    Dash.activate(aetherSinkYellow, {
      abilityId: `${aetherSinkYellow.canonicalId}:instantRemoveSteamCounterFromAetherSinkAetherSink`,
    });
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(0, "steam");
    expectFabCard(Dash, aetherSinkYellow).toHaveKeyword("arcane-barrier");
    expectFabCard(Dash, aetherSinkYellow).toBeIn("arena");
  });

  it("happy: Arcane Barrier 2 prevents 2 of 5 arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 2,
        arena: [{ card: aetherSinkYellow, state: { steamCounters: 1 } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.pass();
    Dash.activate(aetherSinkYellow, {
      abilityId: `${aetherSinkYellow.canonicalId}:instantRemoveSteamCounterFromAetherSinkAetherSink`,
    });
    game.untilIdle({ ordering: "listed" });

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const pay = Dash.expectDecision("option");
    Dash.choose(pay.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("boundary: declining Arcane Barrier 2 takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 2,
        arena: [{ card: aetherSinkYellow, state: { steamCounters: 1 } }],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.pass();
    Dash.activate(aetherSinkYellow, {
      abilityId: `${aetherSinkYellow.canonicalId}:instantRemoveSteamCounterFromAetherSinkAetherSink`,
    });
    game.untilIdle({ ordering: "listed" });

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveResourceCount(2);
  });

  it("boundary: Action {r} does not add steam while a steam counter is already on it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: aetherSinkYellow, state: { steamCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(aetherSinkYellow, {
      abilityId: `${aetherSinkYellow.canonicalId}:actionIfThereAreNoSteamCountersAetherSink`,
    });
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(1, "steam");
    expectFabCard(Dash, aetherSinkYellow).toBeIn("arena");
  });

  it("timing: Action {r} reloads steam only after the Instant empties it", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [{ card: aetherSinkYellow, state: { steamCounters: 1 } }],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(aetherSinkYellow, {
      abilityId: `${aetherSinkYellow.canonicalId}:instantRemoveSteamCounterFromAetherSinkAetherSink`,
    });
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(0, "steam");

    Dash.activate(aetherSinkYellow, {
      abilityId: `${aetherSinkYellow.canonicalId}:actionIfThereAreNoSteamCountersAetherSink`,
    });
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Dash, aetherSinkYellow).toHaveCounters(1, "steam");
    expectFabPlayer(Dash).toHaveAP(1);
  });
});
