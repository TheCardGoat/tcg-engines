import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { melodySingAlong } from "./melody-sing-along.ts";
import { jinglewoodSmashHit } from "../weapons/jinglewood-smash-hit.ts";
import { songOfJackBeQuickBlue } from "../actions/song-of-jack-be-quick.ts";

/**
 * Melody, Sing Along (TCC049) — Bard Hero — Young.
 *
 * Printed: "Whenever you play a song, create Copper tokens equal to the number
 * of other heroes in the game." (1v1: one opponent → one Copper.)
 *
 * Signature weapon: Jinglewood Smash Hit (TCC050).
 */

const opponentHero = dash;

describe("melody-sing-along (TCC049) AAA", () => {
  it("core mechanic: playing a Song creates Copper tokens equal to other heroes (1 opponent = 1 Copper)", () => {
    // song-of-jack-be-quick-blue (TCC064) is a cost-0 Bard Action Song.
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        hand: [songOfJackBeQuickBlue],
        deck: 6,
        actionPoints: 1,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Melody = game.as(melodySingAlong);

    Melody.must.play(songOfJackBeQuickBlue);

    expectFabToken(game, "copper").toHaveCount(1).toBeIn("arena");
    expectFabPlayer(Melody).toHaveTokenCount("copper", 1);
    expectFabPlayer(game.as(opponentHero)).toHaveTokenCount("copper", 0);
  });

  it("signature weapon: Jinglewood Smash Hit (TCC050) ability — opponent chooses a token, Melody gets Copper", () => {
    // Once per Turn Action - {r}{r}{r}: Target opposing hero chooses and
    // creates a Might, Quicken, or Vigor token. You create a Copper token. Go again.
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        weapon1: [jinglewoodSmashHit],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Melody = game.as(melodySingAlong);

    Melody.activate(jinglewoodSmashHit, {
      abilityId: `${jinglewoodSmashHit.canonicalId}:oncePerTurnActionResourceResourceResourceTargetOpposingChoosesCreatesMightQuickenVigorTokenCreateCopperTokenGoAgain`,
    });
    game.passBoth();
    game.as(opponentHero).choose("might");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Melody).toHaveResourceCount(0);
    expectFabToken(game, "copper").toHaveCount(1);
    expectFabToken(game, "might").toHaveCount(1);
    expectFabPlayer(Melody).toHaveAP(1); // go again refunds the action point
  });

  it("signature weapon: Jinglewood Smash Hit attack hits at 2 power and destroys itself", () => {
    // Action - 0: Attack (2{p}). When this hits, destroy it.
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        weapon1: [jinglewoodSmashHit],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Melody = game.as(melodySingAlong);

    Melody.activate(jinglewoodSmashHit, {
      abilityId: `${jinglewoodSmashHit.canonicalId}:action0AttackHitsDestroy`,
    });
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });

    // Unblocked 2{p} hit: Dash at 18 and the fiddle destroyed itself.
    expectCombat(game).toBeClosed();
    expectFabPlayer(game.as(opponentHero)).toHaveLife(18);
    expect(Melody.zone("weapon1")).toHaveLength(0);
  });

  it("boundaries: Jinglewood Smash Hit is once per turn — second activation is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: melodySingAlong,
        weapon1: [jinglewoodSmashHit],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Melody = game.as(melodySingAlong);

    Melody.activate(jinglewoodSmashHit, {
      abilityId: `${jinglewoodSmashHit.canonicalId}:oncePerTurnActionResourceResourceResourceTargetOpposingChoosesCreatesMightQuickenVigorTokenCreateCopperTokenGoAgain`,
    });
    game.passBoth();
    game.as(opponentHero).choose("might");
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    Melody.expectActivationRejected(jinglewoodSmashHit);
  });
});
