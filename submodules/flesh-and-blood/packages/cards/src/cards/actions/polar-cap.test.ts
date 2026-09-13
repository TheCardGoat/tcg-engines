import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { polarCapRed } from "./polar-cap.ts";

/**
 * Polar Cap (UPR122) — Elemental Wizard Action, Ice Fusion, cost 2, 4 arcane.
 *
 * Printed: Ice Fusion. Deal 4 arcane damage to any target. If Polar Cap was
 * fused and deals damage to a hero, create a Frostbite token under their
 * control.
 *
 * Ice Fusion reveal stays in hand (CR 8.3.17).
 */

describe("Polar Cap (UPR122) AAA", () => {
  it("happy: fused Polar Cap deals 4 and creates a Frostbite under the damaged hero", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [polarCapRed, weaveIceRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(polarCapRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    expectFabCard(Iyslander, weaveIceRed).toBeIn("hand");
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabToken(game, "frostbite").toHaveCount(1);
    expectFabCard(Iyslander, polarCapRed).toBeIn("graveyard");
  });

  it("boundary: unfused Polar Cap deals 4 and creates no Frostbite", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [polarCapRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(polarCapRed, { target: Dash.id });
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabToken(game, "frostbite").toHaveCount(0);
    expectFabCard(Iyslander, polarCapRed).toBeIn("graveyard");
  });

  it("timing: FAB_MANUAL_HARNESS play leaves Polar Cap on the stack; no combat opens", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [polarCapRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(polarCapRed, { target: Dash.id });

    expectFabCard(Iyslander, polarCapRed).toBeIn("stack");
    expectCombat(game).toBeClosed();
    expectFabPlayer(Iyslander).toHaveAP(0);
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
