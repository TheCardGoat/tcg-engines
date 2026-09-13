import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { riptide } from "../heroes/riptide.ts";
import { snatchRed } from "../actions/snatch.ts";
import { lungingPressBlue } from "../attack-reactions/lunging-press.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { spikePitTrapBlue } from "./spike-pit-trap.ts";

/**
 * Spike Pit Trap (OUT104) — Ranger Defense Reaction Trap, 3{d}.
 *
 * Printed: Legendary Riptide Specialization. When this defends and the
 * attacking hero has played or activated a reaction this chain link, put
 * the top card of their deck into their graveyard, then they lose X{h},
 * where X is the number of cards in their graveyard with that name.
 */

function playTrapFromArsenal(game: FabTestEngine, Riptide: ReturnType<FabTestEngine["as"]>): void {
  const trapId = Riptide.findCardInZone("arsenal", spikePitTrapBlue);
  game.advanceUntil({ stopAt: "reaction" });
  if (!Riptide.hasPriority()) {
    game.toReaction("defender");
  }
  game.playInstance(Riptide.id, trapId, { from: "arsenal" }, "explicit");
  game.passBoth();
}

describe("Spike Pit Trap (OUT104) family behavior AAA", () => {
  it("happy: after an attack reaction, mill the attacker's top card and lose life equal to that name", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, lungingPressBlue],
        actionPoints: 1,
        life: 20,
        deck: [nimblismBlue],
      },
      { hero: riptide, arsenal: [spikePitTrapBlue], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Riptide = game.as(riptide);

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "reaction" });
    Dash.play(lungingPressBlue);
    playTrapFromArsenal(game, Riptide);
    game.passBoth();

    expectFabCard(Riptide, spikePitTrapBlue).toBeIn("combatChain");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: no attacking-hero reaction this chain link does not mill", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        life: 20,
        deck: [nimblismBlue],
      },
      { hero: riptide, arsenal: [spikePitTrapBlue], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Riptide = game.as(riptide);

    Dash.playAttack(snatchRed);
    playTrapFromArsenal(game, Riptide);
    game.passBoth();

    expectFabCard(Riptide, spikePitTrapBlue).toBeIn("combatChain");
    expect(Dash.zone("graveyard")).not.toContain(nimblismBlue.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
