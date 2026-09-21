import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dromai } from "../heroes/dromai.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismRed, nimblismBlue } from "../actions/nimblism.ts";
import { pledgeFealtyRed } from "../instants/pledge-fealty.ts";

/**
 * Fealty (CIN028) — Draconic Token - Aura, created by Pledge Fealty (FNG020).
 * Printed: "Instant - Destroy this: The next card you play this turn is
 * Draconic. At the beginning of your end phase, if you haven't created a
 * Fealty token or played a Draconic card this turn, destroy this."
 */
describe("Fealty (CIN028) AAA", () => {
  it("happy: burning the Fealty makes the next card played this turn Draconic", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [pledgeFealtyRed, nimblismRed, nimblismBlue],
        resourcePoints: 0,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(pledgeFealtyRed);
    game.untilIdle({ optionals: "throw" });
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1);

    Dromai.activate("token:fealty");
    game.untilIdle({ optionals: "throw" });
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 0);

    Dromai.play(nimblismRed);
    expectFabCard(Dromai, nimblismRed).toHaveSupertype("Draconic");
    game.untilIdle({ optionals: "throw" });
    expectFabCard(Dromai, nimblismRed).toBeIn("graveyard").notToHaveSupertype("Draconic");

    // The grant is consumed by the first card, not inherited by the next play.
    Dromai.play(nimblismBlue);
    expectFabCard(Dromai, Dromai.cardIn("stack", nimblismBlue)).notToHaveSupertype("Draconic");
    game.untilIdle({ optionals: "throw" });
    expectFabCard(Dromai, Dromai.cardIn("graveyard", nimblismBlue)).notToHaveSupertype("Draconic");
  });

  it("boundary: without burning the Fealty, the played card is not Draconic", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [pledgeFealtyRed, nimblismRed],
        resourcePoints: 0,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(pledgeFealtyRed);
    game.untilIdle({ optionals: "throw" });
    Dromai.play(nimblismRed);
    expectFabCard(Dromai, nimblismRed).notToHaveSupertype("Draconic");
    game.untilIdle({ optionals: "throw" });

    const played = Dromai.cardsIn("graveyard", nimblismRed)[0]!;
    expectFabCard(Dromai, played).notToHaveSupertype("Draconic");
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1);
  });

  it("timing: the Fealty survives the turn it was created, then dies at a quiet end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: dromai,
        hand: [pledgeFealtyRed],
        resourcePoints: 0,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        life: 20,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    Dromai.play(pledgeFealtyRed);
    game.untilIdle({ optionals: "throw" });

    // Created a Fealty this turn — the end-phase destroy does not fire.
    Dromai.endTurn();
    game.untilIdle({ optionals: "throw" });
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 1);

    // A quiet turn with no Fealty creation and no Draconic card played.
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "throw" });
    Dromai.endTurn();
    game.untilIdle({ optionals: "throw" });
    expectFabPlayer(Dromai).toHaveTokenCount("fealty", 0);
  });
});
