import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigmaLedgerOfAncestry } from "../heroes/enigma-ledger-of-ancestry.ts";
import { snatchRed } from "../actions/snatch.ts";
import { aquaLaps } from "./aqua-laps.ts";

describe("Aqua Laps (MST070) AAA", () => {
  it("happy: turning this face up as an attack reaction grants the attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        legs: [aquaLaps],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.playAttack(snatchRed);
    game.toReaction("attacker");
    Enigma.activate(aquaLaps);
    game.passBoth();
    expectCombat(game).toHaveKeyword("go-again");
  });

  it("boundary: without the reaction the attack has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        legs: [aquaLaps],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    Enigma.playAttack(snatchRed, { stopAt: "defend" });
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Enigma, aquaLaps).toBeIn("legs");
  });

  it("timing: at the start of your turn this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: enigmaLedgerOfAncestry,
        legs: [aquaLaps],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigmaLedgerOfAncestry);

    expectFabCard(Enigma, aquaLaps).toBeIn("legs");
    Enigma.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle();
    expectFabCard(Enigma, aquaLaps).toBeIn("graveyard");
  });
});
