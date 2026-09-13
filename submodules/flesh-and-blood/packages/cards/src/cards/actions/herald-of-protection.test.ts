import { describe, it } from "vitest";
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

import { heraldOfProtectionRed } from "./herald-of-protection.ts";

/**
 * Herald of Protection (MON014) — Red cost 2, 7{p}/3{d}. Phantasm.
 * When this hits, put it into your soul and create a Spectral Shield token.
 */

describe("Herald of Protection (MON014) AAA", () => {
  it("happy: when this hits, soul this and create a Spectral Shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfProtectionRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfProtectionRed);
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Prism, heraldOfProtectionRed).toBeIn("soul");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
  });

  it("boundary: a blocked miss does not soul this or create a shield", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfProtectionRed],
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

    Prism.playAttack(heraldOfProtectionRed);
    Dash.defendWith(nimblismBlue, snatchRed);
    game.toReaction("defender");
    Dash.play(pulseOfIsenloftBlue);
    game.closeCombat();

    expectFabCard(Prism, heraldOfProtectionRed).toBeIn("graveyard");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: this stays on the chain until the hit resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [heraldOfProtectionRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(heraldOfProtectionRed);
    expectFabCard(Prism, heraldOfProtectionRed).toBeIn("combatChain");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });
});
