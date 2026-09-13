import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { enigma } from "../heroes/enigma.ts";
import { innerChiBlue } from "../resources/inner-chi.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { homageToAncestorsBlue } from "./homage-to-ancestors.ts";
import { risingSunSettingMoonBlue } from "./rising-sun-setting-moon.ts";

/**
 * Rising Sun, Setting Moon (ENG028) — Mystic Instant, cost 0, Legendary.
 *
 * Printed: Draw a card, then put a card from your hand on the bottom of your
 * deck. If you've played another blue card this turn, transcend.
 *
 */

describe("Rising Sun, Setting Moon (ENG028) AAA", () => {
  it("happy: draws, then puts a hand card on the bottom of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [risingSunSettingMoonBlue],
        deckTop: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(risingSunSettingMoonBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Enigma.zone("hand")).not.toContain(nimblismBlue.canonicalId);
    expect(Enigma.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabCard(Enigma, risingSunSettingMoonBlue).toBeIn("graveyard");
  });

  it("boundary: as the first blue card this turn, it does not transcend", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [risingSunSettingMoonBlue],
        deckTop: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(risingSunSettingMoonBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Enigma, risingSunSettingMoonBlue).toBeIn("graveyard");
    expect(Enigma.zone("hand")).not.toContain(innerChiBlue.canonicalId);
  });

  it("timing: after another blue this turn, it transcends; Inner Chi can pitch to play", () => {
    const game = FabTestEngine.start(
      {
        hero: enigma,
        hand: [
          homageToAncestorsBlue,
          risingSunSettingMoonBlue,
          brutalAssaultBlue,
          innerChiBlue,
          nimblismBlue,
        ],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Enigma = game.as(enigma);

    Enigma.play(homageToAncestorsBlue);
    game.helpers.resolveUntilIdle();
    Enigma.play(risingSunSettingMoonBlue, {
      targetInstanceId: Enigma.findCardInZone("hand", nimblismBlue),
    });
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: nimblismBlue.canonicalId });

    expectFabCard(Enigma, risingSunSettingMoonBlue).toBeIn("hand");
    Enigma.playAttack(brutalAssaultBlue, { pitch: [innerChiBlue] });
    expectFabCard(Enigma, innerChiBlue).toBeIn("pitch");
    expectFabCard(Enigma, brutalAssaultBlue).toBeIn("combatChain");
  });
});
