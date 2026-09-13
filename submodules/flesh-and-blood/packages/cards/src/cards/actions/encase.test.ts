import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { havenVeilRed } from "../instants/haven-veil.ts";
import { encaseRed } from "./encase.ts";

/**
 * Encase (UPR104) — Elemental Wizard Action, cost 0, 3 arcane.
 *
 * Printed: "Ice Fusion\nDeal 3 arcane damage to any target. If Encase was
 * fused and deals damage to a hero, freeze that hero and all equipment they
 * control until the start of your next turn."
 *
 * Fusion reveal stays in hand (CR 8.3.17).
 */

describe("Encase (UPR104) AAA", () => {
  it("happy: fused Encase deals 3 arcane to the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [encaseRed, weaveIceRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        head: [ironrotHelm],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(encaseRed, {
      fuse: true,
      fuseCards: [weaveIceRed],
      target: Dash.id,
    });
    expectFabCard(Iyslander, weaveIceRed).toBeIn("hand");
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, dash).toBeFrozen();
    expectFabCard(Dash, ironrotHelm).toBeFrozen();
    expectFabCard(Iyslander, encaseRed).toBeIn("graveyard");
  });

  it("boundary: unfused Encase still deals 3 without Ice Fusion", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [encaseRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        head: [ironrotHelm],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(encaseRed, { target: Dash.id });
    game.passBoth();
    game.untilIdle({ optionals: "decline", entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Iyslander, encaseRed).toBeIn("graveyard");
  });

  it("timing: fully prevented damage does not freeze the targeted hero or equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [encaseRed, weaveIceRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [havenVeilRed], head: [ironrotHelm], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(encaseRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    Iyslander.pass();
    Dash.must.playInstant(havenVeilRed);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Dash, dash).notToBeFrozen();
    expectFabCard(Dash, ironrotHelm).notToBeFrozen();
    expectFabCard(Iyslander, encaseRed).toBeIn("graveyard");
  });
});
