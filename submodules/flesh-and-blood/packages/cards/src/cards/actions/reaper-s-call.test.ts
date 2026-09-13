import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { reaperSCallRed } from "./reaper-s-call.ts";

describe("Reaper's Call family AAA", () => {
  it("happy: Instant — Discard this marks the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [reaperSCallRed],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.activate(reaperSCallRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Arakni, reaperSCallRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toBeMarked();
    expectFabPlayer(Arakni).toHaveAP(0);
  });

  it("boundary: playing it as an attack does not mark on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [reaperSCallRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(reaperSCallRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: the discard ability can mark on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      { hero: arakni, hand: [reaperSCallRed], actionPoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Arakni = game.as(arakni);

    Dash.pass();
    Arakni.activate(reaperSCallRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Arakni, reaperSCallRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toBeMarked();
  });
});
