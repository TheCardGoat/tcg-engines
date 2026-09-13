import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { snatchRed } from "./snatch.ts";
import { seekEnlightenmentRed } from "./seek-enlightenment.ts";

/**
 * Seek Enlightenment (MON081) — Light Action, cost 1, 2{d}, go again.
 *
 * Printed: The next attack action card you play this turn gains +3{p} and
 * "If this hits, put it into your hero's soul." Go again.
 */

describe("Seek Enlightenment family AAA", () => {
  it("happy: next attack action gains +3{p} and files to soul on hit", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seekEnlightenmentRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kano = game.as(kano);

    Dash.play(seekEnlightenmentRed);
    game.untilIdle();
    expectFabPlayer(Dash).toHaveAP(1);

    Dash.playAttack(snatchRed);
    game.untilIdle({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });

    expectFabPlayer(Kano).toHaveLife(8);
    expectFabCard(Dash, snatchRed).toBeIn("soul");
    expectFabCard(Dash, seekEnlightenmentRed).toBeIn("graveyard");
  });

  it("boundary: only the first attack action this turn is buffed", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seekEnlightenmentRed, snatchRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kano = game.as(kano);

    Dash.play(seekEnlightenmentRed);
    game.untilIdle();
    Dash.playAttack(snatchRed);
    game.untilIdle({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });
    Dash.playAttack(snatchRed);
    game.untilIdle({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });

    expectFabPlayer(Kano).toHaveLife(4);
    expect(Dash.zone("soul").filter((id) => id === snatchRed.canonicalId)).toHaveLength(1);
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
  });

  it("timing: a fully blocked attack does not hit, so nothing files to the soul", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [seekEnlightenmentRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: kano,
        hand: [snatchRed, snatchRed, snatchRed, snatchRed],
        life: 15,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kano = game.as(kano);

    Dash.play(seekEnlightenmentRed);
    game.untilIdle();
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Kano.defendWith(snatchRed, snatchRed, snatchRed, snatchRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Kano).toHaveLife(15);
    expectFabCard(Dash, snatchRed).toBeIn("graveyard");
  });
});
