import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { weaveEarthRed } from "./weave-earth.ts";
import { nimblismBlue } from "./nimblism.ts";
import { elementalStrikeRed } from "./elemental-strike.ts";

/**
 * Elemental Strike Red (PEN205) — Elemental Attack Action, 5{p}.
 *
 * Printed: As an additional cost, banish a card from your hand. If it's
 * Earth, +2{p}. Lightning, go again. Ice, dominate.
 */

describe("Elemental Strike (PEN205) AAA", () => {
  it("happy: banishing an Earth card gives +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [elementalStrikeRed, weaveEarthRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(elementalStrikeRed);

    expectFabCard(Briar, weaveEarthRed).toBeIn("banished");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("happy: chooses the required card when multiple hand cards are eligible", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [elementalStrikeRed, weaveEarthRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    game.playInstance(
      Briar.id,
      Briar.findCardInZone("hand", elementalStrikeRed),
      { target: game.as(dash).id },
      "explicit",
    );
    Briar.target(weaveEarthRed);
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Briar, weaveEarthRed).toBeIn("banished");
    expectFabCard(Briar, nimblismBlue).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: banishing a Generic card stays at printed 5{p} and has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [elementalStrikeRed, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(elementalStrikeRed);

    expectFabCard(Briar, nimblismBlue).toBeIn("banished");
    expectCombat(game).toHaveAttackPower(5);
    expectCombat(game).notToHaveKeyword("go-again");
  });

  it("timing: the Earth bonus expires after combat", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [elementalStrikeRed, weaveEarthRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.playAttack(elementalStrikeRed);
    Dash.defendWith();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabPlayer(Briar).toHaveAP(0);
  });
});
