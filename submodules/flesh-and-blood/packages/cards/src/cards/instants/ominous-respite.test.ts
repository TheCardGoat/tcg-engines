import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { agility } from "../tokens/agility.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { ominousRespiteYellow } from "./ominous-respite.ts";

describe("Ominous Respite (OMN218) AAA", () => {
  it("happy: controller gains the base 2{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ominousRespiteYellow],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(ominousRespiteYellow);

    expectFabPlayer(Dash).toHaveLife(22);
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
    expectFabCard(Dash, ominousRespiteYellow).toBeIn("graveyard");
  });

  it("happy: instead gain 3{h} after an aura you control was destroyed this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [agility],
        hand: [ominousRespiteYellow, nimblismBlue],
        life: 20,
        deck: 6,
      },
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle();
    Bravo.play(ominousRespiteYellow, { pitch: [nimblismBlue] });

    expectFabPlayer(Bravo).toHaveLife(23);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("boundary: only the controller gains life", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ominousRespiteYellow],
        resourcePoints: 1,
        life: 18,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).play(ominousRespiteYellow);

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });

  it("timing: can be played on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, life: 20, deck: 6 },
      {
        hero: bravo,
        hand: [ominousRespiteYellow],
        resourcePoints: 1,
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.pass();
    Bravo.play(ominousRespiteYellow);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(22);
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabCard(Bravo, ominousRespiteYellow).toBeIn("graveyard");
  });
});
