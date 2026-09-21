/** Public acceptance cases for the remaining Marked effect primitives. */
import { describe, expect, it } from "vitest";
import { markWithMagmaRed } from "../../../cards/src/cards/actions/mark-with-magma.ts";
import { huntToTheEndsOfRatheRed } from "../../../cards/src/cards/actions/hunt-to-the-ends-of-rathe.ts";
import { kunaiOfRetribution } from "../../../cards/src/cards/weapons/kunai-of-retribution.ts";
import { cutFromTheSameClothRed } from "../../../cards/src/cards/actions/cut-from-the-same-cloth.ts";
import { cutFromTheSameClothYellow } from "../../../cards/src/cards/actions/cut-from-the-same-cloth.ts";
import { cutFromTheSameClothBlue } from "../../../cards/src/cards/actions/cut-from-the-same-cloth.ts";
import { twoSidesToTheBladeRed } from "../../../cards/src/cards/attack-reactions/two-sides-to-the-blade.ts";
import { longWhiskerLoyaltyRed } from "../../../cards/src/cards/attack-reactions/long-whisker-loyalty.ts";
import { takeUpTheMantleYellow } from "../../../cards/src/cards/attack-reactions/take-up-the-mantle.ts";
import { takeAStabRed } from "../../../cards/src/cards/attack-reactions/take-a-stab.ts";
import { takeAStabYellow } from "../../../cards/src/cards/attack-reactions/take-a-stab.ts";
import { takeAStabBlue } from "../../../cards/src/cards/attack-reactions/take-a-stab.ts";
import { searingGazeRed } from "../../../cards/src/cards/attack-reactions/searing-gaze.ts";
import { stabbingPainRed } from "../../../cards/src/cards/attack-reactions/stabbing-pain.ts";
import { lairOfTheSpiderRed } from "../../../cards/src/cards/defense-reactions/lair-of-the-spider.ts";
import { denOfTheSpiderRed } from "../../../cards/src/cards/defense-reactions/den-of-the-spider.ts";
import { layLowYellow } from "../../../cards/src/cards/defense-reactions/lay-low.ts";
import { prowlRed } from "../../../cards/src/cards/actions/prowl.ts";
import { infectBlue } from "../../../cards/src/cards/actions/infect.ts";
import { harmonizedKodachi } from "../../../cards/src/cards/weapons/harmonized-kodachi.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash } from "./fixtures.ts";
import { cindra } from "../../../cards/src/cards/heroes/cindra.ts";

