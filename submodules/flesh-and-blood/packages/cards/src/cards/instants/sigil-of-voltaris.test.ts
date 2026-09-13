import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { sigilOfVoltarisBlue } from "./sigil-of-voltaris.ts";

describe("Sigil of Voltaris (PEN237) AAA", () => {
  it("happy: entering the arena deals 1 arcane to target hero", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [sigilOfVoltarisBlue], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(sigilOfVoltarisBlue);
    game.untilIdle({ entityTargets: "pause" });
    Kano.target(Dash);
    game.untilIdle();

    expectFabCard(Kano, sigilOfVoltarisBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("boundary: the enter ping may target the controller instead of the opponent", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [sigilOfVoltarisBlue], life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(sigilOfVoltarisBlue);
    game.untilIdle({ entityTargets: "pause" });
    Kano.target(Kano);
    game.untilIdle();

    expectFabPlayer(Kano).toHaveLife(19);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("timing: start of your action phase destroys this and the leave ping deals 1 more", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [sigilOfVoltarisBlue], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(sigilOfVoltarisBlue);
    game.untilIdle({ entityTargets: "pause" });
    Kano.target(Dash);
    game.untilIdle();
    Kano.endTurn();
    Dash.endTurn();
    game.untilIdle({ entityTargets: "pause" });
    Kano.target(Dash);
    game.untilIdle();

    expectFabCard(Kano, sigilOfVoltarisBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(18);
  });
});
