import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigmaLedgerOfAncestry } from "../heroes/enigma-ledger-of-ancestry.ts";
import { nimblismBlue } from "./nimblism.ts";
import { levelsOfEnlightenmentBlue } from "./levels-of-enlightenment.ts";

const enlightenmentModeId = (modeId: string): string =>
  `${levelsOfEnlightenmentBlue.canonicalId}:attacksChoose1BluePitchedTurnDrawGets2PowerGetsGoAgain:${modeId}`;

describe("Levels of Enlightenment (MST077) AAA", () => {
  it("happy: pitching a blue card this turn lets this choose +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        hand: [levelsOfEnlightenmentBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.playAttack(levelsOfEnlightenmentBlue, {
      pitch: [nimblismBlue],
      stopAt: "on-attack",
    });
    Enigma.choose(enlightenmentModeId("gets2Power"));
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
  });

  it("boundary: with no blue pitched this turn the on-attack modes do not apply +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        hand: [levelsOfEnlightenmentBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.playAttack(levelsOfEnlightenmentBlue, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: pitching a blue card lets the go-again mode refund the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        hand: [levelsOfEnlightenmentBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.playAttack(levelsOfEnlightenmentBlue, {
      pitch: [nimblismBlue],
      stopAt: "on-attack",
    });
    Enigma.choose(enlightenmentModeId("getsGoAgain"));
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat();
    expectFabPlayer(Enigma).toHaveAP(1);
  });
});
