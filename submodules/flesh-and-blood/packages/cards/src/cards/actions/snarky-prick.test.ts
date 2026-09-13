import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snarkyPrickRed } from "./snarky-prick.ts";

describe("Snarky Prick (PEN302) AAA", () => {
  it("happy: looking at a red deck-top lets you destroy it for +4{p}", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [snarkyPrickRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(snarkyPrickRed, { stopAt: "on-attack" });
    // "you may destroy it" — accept, targeting the bound red deck-top.
    const w = game.waitState();
    if (w.kind === "decision" && w.decision.kind === "boolean") {
      Katsu.accept();
    }
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    // Destroyed top card goes to the graveyard and the hit lands 1+4.
    expectFabCard(game.as(dash), snatchRed).toBeIn("graveyard");
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });

  it("boundary: declining the optional on a red deck-top keeps the top card and printed power", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [snarkyPrickRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(snarkyPrickRed, { stopAt: "on-attack" });
    // Errata Bulletin #10 made the destruction optional in ALL cases — the
    // red-top offer must be declinable, leaving the deck untouched.
    Katsu.decline();
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(19); // printed 1{p} hit
    // The declined deck-top stayed exactly where it was (a mandatory destroy
    // would shrink the deck and put the card in the graveyard). The fixture's
    // `deck: 6` fillers stack on top of the seeded deckTop, so 7 is healthy.
    expect(game.as(dash).zone("deck")).toHaveLength(7);
    expect(game.as(dash).zone("graveyard")).toHaveLength(0);
  });

  it("boundary: a blue deck-top does not grant +4{p}", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [snarkyPrickRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deckTop: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(snarkyPrickRed);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("boundary: declining the destroy on a red deck-top keeps the card on the deck", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [snarkyPrickRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deckTop: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(snarkyPrickRed, { stopAt: "on-attack" });
    // Errata Bulletin #10: the destruction is optional in all cases.
    Katsu.decline();
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });

    // The red deck-top stays on top of the private deck (looked at, not
    // destroyed) and no +4{p} was gained.
    expect(game.as(dash).zone("deck")).toHaveLength(7); // deckTop + 6
    expectFabPlayer(game.as(dash)).toHaveLife(19); // 1{p}, no +4
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [snarkyPrickRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(katsu).play(snarkyPrickRed)).toThrow();
    expectFabCard(game.as(katsu), snarkyPrickRed).toBeIn("hand");
  });
});
