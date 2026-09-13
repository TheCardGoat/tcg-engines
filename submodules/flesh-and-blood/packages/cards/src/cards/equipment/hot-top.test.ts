import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { bravo } from "../heroes/bravo.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironsongResponseRed } from "../attack-reactions/ironsong-response.ts";
import { hotTop } from "./hot-top.ts";

/**
 * Hot Top — Warrior Head d1, Blade Break.
 *
 * Printed: "When this defends a weapon attack, you may put an attack reaction
 * card from your graveyard on top of your deck. Blade Break"
 */
describe("Hot Top AAA", () => {
  it("happy: defending a weapon attack retrieves the graveyard AR onto the deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [dawnblade],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: 20,
        head: [hotTop],
        graveyard: [ironsongResponseRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(kassaiOfTheGoldenSand).activateAttack(dawnblade);
    Bravo.defendWith(hotTop);
    game.closeCombat({ optionals: "accept" });

    // The accepted optional put the attack reaction on top of the deck.
    expect(Bravo.zone("deck").at(-1)).toBe(ironsongResponseRed.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(ironsongResponseRed.canonicalId);
    expectFabPlayer(Bravo).toHaveLife(18); // dawnblade 3 − 1
    // Blade Break: the helm defended and paid its seat.
    expectFabCard(Bravo, hotTop).toBeIn("graveyard");
  });

  it("boundary: defending a non-weapon attack retrieves nothing — the AR stays buried", () => {
    const game = FabTestEngine.start(
      { hero: kassaiOfTheGoldenSand, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        head: [hotTop],
        graveyard: [ironsongResponseRed],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(kassaiOfTheGoldenSand).playAttack(snatchRed, { stopAt: "defend" });
    Bravo.defendWith(hotTop);
    game.closeCombat({ optionals: "decline" });

    // snatch is not a weapon — the defended-attack gate kept the trigger silent.
    expect(Bravo.zone("graveyard")).toContain(ironsongResponseRed.canonicalId);
    expect(Bravo.zone("deck")).not.toContain(ironsongResponseRed.canonicalId);
    // The helm still defended, so Blade Break fired.
    expectFabCard(Bravo, hotTop).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(17); // snatch 4 − 1
  });
});
