import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { enigma } from "../heroes/enigma.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";
import { moonChakraBlue } from "./moon-chakra.ts";

describe("Moon Chakra family AAA", () => {
  it("happy: after transcending, the blue printing prevents 3 arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [flashBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: enigma,
        hand: [moonChakraBlue, homageToAncestorsBlue],
        resourcePoints: 2,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Enigma = game.as(enigma);

    game.helpers.passPriorityTo(Enigma);
    Enigma.play(moonChakraBlue);
    Enigma.play(homageToAncestorsBlue);
    game.passBoth();
    game.helpers.resolveUntilIdle();

    Bravo.play(flashBoltRed, { target: Enigma.id });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveLife(21);
  });

  it("boundary: without transcending, the blue printing prevents only 1", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [flashBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: enigma, hand: [moonChakraBlue], resourcePoints: 2, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Enigma = game.as(enigma);

    game.helpers.passPriorityTo(Enigma);
    Enigma.play(moonChakraBlue);
    game.passBoth();
    game.helpers.resolveUntilIdle();
    Bravo.play(flashBoltRed, { target: Enigma.id });
    game.passBoth();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveLife(18);
  });
});
