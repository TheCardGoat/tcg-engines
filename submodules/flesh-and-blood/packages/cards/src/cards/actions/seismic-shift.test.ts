import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { seismicShiftRed } from "./seismic-shift.ts";

/**
 * Seismic Shift (PEN020) — Guardian Action.
 *
 * Printed: As an additional cost to play this, {t} X Seismic Surge tokens
 * you control. Destroy X target aura tokens.
 *
 * Tap-X is the destroy-X play-cost sibling. Resolution destroy reads X from
 * costBindings. Aura identity is Token + Aura; 1v1 "target aura tokens" is
 * player any.
 */

describe("Seismic Shift (PEN020) AAA", () => {
  it("happy: tapping 1 Seismic Surge destroys 1 opposing aura token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [seismicShiftRed],
        arena: [fabToken("seismic-surge")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("might")], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const surge = Bravo.cardsIn("arena", fabToken("seismic-surge"))[0]!;
    const might = Dash.cardsIn("arena", fabToken("might"))[0]!;

    game.playInstance(
      Bravo.id,
      Bravo.findCardInZone("hand", seismicShiftRed),
      { xValue: 1 },
      "explicit",
    );
    Bravo.target(might);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Bravo, surge).toBeTapped();
    expectFabPlayer(Dash).toHaveTokenCount("might", 0);
    expectFabCard(Bravo, seismicShiftRed).toBeIn("graveyard");
  });

  it("boundary: X=0 taps nothing and destroys no aura tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [seismicShiftRed],
        arena: [fabToken("seismic-surge")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("might")], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(seismicShiftRed, { xValue: 0 });
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveTokenCount("seismic-surge", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 1);
    expectFabCard(Bravo, seismicShiftRed).toBeIn("graveyard");
  });

  it("timing: the Surge stays in the arena after being tapped", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [seismicShiftRed],
        arena: [fabToken("seismic-surge")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [fabToken("might")], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const surge = Bravo.cardsIn("arena", fabToken("seismic-surge"))[0]!;
    const might = Dash.cardsIn("arena", fabToken("might"))[0]!;

    game.playInstance(
      Bravo.id,
      Bravo.findCardInZone("hand", seismicShiftRed),
      { xValue: 1 },
      "explicit",
    );
    Bravo.target(might);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Bravo, surge).toBeIn("arena");
    expectFabCard(Bravo, surge).toBeTapped();
  });
});
