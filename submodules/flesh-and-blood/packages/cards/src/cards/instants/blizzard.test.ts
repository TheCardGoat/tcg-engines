import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oldhim } from "../heroes/oldhim.ts";
import { briar } from "../shared/test-recipients.ts";
import { ballLightningRed } from "../actions/ball-lightning.ts";
import { blizzardBlue } from "./blizzard.ts";

/**
 * Errata Bulletin #3: "Target attack loses and can't gain go again unless its
 * controller pays {r}{r}." Play window is while an attack is on the chain
 * (not while the attack action is still resolving onto the chain).
 */
describe("Blizzard (ELE147) AAA", () => {
  it("boundary: cannot be played when no attack is on the combat chain", () => {
    const game = FabTestEngine.start(
      { hero: oldhim, hand: [blizzardBlue], deck: 6 },
      { hero: briar, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oldhim = game.as(oldhim);

    expect(() => Oldhim.play(blizzardBlue)).toThrow();
    expectFabCard(Oldhim, blizzardBlue).toBeIn("hand");
  });

  it("happy: target attack loses go again unless its controller pays {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ballLightningRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: oldhim, hand: [blizzardBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Oldhim = game.as(oldhim);

    Briar.attackWith(ballLightningRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.advanceCombatTo("reaction");
    Briar.pass();
    Oldhim.play(blizzardBlue);
    game.passBoth();
    // No resources: escape is unavailable, so principal remove-property applies.

    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    expectFabCard(Oldhim, blizzardBlue).toBeIn("graveyard");
  });

  it("timing: paying {r}{r} keeps go again on the attack", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [ballLightningRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: oldhim, hand: [blizzardBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Oldhim = game.as(oldhim);

    Briar.attackWith(ballLightningRed);
    game.advanceCombatTo("reaction");
    Briar.pass();
    Oldhim.play(blizzardBlue);
    game.passBoth();
    // Escape is a boolean decision for the attacking hero — do not resolveUntilIdle
    // (that would close combat before we can assert the retained go again).
    Briar.chooseBoolean(true);

    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expectFabPlayer(Briar).toHaveResourceCount(0);
  });
});
