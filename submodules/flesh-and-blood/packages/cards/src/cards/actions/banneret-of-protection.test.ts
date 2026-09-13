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
import { banneretOfProtectionYellow } from "./banneret-of-protection.ts";

describe("Banneret of Protection (DTD050) AAA", () => {
  it("happy: charging this to soul creates a Spellbane Aegis token", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfProtectionYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfProtectionYellow,
    });
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfProtectionYellow).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("spellbane-aegis", 1);
  });

  it("boundary: charging a different card does not create Spellbane Aegis from this", () => {
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

    Boltyn.attackWith(crossTheLineRed, { charge: true, chargeCard: nimblismBlue });
    game.closeCombat();

    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
    expectFabPlayer(Boltyn).toHaveTokenCount("spellbane-aegis", 0);
  });

  it("timing: playing this as an attack does not create Spellbane Aegis", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [banneretOfProtectionYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.attackWith(banneretOfProtectionYellow);
    game.closeCombat();

    expectFabCard(Boltyn, banneretOfProtectionYellow).toBeIn("graveyard");
    expectFabPlayer(Boltyn).toHaveTokenCount("spellbane-aegis", 0);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
