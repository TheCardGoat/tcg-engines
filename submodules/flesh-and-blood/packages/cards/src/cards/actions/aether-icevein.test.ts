import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { nimblismBlue } from "./nimblism.ts";
import { aetherIceveinRed } from "./aether-icevein.ts";

/**
 * Aether Icevein (UPR113) — Ice Fusion. Deal 5 arcane to any target.
 * If fused and deals damage to a hero, they discard a card unless they
 * pay {r}{r}.
 *
 * Ice Fusion reveal stays in hand (CR 8.3.17).
 */

describe("Aether Icevein (UPR113) AAA", () => {
  it("happy: fused Icevein deals 5 and the damaged hero discards unless they pay {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [aetherIceveinRed, weaveIceRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(aetherIceveinRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    expectFabCard(Iyslander, weaveIceRed).toBeIn("hand");
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Iyslander, aetherIceveinRed).toBeIn("graveyard");
  });

  it("boundary: unfused Icevein deals 5 and does not force a discard", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [aetherIceveinRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(aetherIceveinRed, { target: Dash.id });
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
    expectFabCard(Iyslander, aetherIceveinRed).toBeIn("graveyard");
  });

  it("timing: play leaves the layer on the stack before resolution", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [aetherIceveinRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(aetherIceveinRed, { target: game.as(dash).id });

    expectFabCard(Iyslander, aetherIceveinRed).toBeIn("stack");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
