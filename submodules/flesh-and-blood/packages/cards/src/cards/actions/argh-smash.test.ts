import { describe, expect, it } from "vitest";
import { FabTestEngine, fabToken } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { arghSmashYellow } from "./argh-smash.ts";

/**
 * Argh... Smash! (CRU009) — Brute Action, cost 3, def 3.
 *
 * Printed text (i18n, source of truth):
 * "Roll a 6 sided die. Destroy up to X items, where X is half the number
 * rolled, rounded down.
 * Go again"
 *
 * /fab-rules Mode B handoff (behavior constraints):
 * - A d6 roll feeds X = floor(roll / 2); the controller destroys UP TO X
 *   items in play ("up to" permits fewer, including zero when X = 0).
 * - Go again refunds the action point spent on this non-attack action.
 *
 * Module verdict: the authored `roll` -> `destroy up-to roll-result/2
 * rounded down` sequence implements the printed behavior faithfully. Each
 * test pins a seeded fixture so the die roll is deterministic.
 */

const seeded = (seed: string) =>
  ({ seed, autoPassPriority: false, autoPitch: false, pitchStack: "manual" }) as const;

const COPPER = fabToken("copper").canonicalId;

/** Fixture A: three Copper items in play (two controller's, one opponent's). */
function startArghGame(seed: string) {
  return FabTestEngine.start(
    {
      hero: dash,
      hand: [arghSmashYellow],
      arena: [fabToken("copper"), fabToken("copper")],
      resourcePoints: 4,
      actionPoints: 2,
      deck: 6,
    },
    { hero: kano, hand: [], arena: [fabToken("copper")], deck: 6 },
    seeded(seed),
  );
}

describe("Argh... Smash! (CRU009) AAA", () => {
  it("rolls 3 and destroys exactly one item: X = floor(3/2) = 1", () => {
    const game = startArghGame("w3b-argh-pin");
    const Dash = game.as(dash);
    const Kano = game.as(kano);

    Dash.play(arghSmashYellow);
    game.helpers.resolveUntilIdle({
      entityTargets: "maximum",
      optionalBoolean: false,
      ordering: "listed",
    });

    const roll = game.committedEvents().find((event) => event.name === "roll");
    expect(roll?.data).toMatchObject({ sides: 6, result: 3 });
    expect(game.committedEvents().filter((event) => event.name === "destroy")).toHaveLength(1);

    // 3 items were in play; exactly one was smashed (2 Coppers remain).
    expect(
      Dash.zone("arena").filter((id) => id === COPPER).length +
        Kano.zone("arena").filter((id) => id === COPPER).length,
    ).toBe(2);
    // The action resolved and go again refunded its action point.
    expect(Dash.zone("graveyard")).toContain(arghSmashYellow.canonicalId);
    expect(Dash.actionPoints()).toBe(2);
  });

  it("rolls 4 and destroys two items: X = floor(4/2) = 2", () => {
    const game = startArghGame("w3b-argh-b");
    const Dash = game.as(dash);
    const Kano = game.as(kano);

    Dash.play(arghSmashYellow);
    game.helpers.resolveUntilIdle({
      entityTargets: "maximum",
      optionalBoolean: false,
      ordering: "listed",
    });

    const roll = game.committedEvents().find((event) => event.name === "roll");
    expect(roll?.data).toMatchObject({ result: 4 });
    expect(game.committedEvents().filter((event) => event.name === "destroy")).toHaveLength(2);

    // Only 1 of the 3 Coppers survives the two-item smash.
    expect(
      Dash.zone("arena").filter((id) => id === COPPER).length +
        Kano.zone("arena").filter((id) => id === COPPER).length,
    ).toBe(1);
    expect(Dash.zone("graveyard")).toContain(arghSmashYellow.canonicalId);
  });

  it("boundary: a roll of 1 yields X = 0 — nothing is destroyed", () => {
    // Seed/roll pairs are fixture-dependent: this fixture seats exactly one
    // Copper with the controller and rolls 1 under seed w3b-a5.
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [arghSmashYellow],
        arena: [fabToken("copper")],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kano, hand: [], deck: 6 },
      seeded("w3b-a5"),
    );
    const Dash = game.as(dash);

    Dash.play(arghSmashYellow);
    game.helpers.resolveUntilIdle({
      entityTargets: "maximum",
      optionalBoolean: false,
      ordering: "listed",
    });

    const roll = game.committedEvents().find((event) => event.name === "roll");
    expect(roll?.data).toMatchObject({ result: 1 });
    // Half of 1 rounded down is 0: the up-to-0 destroy is a clean no-op.
    expect(game.committedEvents().filter((event) => event.name === "destroy")).toHaveLength(0);
    expect(Dash.zone("arena").filter((id) => id === COPPER).length).toBe(1);
    expect(Dash.zone("graveyard")).toContain(arghSmashYellow.canonicalId);
    expect(Dash.actionPoints()).toBe(2);
  });
});
