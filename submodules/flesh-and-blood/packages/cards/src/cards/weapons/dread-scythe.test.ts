import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { dreadScythe } from "./dread-scythe.ts";

describe("Dread Scythe (MON229) AAA", () => {
  it("happy: attacking deals 1 arcane plus 3 physical", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [dreadScythe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(dreadScythe);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: once per turn — a second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [dreadScythe],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(dreadScythe);
    game.helpers.resolveRestOfCombat();
    Viserai.expectActivationRejected(dreadScythe);
  });

  it("prevents a hero damaged by Dread Scythe from gaining life in their next action phase", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [dreadScythe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sigilOfSolaceRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.activate(dreadScythe);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16);
    Viserai.endTurn();
    game.untilIdle({ ordering: "listed" });

    Dash.play(sigilOfSolaceRed);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("allows that hero to gain life after their restricted action phase ends", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        weapon1: [dreadScythe],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [sigilOfSolaceRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.activate(dreadScythe);
    game.helpers.resolveRestOfCombat();
    Viserai.endTurn();
    game.untilIdle({ ordering: "listed" });
    Dash.endTurn();
    game.untilIdle({ ordering: "listed" });
    Viserai.pass();

    Dash.play(sigilOfSolaceRed);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveLife(19);
  });
});
