/**
 * Assassin play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { volticBoltRed } from "../../../../cards/src/cards/actions/voltic-bolt.ts";
import { fateForeseenRed } from "../../../../cards/src/cards/defense-reactions/fate-foreseen.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { hitAndRunBlue } from "../../../../cards/src/cards/actions/hit-and-run.ts";
import { cintariSaber } from "../../../../cards/src/cards/weapons/cintari-saber.ts";
import { oasisRespiteRed } from "../../../../cards/src/cards/instants/oasis-respite.ts";
import { decimatorGreatAxe } from "../../../../cards/src/cards/weapons/decimator-great-axe.ts";
import { cleaveRed } from "../../../../cards/src/cards/actions/cleave.ts";
import { fellingSwingRed } from "../../../../cards/src/cards/actions/felling-swing.ts";
import { fellingSwingBlue } from "../../../../cards/src/cards/actions/felling-swing.ts";
import { blazeFiremind } from "../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { oathOfLoyaltyRed } from "../../../../cards/src/cards/actions/oath-of-loyalty.ts";
import { provokeBlue } from "../../../../cards/src/cards/attack-reactions/provoke.ts";
import { shelterFromTheStormRed } from "../../../../cards/src/cards/defense-reactions/shelter-from-the-storm.ts";
import { kabutoOfImperialAuthority } from "../../../../cards/src/cards/equipment/kabuto-of-imperial-authority.ts";
import { fangDracaiOfBlades } from "../../../../cards/src/cards/heroes/fang-dracai-of-blades.ts";
import { rippleAwayBlue } from "../../../../cards/src/cards/actions/ripple-away.ts";
import { fatalEngagementBlue } from "../../../../cards/src/cards/attack-reactions/fatal-engagement.ts";
import { bluntenYellow } from "../../../../cards/src/cards/blocks/blunten.ts";
import { pillarOfUnity } from "../../../../cards/src/cards/equipment/pillar-of-unity.ts";
import { quicken } from "../../../../cards/src/cards/tokens/quicken.ts";
import { sirensOfSafeHarborBlue } from "../../../../cards/src/cards/actions/sirens-of-safe-harbor.ts";
import { sharpenSteelRed } from "../../../../cards/src/cards/actions/sharpen-steel.ts";
import { steelbladeShuntRed } from "../../../../cards/src/cards/defense-reactions/steelblade-shunt.ts";
import { brothersInArmsBlue } from "../../../../cards/src/cards/actions/brothers-in-arms.ts";
import { lastDitchEffortBlue } from "../../../../cards/src/cards/actions/last-ditch-effort.ts";
import { enlightenedStrikeRed } from "../../../../cards/src/cards/actions/enlightened-strike.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { overpowerBlue } from "../../../../cards/src/cards/attack-reactions/overpower.ts";
import { sinkBelowRed } from "../../../../cards/src/cards/defense-reactions/sink-below.ts";
import { braveforgeBracers } from "../../../../cards/src/cards/equipment/braveforge-bracers.ts";
import { sigilOfSolaceRed } from "../../../../cards/src/cards/instants/sigil-of-solace.ts";
import { heartOfFyendalBlue } from "../../../../cards/src/cards/resources/heart-of-fyendal.ts";

import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "../../testing/index.ts";
import { emptyDash, toDefend, manual } from "./helpers.ts";

describe("Assassin play lines", () => {
  describe("Fang, Dracai of Blades", () => {
    it("FA-01 [AAA] Cleave then Decimator hits for the buffed axe total", () => {
      const game = FabTestEngine.start(
        {
          hero: fangDracaiOfBlades,
          weapon1: [decimatorGreatAxe],
          hand: [oathOfLoyaltyRed, brothersInArmsBlue, provokeBlue, overpowerBlue],
          arsenal: [cleaveRed],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Fang = game.as(fangDracaiOfBlades);
      const Defender = game.as(dash);

      Fang.must.playFromArsenal(cleaveRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Fang).toHaveAP(1);

      Fang.must.activate(decimatorGreatAxe);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(8);
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(12);
      expectFabCard(Fang, cleaveRed).toBeIn("graveyard");
      expectFabCard(Fang, oathOfLoyaltyRed).toBeIn("hand");
      Fang.must.endTurn();
      expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("FA-H2 [AAA] Oath is legal only as the first action and then locks non-Draconic plays", () => {
      const first = FabTestEngine.start(
        {
          hero: fangDracaiOfBlades,
          weapon1: [decimatorGreatAxe],
          hand: [oathOfLoyaltyRed, cleaveRed, fellingSwingBlue, fatalEngagementBlue],
          arsenal: [fellingSwingRed],
          resourcePoints: 3,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Fang = first.as(fangDracaiOfBlades);
      Fang.must.playAttack(oathOfLoyaltyRed);
      toDefend(first);
      first.as(dash).must.defend();
      first.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Fang).toHaveAP(1);
      expect(() => Fang.must.play(cleaveRed)).toThrow();
      expect(() => Fang.must.play(fellingSwingBlue)).toThrow();
      expectFabCard(Fang, cleaveRed).toBeIn("hand");
      expect(Fang.zone("arsenal")).toEqual([fellingSwingRed.canonicalId]);

      const late = FabTestEngine.start(
        {
          hero: fangDracaiOfBlades,
          weapon1: [decimatorGreatAxe],
          hand: [oathOfLoyaltyRed, cleaveRed, fellingSwingBlue, fatalEngagementBlue],
          arsenal: [fellingSwingRed],
          resourcePoints: 3,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Late = late.as(fangDracaiOfBlades);
      Late.must.play(cleaveRed);
      late.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(() => Late.must.playAttack(oathOfLoyaltyRed)).toThrow(
        /play condition is not satisfied/,
      );
      expectFabCard(Late, oathOfLoyaltyRed).toBeIn("hand");
      expectFabPlayer(Late).toHaveAP(1);
    });

    it("FA-02 [AAA] Sharpen and Felling buff this Decimator chain; Fatal needs an attack-action", () => {
      for (const variant of ["axe-buff", "fatal-buff"] as const) {
        const game = FabTestEngine.start(
          {
            hero: fangDracaiOfBlades,
            weapon1: [decimatorGreatAxe],
            hand: [sharpenSteelRed, fellingSwingRed, fatalEngagementBlue, lastDitchEffortBlue],
            arsenal: [oathOfLoyaltyRed],
            resourcePoints: variant === "axe-buff" ? 6 : 5,
            deck: 8,
          },
          {
            hero: dash,
            hand: [snatchRed, steelbladeShuntRed, fateForeseenRed, brothersInArmsBlue],
            deck: 8,
          },
          manual,
        );
        const Fang = game.as(fangDracaiOfBlades);
        const Defender = game.as(dash);

        Fang.must.play(sharpenSteelRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Fang).toHaveAP(1);

        if (variant === "axe-buff") {
          Fang.must.play(fellingSwingRed);
          game.helpers.resolveUntilIdle({ ordering: "listed" });
          expectFabPlayer(Fang).toHaveAP(1).toHaveResourceCount(3);
          Fang.must.activate(decimatorGreatAxe);
          game.advanceCombatTo("defend");
          expectCombat(game).toHaveAttackPower(13);
          Defender.must.defend(snatchRed);
          game.advanceCombatTo("reaction");
          expectFabCard(Fang, fatalEngagementBlue).toBeIn("hand");
          game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
          expectFabPlayer(Defender).toHaveLife(8);
          expectFabCard(Fang, sharpenSteelRed).toBeIn("graveyard");
          expectFabCard(Fang, fellingSwingRed).toBeIn("graveyard");
        } else {
          Fang.must.playAttack(lastDitchEffortBlue);
          game.advanceCombatTo("defend");
          expectCombat(game).toHaveAttackPower(4);
          Defender.must.defend(snatchRed);
          game.advanceCombatTo("reaction");
          game.helpers.passPriorityTo(Fang);
          Fang.must.playReaction(fatalEngagementBlue);
          game.passBoth();
          expectCombat(game).toHaveAttackPower(7);
          game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
          expectFabPlayer(Defender).toHaveLife(14);
          expectFabCard(Fang, fatalEngagementBlue).toBeIn("graveyard");
          expectFabCard(Fang, lastDitchEffortBlue).toBeIn("graveyard");
        }

        expectCombat(game).toBeClosed();
        expect(Fang.zone("arsenal")).toEqual([oathOfLoyaltyRed.canonicalId]);
        Fang.must.endTurn();
        expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });

    it("FA-03 [AAA] each Enlightened Strike mode pays, resolves, and ends the turn exactly", () => {
      for (const mode of ["draw", "power", "go-again"] as const) {
        const game = FabTestEngine.start(
          {
            hero: fangDracaiOfBlades,
            weapon1: [decimatorGreatAxe],
            hand: [
              enlightenedStrikeRed,
              sirensOfSafeHarborBlue,
              rippleAwayBlue,
              heartOfFyendalBlue,
            ],
            arsenal: [cleaveRed],
            resourcePoints: 0,
            life: 15,
            deck: 8,
          },
          { hero: dash, hand: [], life: 20, deck: 8 },
          manual,
        );
        const Fang = game.as(fangDracaiOfBlades);
        const Defender = game.as(dash);

        Fang.play(enlightenedStrikeRed, {
          modeIndexes: [mode === "draw" ? 0 : mode === "power" ? 1 : 2],
          target: Defender.id,
        });
        game.advanceCombatTo("defend");
        expectCombat(game).toHaveAttackPower(mode === "power" ? 7 : 5);
        if (mode === "go-again") expectCombat(game).toHaveKeyword("go-again");
        else expectCombat(game).notToHaveKeyword("go-again");
        const bottomed = [heartOfFyendalBlue, rippleAwayBlue, sirensOfSafeHarborBlue].filter(
          (card) => Fang.zone("deck").includes(card.canonicalId),
        );
        expect(bottomed).toHaveLength(1);
        if (mode === "draw") expectFabPlayer(Fang).toHaveHandCount(3);
        else expectFabPlayer(Fang).toHaveHandCount(2);

        Defender.must.defend();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Defender).toHaveLife(mode === "power" ? 13 : 15);
        expectFabCard(Fang, enlightenedStrikeRed).toBeIn("graveyard");

        if (mode === "go-again") {
          expectFabPlayer(Fang).toHaveAP(1);
          Fang.must.pitch(heartOfFyendalBlue).playFromArsenal(cleaveRed);
          game.helpers.resolveUntilIdle({ ordering: "listed" });
          expectFabCard(Fang, heartOfFyendalBlue).toBeIn("pitch");
          expectFabCard(Fang, cleaveRed).toBeIn("graveyard");
          expectFabPlayer(Fang).toHaveAP(1).toHaveResourceCount(2);
        } else {
          expectFabPlayer(Fang).toHaveAP(0);
          expect(Fang.zone("arsenal")).toEqual([cleaveRed.canonicalId]);
        }

        Fang.must.endTurn();
        expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });

    it("FA-04 [AAA] Overpower Reprise buffs the weapon after one action defense", () => {
      const game = FabTestEngine.start(
        {
          hero: fangDracaiOfBlades,
          weapon1: [decimatorGreatAxe],
          hand: [steelbladeShuntRed, bluntenYellow, overpowerBlue, provokeBlue],
          arsenal: [fellingSwingRed],
          resourcePoints: 9,
          deck: 8,
        },
        {
          hero: dash,
          hand: [snatchRed, snatchRed, brothersInArmsBlue, fateForeseenRed],
          deck: 8,
        },
        manual,
      );
      const Fang = game.as(fangDracaiOfBlades);
      const Defender = game.as(dash);

      Fang.must.playFromArsenal(fellingSwingRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Fang.must.activate(decimatorGreatAxe);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(10);
      const firstSnatch = Defender.cardsIn("hand", snatchRed)[0]!;
      Defender.must.defend(firstSnatch);
      expectFabCard(Defender, firstSnatch).toBeIn("combatChain");
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Fang);
      Fang.must.playReaction(overpowerBlue);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(14);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(7);
      expectFabCard(Fang, overpowerBlue).toBeIn("graveyard");
      expectFabCard(Fang, fellingSwingRed).toBeIn("graveyard");
      expectFabCard(Fang, steelbladeShuntRed).toBeIn("hand");
      expectFabCard(Fang, bluntenYellow).toBeIn("hand");
      expectFabCard(Fang, provokeBlue).toBeIn("hand");
      Fang.must.endTurn();
      expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("FA-05 [AAA] Oasis prevention and Sigil life-gain stay distinct under mixed damage", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          hand: [volticBoltRed, snatchRed, snatchRed, snatchRed],
          resourcePoints: 2,
          actionPoints: 2,
          life: 17,
          deck: 8,
        },
        {
          hero: fangDracaiOfBlades,
          hand: [oasisRespiteRed, sigilOfSolaceRed, brothersInArmsBlue, lastDitchEffortBlue],
          arsenal: [oathOfLoyaltyRed],
          resourcePoints: 1,
          deck: 8,
        },
        manual,
      );
      const Attacker = game.as(blazeFiremind);
      const Fang = game.as(fangDracaiOfBlades);

      Attacker.play(volticBoltRed, { target: Fang.id });
      game.helpers.passPriorityTo(Fang);
      Fang.exec({
        move: "begin-play",
        payload: { instanceId: Fang.findCardInZone("hand", oasisRespiteRed) },
      });
      Fang.chooseTargetPlayers(Fang);
      Fang.chooseTargets(Attacker.cardIn("stack", volticBoltRed));
      game.passBoth();
      if (game.getState().decision?.kind === "boolean") Fang.chooseBoolean(false);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Fang).toHaveLife(39);
      expectFabCard(Fang, oasisRespiteRed).toBeIn("graveyard");

      game.helpers.passPriorityTo(Fang);
      Fang.must.playInstant(sigilOfSolaceRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Fang).toHaveLife(42);

      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Fang.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Fang).toHaveLife(38);
      expect(Fang.zone("arsenal")).toEqual([oathOfLoyaltyRed.canonicalId]);
      expectFabCard(Fang, brothersInArmsBlue).toBeIn("hand");
      expectFabCard(Fang, lastDitchEffortBlue).toBeIn("hand");
      Attacker.must.endTurn();
      Fang.must.endTurn();
      expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("FA-H1 [AAA] creates one Fealty only after Decimator hits a marked hero", () => {
      for (const variant of ["marked-hit", "marked-miss", "unmarked-hit"] as const) {
        const game = FabTestEngine.start(
          {
            hero: fangDracaiOfBlades,
            weapon1: [decimatorGreatAxe],
            hand: [fellingSwingRed, brothersInArmsBlue, overpowerBlue, provokeBlue],
            arsenal: [cleaveRed],
            resourcePoints: 6,
            deck: 8,
          },
          {
            hero: dash,
            marked: variant !== "unmarked-hit",
            hand: [fellingSwingRed, fellingSwingRed, fellingSwingRed, fellingSwingRed],
            deck: 8,
          },
          manual,
        );
        const Fang = game.as(fangDracaiOfBlades);
        const Defender = game.as(dash);

        Fang.must.play(fellingSwingRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Fang).toHaveAP(1).toHaveResourceCount(3);
        Fang.must.activate(decimatorGreatAxe);
        game.advanceCombatTo("defend");
        if (variant === "marked-miss") {
          Defender.must.defend(...Defender.cardsIn("hand", fellingSwingRed));
        } else {
          Defender.must.defend();
        }
        game.helpers.resolveUntilIdle({ ordering: "listed", entityTargets: "minimum" });

        expectFabPlayer(Defender).toHaveLife(variant === "marked-miss" ? 20 : 10);
        expect(Fang.zone("arena").filter((card) => card === "token:fealty")).toHaveLength(
          variant === "marked-hit" ? 1 : 0,
        );
        expect(Fang.zone("arsenal")).toEqual([cleaveRed.canonicalId]);
        Fang.must.endTurn();
        expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    // 2-versus-3 Fealty cost delta is public on HNT098: empty-hand 0{r} rejects
    // at 2 and opens combat at 3; a seeded 1{r} is spent at 2 and left at 3.

    it.each(["six-base", "modified"] as const)(
      "FA-E1 [AAA] Decimator halves base defense before bonuses: %s",
      (variant) => {
        const game = FabTestEngine.start(
          {
            hero: fangDracaiOfBlades,
            weapon1: [decimatorGreatAxe],
            hand: [fellingSwingRed, cleaveRed, brothersInArmsBlue, overpowerBlue],
            arsenal: [provokeBlue],
            resourcePoints: 6,
            deck: [
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
            ],
          },
          {
            hero: dash,
            life: 20,
            resourcePoints: variant === "six-base" ? 3 : 1,
            hand:
              variant === "six-base"
                ? [steelbladeShuntRed, snatchRed, snatchRed, fateForeseenRed]
                : [brothersInArmsBlue, snatchRed, snatchRed, fateForeseenRed],
            deck: [
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
            ],
          },
          manual,
        );
        const Fang = game.as(fangDracaiOfBlades);
        const Defender = game.as(dash);

        Fang.must.play(fellingSwingRed);
        game.untilIdle({ optionals: "throw" });
        Fang.activateAttack(decimatorGreatAxe);
        game.advanceUntil({ stopAt: "defend", optionals: "throw" });
        expectCombat(game).toHaveAttackPower(10);

        if (variant === "six-base") {
          Defender.defendWith();
          game.toReaction("defender");
          Defender.must.playReaction(steelbladeShuntRed);
          game.passBoth();
          game.advanceToDecision(Fang, "option");
          // Fang adds the Axe trigger first; Dash adds Shunt's damage trigger.
          Fang.choose(Fang.id);
          // Resolve Shunt's damage, then the Axe's defense reduction.
          game.passBoth();
          game.passBoth();
          game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
          expectFabCard(Defender, steelbladeShuntRed).toHaveDefense(3);
          game.closeCombat({ optionals: "throw" });
          expectFabPlayer(Defender).toHaveLife(13);
          expectFabCard(Defender, steelbladeShuntRed).toBeIn("graveyard").toHaveDefense(6);
        } else {
          Defender.defendWith(brothersInArmsBlue);
          game.advanceToDecision(Defender, "boolean");
          Defender.accept();
          game.advanceUntil({ stopAt: "reaction", optionals: "throw" });
          expectFabCard(Defender, brothersInArmsBlue).toHaveDefense(3);
          game.closeCombat({ optionals: "throw" });
          expectFabPlayer(Defender).toHaveLife(13);
          expectFabCard(Defender, brothersInArmsBlue).toBeIn("graveyard").toHaveDefense(2);
        }

        expectFabCard(Fang, provokeBlue).toBeIn("arsenal");
        Fang.endTurn();
        expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      },
    );

    it("FA-E2 [AAA] Braveforge is illegal before a weapon hit and Battleworn only after it defends", () => {
      const game = FabTestEngine.start(
        {
          hero: fangDracaiOfBlades,
          weapon1: [decimatorGreatAxe],
          arms: [braveforgeBracers],
          hand: [fellingSwingRed, cleaveRed, brothersInArmsBlue, overpowerBlue],
          arsenal: [provokeBlue],
          resourcePoints: 7,
          actionPoints: 2,
          deck: 8,
        },
        {
          hero: dash,
          weapon1: [cintariSaber],
          hand: [hitAndRunBlue, snatchRed, snatchRed, snatchRed],
          deck: 8,
        },
        manual,
      );
      const Fang = game.as(fangDracaiOfBlades);
      const Defender = game.as(dash);
      const bracersId = Fang.findCardInZone("arms", braveforgeBracers);

      const beforeHit = Fang.expectActivationRejected(braveforgeBracers);
      expect(beforeHit.accepted).toBe(false);
      expectFabCard(Fang, braveforgeBracers).toBeIn("arms");
      expect(game.objectState(bracersId)?.defenseCounterTotal ?? 0).toBe(0);

      Fang.must.play(fellingSwingRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Fang.must.activate(decimatorGreatAxe);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(10);
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Defender).toHaveLife(10);

      Fang.must.activate(braveforgeBracers);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Fang).toHaveAP(1).toHaveResourceCount(0);
      Fang.expectActivationRejected(decimatorGreatAxe);
      expect(game.objectState(bracersId)?.defenseCounterTotal ?? 0).toBe(0);
      expect(Fang.zone("arsenal")).toEqual([provokeBlue.canonicalId]);
      Fang.must.endTurn();

      Defender.must.activate(cintariSaber);
      game.answerDecision(Defender.id, {
        kind: "payment",
        instanceIds: [Defender.cardIn("hand", hitAndRunBlue).instanceId],
      });
      game.advanceCombatTo("defend");
      Fang.defendWith(braveforgeBracers);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Fang.zone("arms")).toContain(braveforgeBracers.canonicalId);
      expect(game.objectState(bracersId)?.defenseCounterTotal).toBe(-1);
      expectFabPlayer(Fang).toHaveLife(40);
      Defender.must.endTurn();
      Fang.must.endTurn();
      expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("FA-D1 [AAA] Pillar and paid Brothers gain their independent defense bonuses", () => {
      for (const together of [true, false]) {
        const game = FabTestEngine.start(
          {
            hero: fangDracaiOfBlades,
            legs: [pillarOfUnity],
            hand: [brothersInArmsBlue, steelbladeShuntRed, bluntenYellow, provokeBlue],
            arsenal: [fateForeseenRed],
            deck: 8,
          },
          {
            hero: dash,
            weapon1: [cintariSaber],
            hand: [hitAndRunBlue, snatchRed, snatchRed, snatchRed],
            deck: 8,
          },
          manual,
        );
        const Fang = game.as(fangDracaiOfBlades);
        const Attacker = game.as(dash);
        Fang.must.endTurn();
        Attacker.must.activate(cintariSaber);
        game.answerDecision(Attacker.id, {
          kind: "payment",
          instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
        });
        game.advanceCombatTo("defend");
        Fang.defendWith(together ? [pillarOfUnity, brothersInArmsBlue] : [pillarOfUnity]);
        game.helpers.resolveUntilIdle({
          ordering: "listed",
          ...(together
            ? { optionalBoolean: true, paymentCanonicalId: provokeBlue.canonicalId }
            : {}),
        });

        if (together) {
          expectFabCard(Fang, provokeBlue).toBeIn("pitch");
        }
        expectFabPlayer(Fang)
          .toHaveLife(together ? 40 : 39)
          .toHaveResourceCount(together ? 2 : 0);
        expect(
          game.committedEvents().filter((event) => event.name === "pay-resources"),
        ).toHaveLength(together ? 1 : 0);
        expectFabCard(Fang, pillarOfUnity).toBeIn(together ? "legs" : "graveyard");
        if (together) {
          expectFabCard(Fang, provokeBlue).toBeIn("pitch");
          expectFabCard(Fang, brothersInArmsBlue).toBeIn("graveyard");
        } else expectFabCard(Fang, brothersInArmsBlue).toBeIn("hand");
        expect(Fang.zone("arsenal")).toEqual([fateForeseenRed.canonicalId]);
        Attacker.must.endTurn();
        Fang.must.endTurn();
        expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("FA-D2 [AAA] Blunten and Steelblade Shunt riders require a weapon attack", () => {
      for (const weapon of [true, false]) {
        const game = FabTestEngine.start(
          {
            hero: fangDracaiOfBlades,
            hand: [bluntenYellow, steelbladeShuntRed, brothersInArmsBlue, overpowerBlue],
            arsenal: [sinkBelowRed],
            deck: 8,
          },
          {
            hero: dash,
            weapon1: weapon ? [cintariSaber] : undefined,
            hand: [hitAndRunBlue, snatchRed, snatchRed, snatchRed],
            deck: 8,
          },
          manual,
        );
        const Fang = game.as(fangDracaiOfBlades);
        const Attacker = game.as(dash);
        Fang.must.endTurn();
        if (weapon) {
          Attacker.must.activate(cintariSaber);
          game.answerDecision(Attacker.id, {
            kind: "payment",
            instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
          });
        } else Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Fang.must.defend(bluntenYellow);
        if (weapon) {
          for (let safety = 0; !game.getState().decision && safety < 8; safety += 1) {
            const priorityPlayerId = game.getPriorityPlayerId();
            if (!priorityPlayerId) break;
            game.pass(priorityPlayerId);
          }
          const chosenDiscard = Attacker.cardsIn("hand", snatchRed)[0]!;
          Attacker.chooseTargets(chosenDiscard);
        }
        game.advanceCombatTo("reaction");
        game.helpers.passPriorityTo(Fang);
        Fang.must.pitch(overpowerBlue);
        Fang.must.playReaction(steelbladeShuntRed);
        game.helpers.resolveUntilIdle({
          ordering: "listed",
          entityTargetCanonicalId: snatchRed.canonicalId,
        });

        expectFabPlayer(Fang).toHaveLife(40).toHaveResourceCount(2);
        expectFabPlayer(Attacker)
          .toHaveLife(weapon ? 19 : 20)
          .toHaveHandCount(weapon ? 2 : 3);
        expect(game.committedEvents().filter((event) => event.name === "discard")).toHaveLength(
          weapon ? 1 : 0,
        );
        expectFabCard(Fang, bluntenYellow).toBeIn("graveyard");
        expectFabCard(Fang, steelbladeShuntRed).toBeIn("graveyard");
        expect(Fang.zone("arsenal")).toEqual([sinkBelowRed.canonicalId]);
        if (weapon)
          expect(
            Attacker.zone("graveyard").filter((card) => card === snatchRed.canonicalId),
          ).toHaveLength(1);
        game.helpers.resolveRestOfCombat();
        Attacker.must.endTurn();
        Fang.must.endTurn();
        expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("FA-D3 [AAA] Kabuto blocks later weapon attacks but permits attack actions", () => {
      const game = FabTestEngine.start(
        {
          hero: fangDracaiOfBlades,
          head: [kabutoOfImperialAuthority],
          hand: [fateForeseenRed, sinkBelowRed, brothersInArmsBlue, provokeBlue],
          arsenal: [steelbladeShuntRed],
          deck: 8,
        },
        {
          hero: dash,
          weapon1: [cintariSaber],
          weapon2: [cintariSaber],
          arena: [quicken],
          hand: [hitAndRunBlue, snatchRed, snatchRed, snatchRed],
          actionPoints: 3,
          resourcePoints: 4,
          deck: 8,
        },
        manual,
      );
      const Fang = game.as(fangDracaiOfBlades);
      const Attacker = game.as(dash);
      Fang.must.endTurn();

      const firstSaber = Attacker.cardIn("weapon1", cintariSaber);
      const secondSaber = Attacker.cardIn("weapon2", cintariSaber);
      Attacker.must.activate(firstSaber);
      game.answerDecision(Attacker.id, {
        kind: "payment",
        instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
      });
      game.advanceCombatTo("defend");
      Fang.defendWith(kabutoOfImperialAuthority);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabCard(Fang, kabutoOfImperialAuthority).toBeIn("graveyard");
      expectFabPlayer(Fang).toHaveLife(40);
      const rejectedWeapon = Attacker.expectFailure({
        move: "activate",
        payload: { instanceId: secondSaber.instanceId },
      });
      expect(rejectedWeapon.errorCode).toBe("restricted_by_rule");
      expectFabPlayer(Attacker).toHaveAP(1).toHaveResourceCount(2);

      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Fang.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Fang).toHaveLife(36);
      expect(Fang.zone("arsenal")).toEqual([steelbladeShuntRed.canonicalId]);
      Attacker.must.endTurn();
      expectFabPlayer(Attacker).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("FA-D4 [AAA] Shelter covers the next three packets and Oasis can still gain life", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          hand: [volticBoltRed, snatchRed, snatchRed, snatchRed],
          resourcePoints: 2,
          actionPoints: 3,
          life: 17,
          deck: 8,
          deckTop: [brothersInArmsBlue, rippleAwayBlue],
        },
        {
          hero: fangDracaiOfBlades,
          hand: [oasisRespiteRed, shelterFromTheStormRed, brothersInArmsBlue, rippleAwayBlue],
          arsenal: [sinkBelowRed],
          resourcePoints: 1,
          life: 16,
          deck: 8,
        },
        manual,
      );
      const Attacker = game.as(blazeFiremind);
      const Fang = game.as(fangDracaiOfBlades);

      Attacker.pass();
      Fang.must.activate(shelterFromTheStormRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Fang, shelterFromTheStormRed).toBeIn("graveyard");

      Attacker.play(volticBoltRed, { target: Fang.id });
      Attacker.pass();
      Fang.exec({
        move: "begin-play",
        payload: { instanceId: Fang.findCardInZone("hand", oasisRespiteRed) },
      });
      Fang.chooseTargetPlayers(Fang);
      Fang.chooseTargets(Attacker.cardIn("stack", volticBoltRed));
      game.passBoth();
      if (game.getState().decision?.kind === "boolean") Fang.chooseBoolean(true);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
      expectFabCard(Fang, oasisRespiteRed).toBeIn("graveyard");

      for (let i = 0; i < 2; i += 1) {
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Fang.must.defend();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
      }

      expectFabPlayer(Fang).toHaveLife(11);
      expectFabCard(Fang, brothersInArmsBlue).toBeIn("hand");
      expectFabCard(Fang, rippleAwayBlue).toBeIn("hand");
      expect(Fang.zone("arsenal")).toEqual([sinkBelowRed.canonicalId]);
      expect(game.renderedPlayerNarrative(Attacker.id)).toEqual([
        "Opponent activated Shelter From The Storm.",
        "You played Voltic Bolt.",
        "Opponent played Oasis Respite.",
        "Opponent gained 1 life.",
        "Opponent prevented 1 damage with Shelter From The Storm.",
        "Opponent prevented 4 damage with Oasis Respite.",
        "You played Snatch.",
        "You attacked Opponent with Snatch.",
        "Opponent prevented 1 damage with Shelter From The Storm.",
        "Snatch hit Opponent for 3.",
        "You drew: Ripple Away.",
        "You played Snatch.",
        "You attacked Opponent with Snatch.",
        "Opponent prevented 1 damage with Shelter From The Storm.",
        "Snatch hit Opponent for 3.",
        "You drew: Brothers In Arms.",
      ]);
      expect(game.renderedPlayerNarrative(Fang.id)).toEqual([
        "You activated Shelter From The Storm.",
        "Opponent played Voltic Bolt.",
        "You played Oasis Respite.",
        "You gained 1 life.",
        "You prevented 1 damage with Shelter From The Storm.",
        "You prevented 4 damage with Oasis Respite.",
        "Opponent played Snatch.",
        "Opponent attacked You with Snatch.",
        "You prevented 1 damage with Shelter From The Storm.",
        "Snatch hit You for 3.",
        "Opponent drew a card.",
        "Opponent played Snatch.",
        "Opponent attacked You with Snatch.",
        "You prevented 1 damage with Shelter From The Storm.",
        "Snatch hit You for 3.",
        "Opponent drew a card.",
      ]);
      Attacker.must.endTurn();
      Fang.must.endTurn();
      expectFabPlayer(Fang).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
  });
});
