import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hala } from "../heroes/hala.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { displayOfArtistryYellow } from "./display-of-artistry.ts";

/**
 * Display of Artistry (MPW040) — Warrior Attack Reaction, cost 1, 3{d}.
 *
 * Printed: "Target weapon attack gets +2{p}. If the weapon has been
 * sharpened this turn, the attack gets 'Reaction cards get -1{d} while
 * defending this.'"
 */

function sharpenDawnblade(
  game: ReturnType<typeof FabTestEngine.start>,
): ReturnType<typeof game.as> {
  const Hala = game.as(hala);
  Hala.activate(hala);
  game.helpers.resolveUntilIdle({
    entityTargetCanonicalId: dawnblade.canonicalId,
    entityTargets: "minimum",
    ordering: "listed",
    optionalBoolean: false,
  });
  return Hala;
}

describe("Display of Artistry (MPW040) AAA", () => {
  it("happy: sharpened weapon gets +2{p} and reaction cards defending it lose 1{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [dawnblade],
        hand: [displayOfArtistryYellow],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    const Hala = sharpenDawnblade(game);
    Hala.activate(dawnblade); // sharpened: 3 + 1 counter = 4{p}
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.toReaction("defender");
    Dash.must.playReaction(sinkBelowRed);
    game.helpers.passPriorityTo(Hala);
    Hala.must.playReaction(displayOfArtistryYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 + 2 = 6 power vs Sink Below Red 4{d} reduced to 3{d} => 3 damage.
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Hala).toHaveLife(20);
  });

  it("boundary: without sharpening the attack still gets +2{p} but reactions keep their {d}", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [dawnblade],
        hand: [displayOfArtistryYellow],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [sinkBelowRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Hala = game.as(hala);

    Hala.activate(dawnblade); // not sharpened: base 3{p}
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.toReaction("defender");
    Dash.must.playReaction(sinkBelowRed);
    game.helpers.passPriorityTo(Hala);
    Hala.must.playReaction(displayOfArtistryYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 3 + 2 = 5 power vs Sink Below Red's full 4{d} => 1 damage.
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Hala).toHaveLife(20);
  });
});
