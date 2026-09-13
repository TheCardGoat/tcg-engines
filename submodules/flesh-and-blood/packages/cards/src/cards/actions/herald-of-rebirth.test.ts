import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pulseOfIsenloftBlue } from "../defense-reactions/pulse-of-isenloft.ts";
import { snatchRed } from "./snatch.ts";

import { heraldOfProtectionYellow } from "./herald-of-protection.ts";
import { heraldOfRebirthRed } from "./herald-of-rebirth.ts";

/**
 * Herald of Rebirth (MON020) — Red cost 2, 7{p}/3{d}. Phantasm.
 * When this hits, put it into soul and put up to 1 phantasm card from GY on top of deck.
 */

describe("Herald of Rebirth (MON020) AAA", () => {
  it("happy: when this hits, soul this and put a phantasm card from GY on top of deck", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfRebirthRed],
        graveyard: [heraldOfProtectionYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfRebirthRed);
    game.closeCombat({ entityTargets: "maximum" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Prism, heraldOfRebirthRed).toBeIn("soul");
    expect(Prism.zone("deck").at(-1)).toBe(heraldOfProtectionYellow.canonicalId);
  });

  it("boundary: a blocked miss does not soul this or return a phantasm card", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfRebirthRed],
        graveyard: [heraldOfProtectionYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, snatchRed, pulseOfIsenloftBlue],
        resourcePoints: 2,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(heraldOfRebirthRed);
    Dash.defendWith(nimblismBlue, snatchRed);
    game.toReaction("defender");
    Dash.play(pulseOfIsenloftBlue);
    game.closeCombat();

    expectFabCard(Prism, heraldOfRebirthRed).toBeIn("graveyard");
    expectFabCard(Prism, heraldOfProtectionYellow).toBeIn("graveyard");
  });

  it("timing: this stays on the chain until the hit resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfRebirthRed],
        graveyard: [heraldOfProtectionYellow],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfRebirthRed);
    expectFabCard(Prism, heraldOfRebirthRed).toBeIn("combatChain");
    expectFabCard(Prism, heraldOfProtectionYellow).toBeIn("graveyard");
  });
});
