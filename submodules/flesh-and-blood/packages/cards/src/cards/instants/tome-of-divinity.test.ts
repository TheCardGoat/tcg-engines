import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { tomeOfDivinityYellow } from "./tome-of-divinity.ts";
import { heraldOfEruditionYellow } from "../actions/herald-of-erudition.ts";

/**
 * Tome of Divinity (JDG067) — Light Instant.
 * Printed: "Draw 2 cards. If a card has been put into your soul this turn,
 * instead draw 3 cards."
 */
describe("Tome of Divinity (JDG067) AAA", () => {
  it("happy: after a card went to the soul this turn, the Tome draws 3 instead of 2", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfEruditionYellow, tomeOfDivinityYellow],
        resourcePoints: 6,
        deck: 9,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Prism = game.as(prism);

    // Herald of Erudition hits and puts itself into Prism's soul.
    Prism.playAttack(heraldOfEruditionYellow);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Prism.cardsIn("soul", heraldOfEruditionYellow)).toHaveLength(1);

    Prism.play(tomeOfDivinityYellow);
    game.helpers.untilIdle();

    // 6{r} seeded: 2 for the Herald + 4 for the Tome. Hand: tome + 2 Herald
    // draws - tome + 3 Tome draws = 5.
    expect(Prism.zone("hand").length).toBe(5);
    expectFabCard(Prism, tomeOfDivinityYellow).toBeIn("graveyard");
  });

  it("boundary: without a soul-put this turn the Tome draws only 2", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfEruditionYellow, tomeOfDivinityYellow],
        resourcePoints: 6,
        deck: 9,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Prism = game.as(prism);

    Prism.play(tomeOfDivinityYellow);
    game.helpers.untilIdle();

    // Hand: herald + 2 draws = 3.
    expect(Prism.zone("hand").length).toBe(3);
    expectFabCard(Prism, tomeOfDivinityYellow).toBeIn("graveyard");

    // The Herald still lands its soul-put afterwards, with its own draw 2.
    Prism.playAttack(heraldOfEruditionYellow);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expect(Prism.cardsIn("soul", heraldOfEruditionYellow)).toHaveLength(1);
    expect(Prism.zone("hand").length).toBe(4);
  });
});
