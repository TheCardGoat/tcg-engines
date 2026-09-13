import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { wideBlueYonderBlue } from "./wide-blue-yonder.ts";

/**
 * Wide Blue Yonder, Blue (MST085) — Mystic Attack Reaction, cost 0, 2{d}.
 *
 * Printed: "Target attack gets +1{p} for each blue card you've pitched this turn."
 */

describe("Wide Blue Yonder (MST085) AAA", () => {
  it("happy: target attack gets +1{p} per blue pitched this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [brutalAssaultBlue, wideBlueYonderBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    // Cost 2 is covered by one pitch-3 blue; a second blue is never pitched.
    Enigma.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("reaction");
    Enigma.must.playReaction(wideBlueYonderBlue);
    game.passBoth();

    // Brutal Assault 4 + 1 blue pitched = 5.
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Enigma, wideBlueYonderBlue).toBeIn("graveyard");
  });

  it("boundary: with no blues pitched the attack stays at printed power", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [snatchRed, wideBlueYonderBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Enigma.must.playReaction(wideBlueYonderBlue);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +N latches on the targeted attack, not a later one", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [brutalAssaultBlue, wideBlueYonderBlue, nimblismBlue, snatchRed],
        resourcePoints: 0,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.playAttack(brutalAssaultBlue, { pitch: [nimblismBlue] });
    game.advanceCombatTo("reaction");
    Enigma.must.playReaction(wideBlueYonderBlue);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);

    game.helpers.resolveRestOfCombat();
    Enigma.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    expectCombat(game).toHaveAttackPower(4);
  });
});
