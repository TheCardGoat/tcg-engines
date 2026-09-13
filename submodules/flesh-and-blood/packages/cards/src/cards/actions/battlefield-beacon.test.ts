import { describe, it } from "vitest";
import {
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { crossTheLineRed } from "./cross-the-line.ts";
import { luminaLanceYellow } from "../attack-reactions/lumina-lance.ts";
import { nimblismBlue } from "./nimblism.ts";
import { battlefieldBeaconYellow } from "./battlefield-beacon.ts";

/**
 * Battlefield Beacon (SUP266) — Light Warrior Attack, cost 0, 3{p}/3{d}.
 *
 * Printed: "When this attacks, choose 1: Create a Courage token. Create a
 * Toughness token. Create a Vigor token. Repeat this process for each card
 * you've banished from your soul this combat chain."
 *
 * Modal choose is the live count `cards-banished-from-soul-this-combat-chain`.
 * Zero is a determined no-mode resolution, not an unsupported amount.
 */

describe("Battlefield Beacon (SUP266) AAA", () => {
  it("happy: one soul-banish this chain lets the attack create Courage", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, luminaLanceYellow, battlefieldBeaconYellow],
        soul: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const soulId = Boltyn.cardsIn("soul", nimblismBlue)[0]!.instanceId;

    Boltyn.playAttack(crossTheLineRed);
    game.advanceCombatTo("reaction");
    Boltyn.play(luminaLanceYellow, {
      targetInstanceId: soulId,
      modeIds: [`${luminaLanceYellow.canonicalId}:banishSoulAndChooseModes:boostLightAttack`],
    });
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });

    Boltyn.playAttack(battlefieldBeaconYellow, { stopAt: "on-attack" });
    expectWait(game).toHaveDecision("option");
    Boltyn.choose("createCourageToken");
    game.untilIdle({ ordering: "listed" });

    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 1);
    expectFabPlayer(Boltyn).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Boltyn).toHaveTokenCount("vigor", 0);
  });

  it("boundary: with no soul banished this chain the attack creates no tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [battlefieldBeaconYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);

    Boltyn.playAttack(battlefieldBeaconYellow);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
    expectFabPlayer(Boltyn).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Boltyn).toHaveTokenCount("vigor", 0);
  });

  it("timing: a soul-banish on a closed chain does not count for the next combat", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, luminaLanceYellow, battlefieldBeaconYellow],
        soul: [nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const soulId = Boltyn.cardsIn("soul", nimblismBlue)[0]!.instanceId;

    Boltyn.playAttack(crossTheLineRed);
    game.advanceCombatTo("reaction");
    Boltyn.play(luminaLanceYellow, {
      targetInstanceId: soulId,
      modeIds: [`${luminaLanceYellow.canonicalId}:banishSoulAndChooseModes:boostLightAttack`],
    });
    game.closeCombat({ ordering: "listed" });

    Boltyn.playAttack(battlefieldBeaconYellow);
    expectFabPlayer(Boltyn).toHaveTokenCount("courage", 0);
    expectFabPlayer(Boltyn).toHaveTokenCount("toughness", 0);
    expectFabPlayer(Boltyn).toHaveTokenCount("vigor", 0);
  });
});
