import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { biteBlue } from "../actions/bite.ts";
import { nuu } from "../heroes/nuu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { commandAndConquerRed } from "../actions/command-and-conquer.ts";
import { woundingBlowBlue } from "../actions/wounding-blow.ts";
import { sirenSCallRed } from "./siren-s-call.ts";

/**
 * Siren's Call, Red (MST009) — Mystic Assassin Attack Reaction, cost 1, 3{d}.
 *
 * Printed: Look at the defending hero's hand and choose a blue card. Add it
 * to this chain link as a defending card. If you do, draw a card.
 */

describe("Siren's Call (MST009) AAA", () => {
  it("happy: choose a blue from the defending hand and add it as a defender, then draw", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, sirenSCallRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, woundingBlowBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.playAttack(biteBlue);
    game.advanceUntil({ stopAt: "reaction", optionals: "decline" });
    Nuu.must.playReaction(sirenSCallRed);
    game.passBoth();
    Nuu.targetRequired(nimblismBlue);

    expectFabCard(Dash, nimblismBlue).toBeIn("combatChain");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabCard(Dash, woundingBlowBlue).toBeIn("hand");
    expectFabPlayer(Nuu).toHaveHandCount(1);
  });

  it("boundary: with no blue card in the defending hand nothing is added and you do not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, sirenSCallRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, commandAndConquerRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.playAttack(biteBlue);
    game.advanceUntil({ stopAt: "reaction", optionals: "decline" });
    Nuu.must.playReaction(sirenSCallRed);
    game.passBoth();

    expectFabCard(Nuu, sirenSCallRed).toBeIn("graveyard");
    expectFabCard(Dash, snatchRed).toBeIn("hand");
    expectFabCard(Dash, commandAndConquerRed).toBeIn("hand");
    expectFabPlayer(Nuu).toHaveHandCount(0);
  });

  it("timing: playable as an attack reaction, then to graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, sirenSCallRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(biteBlue);
    game.advanceUntil({ stopAt: "reaction", optionals: "decline" });
    Nuu.must.playReaction(sirenSCallRed);
    game.passBoth();
    expectFabCard(Nuu, sirenSCallRed).toBeIn("graveyard");
    expectCombat(game).toBeOpen();
  });
});
