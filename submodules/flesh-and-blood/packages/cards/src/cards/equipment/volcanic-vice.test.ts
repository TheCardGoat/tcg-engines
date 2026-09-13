import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { rapidReflexRed } from "../attack-reactions/rapid-reflex.ts";
import { headJabRed } from "../actions/head-jab.ts";
import { bravo } from "../heroes/bravo.ts";
import { figmentOfRavagesYellow } from "../instants/figment-of-ravages.ts";
import { fogDownYellow } from "../actions/fog-down.ts";
import { snatchRed } from "../actions/snatch.ts";
import { magmaticCarapace } from "./magmatic-carapace.ts";
import { volcanicVice } from "./volcanic-vice.ts";

function seatBravoFirst(bravoDeclines: boolean) {
  const game = FabTestEngine.start(
    {
      hero: bravo,
      hand: [fogDownYellow],
      resourcePoints: 4,
      actionPoints: 1,
      chest: [magmaticCarapace],
      arms: [volcanicVice],
      life: 20,
      deck: 6,
    },
    {
      hero: dash,
      hand: [figmentOfRavagesYellow, snatchRed, headJabRed, brutalAssaultBlue, rapidReflexRed],
      resourcePoints: 4,
      deck: 6,
    },
    FAB_MANUAL_HARNESS,
  );
  const Bravo = game.as(bravo);
  const Dash = game.as(dash);

  // Bravo leads, so his seeded RP survive; the aura play is explicit so the
  // carapace's tap-and-pay optional is not auto-declined during the drain.
  const fogId = Bravo.findCardInZone("hand", fogDownYellow);
  game.playInstance(Bravo.id, fogId, {}, "explicit");
  game.untilIdle({ optionals: bravoDeclines ? "decline" : "accept" });
  if (Bravo.hasPriority()) Bravo.pass();
  return { game, Bravo, Dash };
}

describe("Volcanic Vice (PEN018) AAA", () => {
  it("happy: a Surge this turn grants spellvoid 3, preventing the 1 arcane ping", () => {
    const { game, Bravo, Dash } = seatBravoFirst(false);

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
    Dash.play(figmentOfRavagesYellow);
    game.passBoth();
    Dash.target(Bravo);
    game.advanceToDecision(Bravo, "option");
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, volcanicVice).toBeIn("graveyard");
  });

  it("boundary: with no Surge this turn the ping lands and the vice stays", () => {
    const { game, Bravo, Dash } = seatBravoFirst(true);

    Dash.play(figmentOfRavagesYellow);
    game.passBoth();
    Dash.target(Bravo);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, volcanicVice).toBeIn("arms");
  });

  it("timing: last turn's Surge does not grant spellvoid", () => {
    const { game, Bravo, Dash } = seatBravoFirst(false);

    Bravo.endTurn();
    Dash.must
      .pitch(snatchRed, headJabRed, brutalAssaultBlue, rapidReflexRed)
      .play(figmentOfRavagesYellow);
    game.passBoth();
    Dash.target(Bravo);
    game.untilIdle();

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabCard(Bravo, volcanicVice).toBeIn("arms");
  });
});
