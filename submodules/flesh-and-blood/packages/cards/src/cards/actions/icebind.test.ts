import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { snatchRed } from "./snatch.ts";
import { icebindRed } from "./icebind.ts";

/**
 * Icebind (Red) (UPR119) — Elemental Wizard Action, cost 0, 3 arcane.
 * Printed: Ice Fusion. Deal 3 arcane damage to any target. If Icebind was
 * fused and deals damage to a hero, freeze a card in their arsenal until
 * the start of your next turn.
 *
 * Freeze is not a targeted effect (CR 1.8.5c) — it is generated at
 * resolution after the damage stamp (CR 1.8.6).
 */

describe("Icebind (UPR119) AAA", () => {
  it("happy: fused deal 3 arcane to a hero freezes their arsenal card", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [icebindRed, weaveIceRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(icebindRed, {
      target: Dash.id,
      fuse: true,
      fuseCards: [weaveIceRed],
    });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Iyslander, icebindRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).toBeIn("arsenal");
    expectFabCard(Dash, snatchRed).toBeFrozen();
  });

  it("boundary: unfused deal 3 arcane does not freeze", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [icebindRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(icebindRed, { target: Dash.id });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectFabCard(Iyslander, icebindRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, snatchRed).notToBeFrozen();
  });

  it("timing: the action spends an action point and does not open combat", () => {
    const game = FabTestEngine.start(
      {
        hero: iyslander,
        hand: [icebindRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arsenal: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(icebindRed, { target: game.as(dash).id });
    game.untilIdle({ optionals: "decline", entityTargets: "minimum" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Iyslander).toHaveAP(0);
    expectFabCard(Iyslander, icebindRed).toBeIn("graveyard");
  });
});
