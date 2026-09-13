import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { leechRenownRed } from "./leech-renown.ts";

/**
 * Leech Renown (OMN092) — Runeblade Action, cost 1, go again.
 *
 * Printed: The next attack action card you play this turn gets +3{p} and
 * "Whenever this deals damage to a hero, destroy an aura token they control."
 *
 * The granted destroy matches aura tokens (Might, Spectral Shield, …), not
 * the word "Aura" as a card name.
 */

describe("Leech Renown (OMN092) AAA", () => {
  it("happy: the next attack action gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechRenownRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(leechRenownRed);
    game.untilIdle({ optionals: "decline" });
    Viserai.playAttack(brutalAssaultBlue);

    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Viserai, leechRenownRed).toBeIn("graveyard");
  });

  it("boundary: a later attack action does not get the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechRenownRed, brutalAssaultBlue, brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const assaults = Viserai.cardsIn("hand", brutalAssaultBlue);

    Viserai.play(leechRenownRed);
    game.untilIdle({ optionals: "decline" });
    Viserai.playAttack(assaults[0]!);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline" });
    Viserai.playAttack(assaults[1]!);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a hit destroys an aura token they control", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [leechRenownRed, brutalAssaultBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [fabToken("might")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(leechRenownRed);
    game.untilIdle({ optionals: "decline" });
    Viserai.playAttack(brutalAssaultBlue);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });
});
