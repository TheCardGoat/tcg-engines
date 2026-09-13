import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";

/**
 * Homage to Ancestors Blue (ENG026) — Mystic Instant. Legendary.
 *
 * Printed: Gain 1{h}
 * If you've played another blue card this turn, transcend.
 */

describe("Homage to Ancestors (ENG026) AAA", () => {
  it("happy: after another blue card, it transcends back to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [nimblismBlue, homageToAncestorsBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(nimblismBlue); // the other blue card this turn
    game.helpers.resolveUntilIdle();

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveLife(21); // 20 + 1
    // Transcend: flip and put it into the owner's hand.
    expectFabCard(Enigma, homageToAncestorsBlue).toBeIn("hand");
  });

  it("boundary: as the first blue card played, it resolves to the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [homageToAncestorsBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Enigma).toHaveLife(21); // 20 + 1
    expectFabCard(Enigma, homageToAncestorsBlue).toBeIn("graveyard");
  });
});
