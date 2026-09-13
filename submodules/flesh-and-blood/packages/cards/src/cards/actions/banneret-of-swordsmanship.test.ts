import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "./cross-the-line.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { savingGraceYellow } from "../defense-reactions/saving-grace.ts";
import { banneretOfSwordsmanshipYellow } from "./banneret-of-swordsmanship.ts";

/**
 * Banneret of Swordsmanship, Yellow — Light Warrior Action - Attack, cost 1, 4{p}.
 *
 * Printed: "Solflare - When this is charged to your soul, create a Flurry token."
 */

describe("Banneret of Swordsmanship AAA", () => {
  it("happy: charging this to soul creates a Flurry token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfSwordsmanshipYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfSwordsmanshipYellow,
    });
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfSwordsmanshipYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("flurry", 1);
  });

  it("boundary: charging a different card does not create Flurry from this", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("flurry", 0);
  });

  it("boundary: charging a different card while this is on the chain creates no Flurry", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: boltyn,
        hand: [banneretOfSwordsmanshipYellow, savingGraceYellow, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Boltyn = game.as(boltyn);

    Dash.playAttack(snatchRed);
    Boltyn.defendWith(banneretOfSwordsmanshipYellow);
    game.toReaction("defender");
    Boltyn.play(savingGraceYellow, { chargeCard: nimblismBlue });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabCard(Boltyn, banneretOfSwordsmanshipYellow).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveTokenCount("flurry", 0);
  });
});