describe("remaining Marked AAA", () => {
  it("CIN016 grants its hit-to-mark trigger only after two Draconic chain links", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, markWithMagmaRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(cindra);
    const defender = game.as(dash);
    attacker.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    attacker.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    attacker.attackWith(markWithMagmaRed);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[defender.id]!.marked).toBe(true);
  });

  it.each([searingGazeRed, stabbingPainRed])(
    "%s binds its conditional hit-to-mark trigger to the selected dagger",
    (reaction) => {
      const game = FabTestEngine.start(
        {
          hero: cindra,
          weapon1: [kunaiOfRetribution],
          hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, reaction],
          resourcePoints: 2,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, deck: 6 },
        { autoPassPriority: false },
      );
      const attacker = game.as(cindra);
      const defender = game.as(dash);
      attacker.attackWith(huntToTheEndsOfRatheRed);
      game.advanceCombatTo("resolution");
      attacker.attackWith(huntToTheEndsOfRatheRed);
      game.advanceCombatTo("resolution");
      expect(attacker.actionPoints()).toBe(1);
      attacker.activate(kunaiOfRetribution);
      game.passBoth();
      game.passBoth();
      defender.defendWith([]);
      attacker.pass();
      defender.pass();
      const daggerId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain.at(-1)!;
      attacker.play(reaction, { targetInstanceId: daggerId });
      game.helpers.resolveRestOfCombat();

      expect(game.getState().players[defender.id]!.marked).toBe(true);
    },
  );

  it("HNT051's stealth mode binds its hit-to-mark trigger to the selected attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [prowlRed, twoSidesToTheBladeRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    attacker.attackWith(prowlRed);
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    const attackId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
    attacker.play(twoSidesToTheBladeRed, { targetInstanceId: attackId, modeIndexes: [1] });
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[defender.id]!.marked).toBe(true);
  });

  it("HNT102 arms a one-shot delayed mark for its selected dagger", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        weapon1: [kunaiOfRetribution],
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, longWhiskerLoyaltyRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(cindra);
    const defender = game.as(dash);
    attacker.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    attacker.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    attacker.activate(kunaiOfRetribution);
    game.passBoth();
    game.passBoth();
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    const daggerId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain.at(-1)!;
    attacker.play(longWhiskerLoyaltyRed, {
      targetInstanceId: daggerId,
      modeIds: [
        "969HqThPzMmQtFhM9mNq8:chooseForEachDraconicLink:boostDagger",
        "969HqThPzMmQtFhM9mNq8:chooseForEachDraconicLink:additionalDaggerAttack",
        "969HqThPzMmQtFhM9mNq8:chooseForEachDraconicLink:markOnNextHit",
      ],
    });
    game.passBoth();
    if (game.getState().decision?.kind === "boolean") attacker.chooseBoolean(false);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[defender.id]!.marked).toBe(true);
    expect(game.getState().delayedTriggers).toHaveLength(0);
  });

  it("HNT014 applies its marked-target replacement bonus to the selected stealth attack", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [prowlRed, takeUpTheMantleYellow], actionPoints: 1, deck: 6 },
      { hero: dash, marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    attacker.attackWith(prowlRed);
    game.as(dash).defendWith([]);
    attacker.pass();
    game.as(dash).pass();
    const attackId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
    attacker.play(takeUpTheMantleYellow, { targetInstanceId: attackId });
    game.passBoth();
    if (game.getState().decision?.kind === "boolean") attacker.chooseBoolean(false);

    expect(game.combat()?.activeLink?.attackPower).toBe(6); // Prowl 3 + marked branch 3
  });

  it("HNT014 banishes the chosen graveyard stealth attack and copies its hit ability", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [prowlRed, takeUpTheMantleYellow],
        graveyard: [infectBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    attacker.attackWith(prowlRed);
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    const attackId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
    const _answerTarget = (instanceId: string) => {
      const decision = game.getState().decision!;
      attacker.exec({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [instanceId] },
        },
      });
    };
    attacker.play(takeUpTheMantleYellow, { targetInstanceId: attackId });
    // CR 6.4.7 self-replacement evaluates the marked-hero clause when the
    // base +2 is generated; accept the printed optional banish and pick the
    // graveyard stealth attack whose hit ability the target copies.
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: infectBlue.canonicalId,
    });
    game.passBoth();

    expect(attacker.zone("banished")).toContain(infectBlue.canonicalId);
    game.helpers.resolveRestOfCombat();
    expect(defender.zone("arena")).toContain("token:bloodrot-pox");
  });

  it("HNT191 observes go again on the defended attack, not the defending trap", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [markWithMagmaRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [lairOfTheSpiderRed], deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    attacker.attackWith(markWithMagmaRed);
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    attacker.pass();
    defender.play(lairOfTheSpiderRed);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[attacker.id]!.marked).toBe(true);
  });

  it("HNT214 compares the defended attack's current power to its base power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [harmonizedKodachi],
        hand: [takeAStabRed],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [denOfTheSpiderRed], deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    attacker.activate(harmonizedKodachi);
    game.passBoth();
    game.passBoth();
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    const daggerId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
    attacker.play(takeAStabRed, { targetInstanceId: daggerId });
    game.passBoth();
    attacker.pass();
    defender.play(denOfTheSpiderRed);
    game.helpers.resolveRestOfCombat();

    expect(game.getState().players[attacker.id]!.marked).toBe(true);
  });

  it.each([
    [cutFromTheSameClothRed, 4],
    [cutFromTheSameClothYellow, 3],
    [cutFromTheSameClothBlue, 2],
  ] as const)(
    "%s marks after revealing an attack reaction and grants its printed next-dagger bonus",
    (action, bonus) => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          weapon1: [harmonizedKodachi],
          hand: [action],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 6,
        },
        { hero: dash, hand: [takeAStabRed], deck: 6 },
        { autoPassPriority: false },
      );
      const attacker = game.as(bravo);
      const defender = game.as(dash);
      attacker.play(action);
      game.helpers.resolveUntilIdle();

      expect(game.getState().players[defender.id]!.marked).toBe(true);

      attacker.activate(harmonizedKodachi);
      game.passBoth();
      expect(game.combat()?.activeLink?.attackPower).toBe(1 + bonus);
    },
  );

  it("HNT202 does not mark when the revealed hand has no attack reaction", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [cutFromTheSameClothRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [infectBlue], deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);

    attacker.play(cutFromTheSameClothRed);
    game.helpers.resolveUntilIdle();

    expect(game.getState().players[defender.id]!.marked).toBe(false);
  });

  it("HNT236 cannot be played by a marked defender", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [markWithMagmaRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [layLowYellow], marked: true, deck: 6 },
      { autoPassPriority: false },
    );
    const attacker = game.as(bravo);
    const defender = game.as(dash);
    attacker.attackWith(markWithMagmaRed);
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    attacker.pass();

    expect(() => defender.play(layLowYellow)).toThrow(/cannot|restrict|illegal/i);
  });

  it.each([takeAStabRed, takeAStabYellow, takeAStabBlue])(
    "%s grants the selected dagger its marked-hit additional attack",
    (reaction) => {
      const game = FabTestEngine.start(
        { hero: bravo, weapon1: [harmonizedKodachi], hand: [reaction], resourcePoints: 2, deck: 6 },
        { hero: dash, marked: true, deck: 6 },
        { autoPassPriority: false },
      );
      const attacker = game.as(bravo);
      const defender = game.as(dash);
      attacker.activate(harmonizedKodachi);
      game.passBoth();
      game.passBoth();
      defender.defendWith([]);
      attacker.pass();
      defender.pass();
      const daggerId = game.getState().containers.zonesByPlayerId[attacker.id]!.combatChain[0]!;
      attacker.play(reaction, { targetInstanceId: daggerId });
      game.passBoth();
      game.helpers.resolveRestOfCombat();
      // CR 5.2.3c: the marked-hit grant applies by itself (no boolean to
      // answer) and changes only the activation limit — it creates no AP.
      expect(attacker.actionPoints()).toBe(0);
      attacker.expectActivationRejected(harmonizedKodachi, "insufficient_action_points");
    },
  );
});
