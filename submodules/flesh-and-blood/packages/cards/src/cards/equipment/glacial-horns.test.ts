import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { oldhim } from "../heroes/oldhim.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { glacialHorns } from "./glacial-horns.ts";

/**
 * Glacial Horns — Ice Equipment - Head, d0.
 *
 * Printed: "Action - Destroy this: Choose a hero. Freeze up to 1 card in
 * their arsenal and 1 ally they control until the start of your next turn.
 * Go again"
 */

describe("Glacial Horns (UPR137) AAA", () => {
  it("happy: destroy this to freeze the opposing arsenal card and ally", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, head: [glacialHorns], hand: [], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arsenal: [brutalAssaultBlue],
        arena: [fabToken("cintari-sellsword")],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Bravo = game.as(bravo);

    Oldhim.activate(glacialHorns);
    // The arsenal card is chosen by its owner; the ally by Oldhim.
    game.untilIdle({ entityTargets: "pause" });
    Bravo.target(brutalAssaultBlue);
    game.untilIdle({ entityTargets: "pause" });
    Oldhim.target(fabToken("cintari-sellsword"));
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Oldhim, glacialHorns).toBeIn("graveyard");
    expectFabCard(Bravo, brutalAssaultBlue).toBeIn("arsenal").toBeFrozen();
    expectFabCard(Bravo, fabToken("cintari-sellsword")).toBeFrozen();
  });

  it("timing: the freeze thaws at the start of the wearer's next turn", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, head: [glacialHorns], hand: [], actionPoints: 1, deck: 6 },
      { hero: bravo, arsenal: [brutalAssaultBlue], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);
    const Bravo = game.as(bravo);

    Oldhim.activate(glacialHorns);
    game.untilIdle({ entityTargets: "pause" });
    Bravo.target(brutalAssaultBlue);
    game.untilIdle({ optionals: "accept" });
    expectFabCard(Bravo, brutalAssaultBlue).toBeFrozen();

    Oldhim.endTurn();
    Bravo.endTurn();

    // "Until the start of your next turn" — Oldhim's start phase thaws it.
    expectFabCard(Bravo, brutalAssaultBlue).notToBeFrozen();
  });
});
