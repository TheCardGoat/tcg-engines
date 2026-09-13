/**
 * Warrior play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { gleamOfTheBladeRed } from "../../../../cards/src/cards/attack-reactions/gleam-of-the-blade.ts";
import { fateForeseenRed } from "../../../../cards/src/cards/defense-reactions/fate-foreseen.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { fryRed } from "../../../../cards/src/cards/actions/fry.ts";
import { ironrotPlate } from "../../../../cards/src/cards/equipment/ironrot-plate.ts";
import { dauntlessRed } from "../../../../cards/src/cards/actions/dauntless.ts";
import { spoilsOfWarRed } from "../../../../cards/src/cards/actions/spoils-of-war.ts";
import { hitAndRunBlue } from "../../../../cards/src/cards/actions/hit-and-run.ts";
import { twinningBladeYellow } from "../../../../cards/src/cards/attack-reactions/twinning-blade.ts";
import { cintariSaber } from "../../../../cards/src/cards/weapons/cintari-saber.ts";
import { glisteningSteelbladeYellow } from "../../../../cards/src/cards/actions/glistening-steelblade.ts";
import { runThroughYellow } from "../../../../cards/src/cards/attack-reactions/run-through.ts";
import { punctureRed } from "../../../../cards/src/cards/attack-reactions/puncture.ts";
import { crownOfDominion } from "../../../../cards/src/cards/equipment/crown-of-dominion.ts";
import { bloodOnHerHandsYellow } from "../../../../cards/src/cards/actions/blood-on-her-hands.ts";
import { sliceAndDiceRed } from "../../../../cards/src/cards/actions/slice-and-dice.ts";
import { bladeRunnerRed } from "../../../../cards/src/cards/attack-reactions/blade-runner.ts";
import { inTheSwingRed } from "../../../../cards/src/cards/attack-reactions/in-the-swing.ts";
import { blazeHeadlongRed } from "../../../../cards/src/cards/actions/blaze-headlong.ts";
import { trotAlongBlue } from "../../../../cards/src/cards/actions/trot-along.ts";
import { jaggedEdgeRed } from "../../../../cards/src/cards/attack-reactions/jagged-edge.ts";
import { provokeBlue } from "../../../../cards/src/cards/attack-reactions/provoke.ts";
import { shelterFromTheStormRed } from "../../../../cards/src/cards/defense-reactions/shelter-from-the-storm.ts";
import { kabutoOfImperialAuthority } from "../../../../cards/src/cards/equipment/kabuto-of-imperial-authority.ts";
import { raiseAnArmyYellow } from "../../../../cards/src/cards/actions/raise-an-army.ts";
import { drawSwordsRed } from "../../../../cards/src/cards/actions/draw-swords.ts";
import { gobletOfBloodrunWineBlue } from "../../../../cards/src/cards/actions/goblet-of-bloodrun-wine.ts";
import { nastySurpriseBlue } from "../../../../cards/src/cards/actions/nasty-surprise.ts";
import { bladeFlurryRed } from "../../../../cards/src/cards/attack-reactions/blade-flurry.ts";
import { grainsOfBloodspill } from "../../../../cards/src/cards/equipment/grains-of-bloodspill.ts";
import { kassaiOfTheGoldenSand } from "../../../../cards/src/cards/heroes/kassai-of-the-golden-sand.ts";
import { hotStreak } from "../../../../cards/src/cards/weapons/hot-streak.ts";
import { nourishingEmptinessRed } from "../../../../cards/src/cards/actions/nourishing-emptiness.ts";
import { valiantDynamo } from "../../../../cards/src/cards/equipment/valiant-dynamo.ts";
import { helmOfAstralSanctuary } from "../../../../cards/src/cards/equipment/helm-of-astral-sanctuary.ts";
import { isolateYellow } from "../../../../cards/src/cards/actions/isolate.ts";
import { highCurrentCurrencyBlue } from "../../../../cards/src/cards/actions/high-current-currency.ts";
import { swordmasterSShineRed } from "../../../../cards/src/cards/attack-reactions/swordmaster-s-shine.ts";
import { bluntenYellow } from "../../../../cards/src/cards/blocks/blunten.ts";
import { quicken } from "../../../../cards/src/cards/tokens/quicken.ts";
import { unsheathedRed } from "../../../../cards/src/cards/actions/unsheathed.ts";
import { richesOfTrPalDhaniYellow } from "../../../../cards/src/cards/resources/riches-of-tr-pal-dhani.ts";
import { beatOfTheIronsongBlue } from "../../../../cards/src/cards/attack-reactions/beat-of-the-ironsong.ts";
import { bloodFollowsBladeYellow } from "../../../../cards/src/cards/attack-reactions/blood-follows-blade.ts";
import { refractionBolters } from "../../../../cards/src/cards/equipment/refraction-bolters.ts";
import { dorintheaIronsong } from "../../../../cards/src/cards/heroes/dorinthea-ironsong.ts";
import { dawnblade } from "../../../../cards/src/cards/weapons/dawnblade.ts";
import { thatAllYouGotYellow } from "../../../../cards/src/cards/defense-reactions/that-all-you-got.ts";
import { crownOfProvidence } from "../../../../cards/src/cards/equipment/crown-of-providence.ts";
import { steelbladeSupremacyRed } from "../../../../cards/src/cards/actions/steelblade-supremacy.ts";
import { warriorSValorRed } from "../../../../cards/src/cards/actions/warrior-s-valor.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { regurgitatingSlogRed } from "../../../../cards/src/cards/actions/regurgitating-slog.ts";
import { glintTheQuicksilverBlue } from "../../../../cards/src/cards/attack-reactions/glint-the-quicksilver.ts";
import { singingSteelbladeYellow } from "../../../../cards/src/cards/attack-reactions/singing-steelblade.ts";
import { overpowerBlue } from "../../../../cards/src/cards/attack-reactions/overpower.ts";
import { ironsongResponseRed } from "../../../../cards/src/cards/attack-reactions/ironsong-response.ts";
import { unmovableRed } from "../../../../cards/src/cards/defense-reactions/unmovable.ts";
import { sinkBelowRed } from "../../../../cards/src/cards/defense-reactions/sink-below.ts";

import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../../index.ts";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "../../testing/index.ts";
import { emptyDash, toDefend, manual } from "./helpers.ts";

describe("Warrior play lines", { timeout: 20_000 }, () => {
  describe("Dorinthea Ironsong", () => {
    it("DO-01 [AAA] Valor plus Reprise Response, then the extra Dawnblade hit adds one counter", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [dawnblade],
          hand: [steelbladeSupremacyRed, warriorSValorRed, hitAndRunBlue, glintTheQuicksilverBlue],
          arsenal: [ironsongResponseRed],
          resourcePoints: 2,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], life: 20, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);
      const bladeId = Dorinthea.findCardInZone("weapon1", dawnblade);

      Dorinthea.must.play(warriorSValorRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("defend");
      Defender.must.defend(snatchRed);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dorinthea);
      Dorinthea.must.playFromArsenal(ironsongResponseRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(9);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });

      expectFabPlayer(Defender).toHaveLife(13);
      expect(game.objectState(bladeId)?.powerCounterTotal ?? 0).toBe(0);
      expectFabPlayer(Dorinthea).toHaveAP(1);

      Dorinthea.must.activate(dawnblade);
      if (game.getState().decision?.kind === "payment") {
        game.answerDecision(Dorinthea.id, {
          kind: "payment",
          instanceIds: [Dorinthea.cardIn("hand", hitAndRunBlue).instanceId],
        });
      }
      game.advanceCombatTo("defend");
      const secondSwing = game.combat()?.activeLink?.attackPower ?? 0;
      expect(secondSwing).toBeGreaterThanOrEqual(3);
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(20 - 7 - secondSwing);
      expect(game.objectState(bladeId)?.powerCounterTotal).toBe(1);
      expectFabCard(Dorinthea, ironsongResponseRed).toBeIn("graveyard");
      Dorinthea.must.endTurn();
      expectFabPlayer(Dorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("DO-02 [AAA] Dauntless, Puncture, and Jagged Edge resolve through equipment defense", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [dawnblade],
          hand: [dauntlessRed, punctureRed, overpowerBlue, provokeBlue],
          arsenal: [jaggedEdgeRed],
          resourcePoints: 5,
          deck: 8,
        },
        {
          hero: dash,
          chest: [ironrotPlate],
          hand: [unmovableRed, snatchRed, snatchRed, isolateYellow],
          resourcePoints: 3,
          deck: 8,
        },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);

      Dorinthea.must.play(dauntlessRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(6);
      Defender.must.defend(ironrotPlate);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dorinthea);
      Dorinthea.must.play(punctureRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(10).toHaveKeyword("piercing");
      Dorinthea.must.playFromArsenal(jaggedEdgeRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(13);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabCard(Dorinthea, dauntlessRed).toBeIn("graveyard");
      expectFabCard(Dorinthea, punctureRed).toBeIn("graveyard");
      expectFabCard(Dorinthea, jaggedEdgeRed).toBeIn("graveyard");
      expectFabCard(Defender, ironrotPlate).toBeIn("graveyard");
      expectFabPlayer(Defender).toHaveLife(8);
      Dorinthea.must.endTurn();
      expectFabPlayer(Dorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-03 [AAA] Trot plus stacked weapon reactions add only this-turn power", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [dawnblade],
          hand: [gleamOfTheBladeRed, swordmasterSShineRed, beatOfTheIronsongBlue, trotAlongBlue],
          arsenal: [singingSteelbladeYellow],
          resourcePoints: 6,
          deck: 8,
        },
        { hero: dash, hand: [], deck: 8, life: 20 },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);

      Dorinthea.must.play(trotAlongBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("reaction");
      expectCombat(game).toHaveKeyword("go-again");
      game.helpers.passPriorityTo(Dorinthea);
      Dorinthea.must.play(gleamOfTheBladeRed);
      game.passBoth();
      Dorinthea.must.play(swordmasterSShineRed);
      game.passBoth();
      Dorinthea.play(beatOfTheIronsongBlue, { modeIndexes: [0] });
      game.passBoth();
      Dorinthea.must.playFromArsenal(singingSteelbladeYellow);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(13);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(7);
      expectFabCard(Dorinthea, gleamOfTheBladeRed).toBeIn("graveyard");
      expectFabCard(Dorinthea, swordmasterSShineRed).toBeIn("graveyard");
      expectFabCard(Dorinthea, beatOfTheIronsongBlue).toBeIn("graveyard");
      expectFabCard(Dorinthea, singingSteelbladeYellow).toBeIn("graveyard");
      expectFabPlayer(Dorinthea).toHaveAP(1);
      Dorinthea.must.endTurn();
      expectFabPlayer(Dorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-04 [AAA] Blade Flurry is legal only in a real Reaction Step", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [dawnblade],
          hand: [bladeFlurryRed, ironsongResponseRed, nastySurpriseBlue, glintTheQuicksilverBlue],
          arsenal: [steelbladeSupremacyRed],
          resourcePoints: 2,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8, life: 20 },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);

      Dorinthea.must.playFromArsenal(steelbladeSupremacyRed);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("defend");
      Defender.must.defend(snatchRed);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dorinthea);
      Dorinthea.must.playReaction(bladeFlurryRed);
      game.passBoth();
      Dorinthea.must.playReaction(ironsongResponseRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(10);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(12);
      expectFabCard(Dorinthea, bladeFlurryRed).toBeIn("graveyard");
      expectFabCard(Dorinthea, ironsongResponseRed).toBeIn("graveyard");
      expect(() => Dorinthea.must.playReaction(glintTheQuicksilverBlue)).toThrow();
      expectFabCard(Dorinthea, glintTheQuicksilverBlue).toBeIn("hand");
      expectFabCard(Dorinthea, nastySurpriseBlue).toBeIn("hand");
      expect(game.combat()).toBeNull();
      Dorinthea.must.endTurn();
      expectFabPlayer(Dorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-05 [AAA] go-again tokens restore AP; a later action without AP is rejected", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [dawnblade],
          hand: [
            spoilsOfWarRed,
            glisteningSteelbladeYellow,
            gobletOfBloodrunWineBlue,
            hitAndRunBlue,
          ],
          arsenal: [twinningBladeYellow],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [], deck: 8, life: 20 },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);

      Dorinthea.must.play(spoilsOfWarRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.play(glisteningSteelbladeYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.play(gobletOfBloodrunWineBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Dorinthea).toHaveTokenCount("agility", 1).toHaveTokenCount("vigor", 1);
      Dorinthea.must.play(hitAndRunBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Dorinthea).toHaveAP(1);
      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(15);
      expect(Dorinthea.zone("arena").filter((identity) => /copper/i.test(identity))).toHaveLength(
        2,
      );
      expect(
        game.objectState(Dorinthea.findCardInZone("weapon1", dawnblade))?.powerCounterTotal,
      ).toBe(1);
      expectFabPlayer(Dorinthea).toHaveAP(1);
      expect(() => Dorinthea.must.playFromArsenal(twinningBladeYellow)).toThrow();
      Dorinthea.must.endTurn();
      expect(Dorinthea.zone("arsenal")).toEqual([twinningBladeYellow.canonicalId]);
      expectFabPlayer(Dorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-H1 [AAA] extra Dawnblade attack is only after a hit and the second hit adds one counter", () => {
      const startBranch = (blocked: boolean) =>
        FabTestEngine.start(
          {
            hero: dorintheaIronsong,
            weapon1: [dawnblade],
            hand: [warriorSValorRed, ironsongResponseRed, glintTheQuicksilverBlue, hitAndRunBlue],
            arsenal: [steelbladeSupremacyRed],
            resourcePoints: 2,
            deck: 8,
          },
          {
            hero: dash,
            hand: blocked
              ? [regurgitatingSlogRed, glintTheQuicksilverBlue, hitAndRunBlue, snatchRed]
              : [snatchRed, snatchRed, snatchRed, snatchRed],
            deck: 8,
          },
          manual,
        );

      const hit = startBranch(false);
      const Dorinthea = hit.as(dorintheaIronsong);
      const Defender = hit.as(dash);
      const bladeId = Dorinthea.findCardInZone("weapon1", dawnblade);

      const answerPending = (game: typeof hit, hero: typeof Dorinthea) => {
        const decision = game.getState().decision;
        if (!decision) return;
        if (decision.kind === "ordering") {
          game.answerDecision(hero.id, {
            kind: "ordering",
            orderedIds: decision.entries.map((entry) => entry.id),
          });
          return;
        }
        if (decision.kind === "boolean") hero.chooseBoolean(true);
      };

      const attackDawnblade = (game: typeof hit, hero: typeof Dorinthea) => {
        hero.must.activate(dawnblade);
        answerPending(game, hero);
        game.advanceCombatTo("defend");
        answerPending(game, hero);
      };

      Dorinthea.must.play(warriorSValorRed);
      hit.helpers.resolveUntilIdle({ ordering: "listed" });
      attackDawnblade(hit, Dorinthea);
      Defender.must.defend();
      hit.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });

      expectFabPlayer(Defender).toHaveLife(14);
      expect(hit.objectState(bladeId)?.powerCounterTotal ?? 0).toBe(0);
      expectFabPlayer(Dorinthea).toHaveAP(1);

      Dorinthea.must.activate(dawnblade);
      hit.answerDecision(Dorinthea.id, {
        kind: "payment",
        instanceIds: [Dorinthea.cardIn("hand", hitAndRunBlue).instanceId],
      });
      hit.advanceCombatTo("defend");
      expectCombat(hit).toHaveAttackPower(3);
      Defender.must.defend();
      hit.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(11);
      expect(hit.objectState(bladeId)?.powerCounterTotal).toBe(1);
      expect(Dorinthea.zone("arsenal")).toEqual([steelbladeSupremacyRed.canonicalId]);
      Dorinthea.must.endTurn();
      hit.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Dorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const miss = startBranch(true);
      const MissDorinthea = miss.as(dorintheaIronsong);
      const Blocker = miss.as(dash);
      const missBladeId = MissDorinthea.findCardInZone("weapon1", dawnblade);
      MissDorinthea.must.play(warriorSValorRed);
      miss.helpers.resolveUntilIdle({ ordering: "listed" });
      MissDorinthea.must.activate(dawnblade);
      if (miss.getState().decision?.kind === "ordering") {
        const ordering = MissDorinthea.expectDecision("ordering");
        miss.answerDecision(MissDorinthea.id, {
          kind: "ordering",
          orderedIds: ordering.entries.map((entry) => entry.id),
        });
      }
      miss.advanceCombatTo("defend");
      Blocker.must.defend(regurgitatingSlogRed, glintTheQuicksilverBlue, hitAndRunBlue);
      miss.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Blocker).toHaveLife(20);
      expect(miss.objectState(missBladeId)?.powerCounterTotal ?? 0).toBe(0);
      const rejected = MissDorinthea.expectActivationRejected(dawnblade);
      expect(rejected.accepted).toBe(false);
      expect(MissDorinthea.zone("arsenal")).toEqual([steelbladeSupremacyRed.canonicalId]);
      MissDorinthea.must.endTurn();
      miss.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(MissDorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-H2 [AAA] a hit keeps Dawnblade counters and a no-hit end phase removes all of them", () => {
      const startBranch = () =>
        FabTestEngine.start(
          {
            hero: dorintheaIronsong,
            weapon1: [{ card: dawnblade, state: { powerCounterTotal: 2 } }],
            hand: [
              glisteningSteelbladeYellow,
              ironsongResponseRed,
              glintTheQuicksilverBlue,
              hitAndRunBlue,
            ],
            arsenal: [steelbladeSupremacyRed],
            resourcePoints: 2,
            deck: 8,
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          manual,
        );

      const preserved = startBranch();
      const Dorinthea = preserved.as(dorintheaIronsong);
      const Defender = preserved.as(dash);
      const bladeId = Dorinthea.findCardInZone("weapon1", dawnblade);
      expect(preserved.objectState(bladeId)?.powerCounterTotal).toBe(2);

      Dorinthea.must.play(glisteningSteelbladeYellow);
      preserved.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.activate(dawnblade);
      preserved.advanceCombatTo("defend");
      Defender.must.defend();
      preserved.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(15);
      // Glistening: whenever Dawnblade hits a hero this turn, put a +1{p}
      // counter on it. Dawnblade itself still only adds on the second hit.
      // Prior counters survive the hit; Glistening adds one after damage.
      expect(preserved.objectState(bladeId)?.powerCounterTotal).toBe(3);
      expect(Dorinthea.zone("arsenal")).toEqual([steelbladeSupremacyRed.canonicalId]);
      Dorinthea.must.endTurn();
      expect(preserved.objectState(bladeId)?.powerCounterTotal).toBe(3);
      expectFabPlayer(Dorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const cleared = startBranch();
      const ClearDorinthea = cleared.as(dorintheaIronsong);
      const clearBladeId = ClearDorinthea.findCardInZone("weapon1", dawnblade);
      expect(cleared.objectState(clearBladeId)?.powerCounterTotal).toBe(2);
      ClearDorinthea.must.endTurn();
      cleared.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(cleared.objectState(clearBladeId)?.powerCounterTotal ?? 0).toBe(0);
      expect(ClearDorinthea.zone("arsenal")).toEqual([steelbladeSupremacyRed.canonicalId]);
      expectFabPlayer(ClearDorinthea).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-E1 [AAA] Bolters go again is an AP; Dorinthea's extra swing is permission", () => {
      const startBranch = () =>
        FabTestEngine.start(
          {
            hero: dorintheaIronsong,
            weapon1: [dawnblade],
            legs: [refractionBolters],
            hand: [warriorSValorRed, ironsongResponseRed, glintTheQuicksilverBlue, hitAndRunBlue],
            arsenal: [steelbladeSupremacyRed],
            resourcePoints: 3,
            deck: 8,
          },
          { hero: dash, hand: [], deck: 8, life: 20 },
          manual,
        );

      const bolters = startBranch();
      const BoltersDori = bolters.as(dorintheaIronsong);
      BoltersDori.must.play(warriorSValorRed);
      bolters.helpers.resolveUntilIdle({ ordering: "listed" });
      BoltersDori.must.activate(dawnblade);
      bolters.advanceCombatTo("defend");
      bolters.as(dash).must.defend();
      bolters.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
      expectFabCard(BoltersDori, refractionBolters).toBeIn("graveyard");
      expectFabPlayer(BoltersDori).toHaveAP(1);
      expectFabPlayer(bolters.as(dash)).toHaveLife(14);
      BoltersDori.must.activate(dawnblade);
      if (bolters.getState().decision?.kind === "payment") {
        bolters.answerDecision(BoltersDori.id, {
          kind: "payment",
          instanceIds: [BoltersDori.cardIn("hand", hitAndRunBlue).instanceId],
        });
      }
      bolters.advanceCombatTo("defend");
      expectCombat(bolters).toBeOpen();
      expectFabCard(BoltersDori, refractionBolters).toBeIn("graveyard");
      bolters.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      BoltersDori.must.endTurn();

      const permission = startBranch();
      const PermissionDori = permission.as(dorintheaIronsong);
      PermissionDori.must.play(warriorSValorRed);
      permission.helpers.resolveUntilIdle({ ordering: "listed" });
      PermissionDori.must.activate(dawnblade);
      permission.advanceCombatTo("defend");
      permission.as(dash).must.defend();
      permission.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabCard(PermissionDori, refractionBolters).toBeIn("legs");
      expectFabPlayer(PermissionDori).toHaveAP(1);
      // Bolters stayed equipped, so the leftover AP is Valor's on-hit go again.
      // Dorinthea's first-hit permission still lets Dawnblade attack again.
      PermissionDori.must.activate(dawnblade);
      expectCombat(permission).toBeOpen();
    });
    it("DO-E2 [AAA] Grains pays once for Vigor, declines once, and Tempers only after it defends", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [dawnblade],
          chest: [grainsOfBloodspill],
          hand: [warriorSValorRed, ironsongResponseRed, glintTheQuicksilverBlue, hitAndRunBlue],
          arsenal: [steelbladeSupremacyRed],
          resourcePoints: 4,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8, life: 20 },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);
      const grainsId = Dorinthea.findCardInZone("chest", grainsOfBloodspill);

      Dorinthea.must.play(warriorSValorRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("defend");
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
      expectFabPlayer(Dorinthea).toHaveTokenCount("vigor", 1);
      expectFabCard(Dorinthea, grainsOfBloodspill).toBeIn("chest");
      expect(game.objectState(grainsId)?.defenseCounterTotal ?? 0).toBe(0);

      Dorinthea.must.activate(dawnblade);
      if (game.getState().decision?.kind === "payment") {
        game.answerDecision(Dorinthea.id, {
          kind: "payment",
          instanceIds: [Dorinthea.cardIn("hand", hitAndRunBlue).instanceId],
        });
      }
      game.advanceCombatTo("defend");
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Dorinthea).toHaveTokenCount("vigor", 1);
      Dorinthea.must.endTurn();
      Defender.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Dorinthea).toHaveTokenCount("vigor", 0);
      expectFabPlayer(Dorinthea).toHaveResourceCount(1);

      Dorinthea.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Defender.must.playAttack(snatchRed);
      game.advanceCombatTo("defend");
      Dorinthea.defendWith(grainsOfBloodspill);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Dorinthea, grainsOfBloodspill).toBeIn("chest");
      expectFabCard(Dorinthea, grainsOfBloodspill).toHaveDefenseCounters(-1);
    });
    it("DO-E3 [AAA] Supremacy draws on each hit; Twinning grants one extra Dawnblade attack", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [dawnblade],
          hand: [
            steelbladeSupremacyRed,
            glisteningSteelbladeYellow,
            glintTheQuicksilverBlue,
            twinningBladeYellow,
          ],
          arsenal: [warriorSValorRed],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [], deck: 8, life: 20 },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);
      const bladeId = Dorinthea.findCardInZone("weapon1", dawnblade);
      const handBefore = Dorinthea.zone("hand").length;

      Dorinthea.must.play(steelbladeSupremacyRed);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      Dorinthea.must.play(glisteningSteelbladeYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dorinthea);
      Dorinthea.must.play(twinningBladeYellow);
      game.passBoth();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(15);
      expect(Dorinthea.zone("hand").length).toBe(handBefore - 3 + 1);
      expect(game.objectState(bladeId)?.powerCounterTotal).toBe(1);

      Dorinthea.must.activate(dawnblade);
      if (game.getState().decision?.kind === "payment") {
        game.answerDecision(Dorinthea.id, {
          kind: "payment",
          instanceIds: [Dorinthea.cardIn("hand", glintTheQuicksilverBlue).instanceId],
        });
      }
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(6);
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(9);
      expect(game.objectState(bladeId)?.powerCounterTotal).toBe(3);
      const rejected = Dorinthea.expectActivationRejected(dawnblade);
      expect(rejected.accepted).toBe(false);
      Dorinthea.must.endTurn();
      expect(game.objectState(bladeId)?.powerCounterTotal).toBe(3);
      expectFabPlayer(Dorinthea).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-D1 [AAA] Crown bottoms a chosen hand or arsenal card and refills normally", () => {
      for (const selected of [ironsongResponseRed, sinkBelowRed] as const) {
        const game = FabTestEngine.start(
          {
            hero: dorintheaIronsong,
            head: [crownOfProvidence],
            hand: [ironsongResponseRed, glintTheQuicksilverBlue, hitAndRunBlue, warriorSValorRed],
            arsenal: [sinkBelowRed],
            deck: 8,
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          manual,
        );
        const Dorinthea = game.as(dorintheaIronsong);
        const Attacker = game.as(dash);
        Dorinthea.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Dorinthea.defendWith(crownOfProvidence);
        game.helpers.resolveUntilIdle({
          optionalBoolean: true,
          entityTargetCanonicalId: selected.canonicalId,
        });
        game.helpers.resolveRestOfCombat();

        expectFabCard(Dorinthea, crownOfProvidence).toBeIn("graveyard");
        expect(Dorinthea.zone("deck")).toContain(selected.canonicalId);
        expect(Dorinthea.zone("hand")).toHaveLength(selected === sinkBelowRed ? 5 : 4);
        expect(Dorinthea.zone("arsenal")).toHaveLength(selected === sinkBelowRed ? 0 : 1);
        expectFabPlayer(Dorinthea).toHaveLife(38);

        Attacker.must.endTurn();
        Dorinthea.must.endTurn();
        expectFabPlayer(Dorinthea)
          .toHaveHandCount(selected === sinkBelowRed ? 5 : 4)
          .toHaveAP(0)
          .toHaveResourceCount(0);
      }
    });
    it("DO-D2 [AAA] Kabuto stops later weapon attacks only for the current turn", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          head: [kabutoOfImperialAuthority],
          hand: [ironsongResponseRed, glintTheQuicksilverBlue, hitAndRunBlue, warriorSValorRed],
          arsenal: [sinkBelowRed],
          deck: 8,
        },
        {
          hero: dash,
          weapon1: [cintariSaber],
          weapon2: [cintariSaber],
          arena: [quicken],
          hand: [hitAndRunBlue, snatchRed, snatchRed, snatchRed],
          actionPoints: 2,
          resourcePoints: 3,
          deck: 8,
        },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Attacker = game.as(dash);
      const firstSaber = Attacker.cardIn("weapon1", cintariSaber);
      const secondSaber = Attacker.cardIn("weapon2", cintariSaber);
      Dorinthea.must.endTurn();
      Attacker.must.activate(firstSaber);
      game.answerDecision(Attacker.id, {
        kind: "payment",
        instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
      });
      game.advanceCombatTo("defend");
      Dorinthea.defendWith(kabutoOfImperialAuthority);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabCard(Dorinthea, kabutoOfImperialAuthority).toBeIn("graveyard");
      expectFabPlayer(Dorinthea).toHaveLife(40);
      const rejectedWeapon = Attacker.expectFailure({
        move: "activate",
        payload: { instanceId: secondSaber.instanceId },
      });
      expect(rejectedWeapon.accepted).toBe(false);
      expect(rejectedWeapon.errorCode).toBe("restricted_by_rule");
      expectFabPlayer(Attacker).toHaveAP(1).toHaveResourceCount(2);

      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Dorinthea.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Dorinthea).toHaveLife(36);
      Attacker.must.endTurn();
      Dorinthea.must.endTurn();
      Attacker.must.pitch(hitAndRunBlue).activate(secondSaber);
    });
    it("DO-D3 [AAA] consumes Helm once and Shelter on exactly three later packets", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          head: [helmOfAstralSanctuary],
          hand: [shelterFromTheStormRed, glintTheQuicksilverBlue, hitAndRunBlue, warriorSValorRed],
          arsenal: [sinkBelowRed],
          deck: 8,
        },
        { hero: dash, hand: [fryRed, fryRed, fryRed, fryRed], deck: 8 },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Attacker = game.as(dash);
      const heroId = game.getState().players[Dorinthea.id]!.heroCardId!;
      Dorinthea.must.endTurn();

      Attacker.must.playAttack(Attacker.cardsIn("hand", fryRed)[0]!);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dorinthea);
      Dorinthea.must.activate(helmOfAstralSanctuary);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Dorinthea).toHaveLife(38);
      expectFabCard(Dorinthea, helmOfAstralSanctuary).toBeIn("graveyard");
      expect(game.objectState(heroId)?.tapped).toBe(true);

      Attacker.pass();
      Dorinthea.must.activate(shelterFromTheStormRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      for (let packet = 0; packet < 3; packet += 1) {
        Attacker.must.playAttack(Attacker.cardsIn("hand", fryRed)[0]!);
        game.advanceCombatTo("defend");
        Dorinthea.must.defend();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
      }

      expectFabPlayer(Dorinthea).toHaveLife(32);
      expectFabCard(Dorinthea, shelterFromTheStormRed).toBeIn("graveyard");
      expect(Dorinthea.zone("arsenal")).toEqual([sinkBelowRed.canonicalId]);
      const prevention = game
        .committedEvents()
        .filter((event) => event.name === "prevent" && event.data.preventedAmount === 1);
      expect(prevention).toHaveLength(4);
      expect(
        prevention.filter(
          (event) => event.source?.canonicalId === helmOfAstralSanctuary.canonicalId,
        ),
      ).toHaveLength(1);
      expect(
        prevention.filter(
          (event) => event.source?.canonicalId === shelterFromTheStormRed.canonicalId,
        ),
      ).toHaveLength(3);
      expect(game.getState().replacementEffects).toEqual([]);
      expect(() => Dorinthea.must.activate(helmOfAstralSanctuary)).toThrow();
      expect(() => Dorinthea.must.activate(shelterFromTheStormRed)).toThrow();
      Attacker.must.endTurn();
      Dorinthea.must.endTurn();
      expectFabPlayer(Dorinthea).toHaveAP(0).toHaveResourceCount(0);
    });
    it("DO-R1 [AAA] Reprise modes fire only after a hand defense", () => {
      const run = (fromHand: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: dorintheaIronsong,
            weapon1: [dawnblade],
            hand: [
              ironsongResponseRed,
              glintTheQuicksilverBlue,
              singingSteelbladeYellow,
              provokeBlue,
            ],
            arsenal: [overpowerBlue],
            deck: [
              snatchRed,
              punctureRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
              snatchRed,
            ],
            resourcePoints: 5,
          },
          {
            hero: dash,
            chest: [ironrotPlate],
            hand: fromHand ? [snatchRed] : [],
            deck: 8,
            life: 20,
          },
          manual,
        );
        const Dorinthea = game.as(dorintheaIronsong);
        const Defender = game.as(dash);

        Dorinthea.must.activate(dawnblade);
        game.advanceCombatTo("defend");
        if (fromHand) Defender.must.defend(snatchRed);
        else Defender.must.defend(ironrotPlate);
        game.advanceCombatTo("reaction");
        game.helpers.passPriorityTo(Dorinthea);
        Dorinthea.must.play(ironsongResponseRed);
        game.passBoth();
        Dorinthea.must.play(glintTheQuicksilverBlue);
        game.passBoth();
        Dorinthea.must.playFromArsenal(overpowerBlue);
        game.passBoth();
        expectCombat(game).toHaveAttackPower(fromHand ? 10 : 5);
        Dorinthea.must.play(singingSteelbladeYellow);
        game.passBoth();
        if (fromHand) {
          const search = game.getState().decision;
          if (search?.kind === "entity-target") {
            game.answerDecision(Dorinthea.id, {
              kind: "entity-target",
              instanceIds: search.candidates
                .filter(
                  (candidate) =>
                    game.getState().objects[candidate.instanceId]?.canonicalId ===
                    punctureRed.canonicalId,
                )
                .map((candidate) => candidate.instanceId)
                .slice(0, 1),
            });
          }
          if (game.getState().decision?.kind === "boolean") Dorinthea.chooseBoolean(false);
        }
        expectCombat(game).toHaveAttackPower(fromHand ? 11 : 6);
        game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
        expectFabPlayer(Defender).toHaveLife(fromHand ? 11 : 15);
      };

      run(true);
      run(false);
    });
    it("DO-R2 [AAA] Beat picks N+1 distinct modes and Shine pays 3 minus N", () => {
      const game = FabTestEngine.start(
        {
          hero: dorintheaIronsong,
          weapon1: [{ card: dawnblade, state: { powerCounterTotal: 1 } }],
          hand: [beatOfTheIronsongBlue, swordmasterSShineRed, provokeBlue, twinningBladeYellow],
          arsenal: [ironsongResponseRed],
          resourcePoints: 4,
          deck: 8,
        },
        { hero: dash, hand: [], deck: 8, life: 20 },
        manual,
      );
      const Dorinthea = game.as(dorintheaIronsong);
      const Defender = game.as(dash);

      Dorinthea.must.activate(dawnblade);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Dorinthea);
      expectFabPlayer(Dorinthea).toHaveResourceCount(3);
      Dorinthea.must.playReaction(beatOfTheIronsongBlue, { modeIndexes: [0, 1] });
      game.passBoth();
      expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
      Dorinthea.must.playReaction(swordmasterSShineRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(10);
      expectFabPlayer(Dorinthea).toHaveResourceCount(1);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Defender).toHaveLife(10);
      expectFabPlayer(Dorinthea).toHaveAP(1);
      Dorinthea.must.endTurn();
      expectFabPlayer(Dorinthea).toHaveAP(0).toHaveResourceCount(0);
    });
  });

  describe("Kassai of the Golden Sand", () => {
    it("KA-H1 [AAA] a same-turn Draw Swords draw makes Cintari Saber cost 0", () => {
      const game = FabTestEngine.start(
        {
          hero: kassaiOfTheGoldenSand,
          weapon1: [cintariSaber],
          hand: [drawSwordsRed, bladeRunnerRed, glintTheQuicksilverBlue, hitAndRunBlue],
          arsenal: [sliceAndDiceRed],
          resourcePoints: 3,
          deck: 8,
          deckTop: [snatchRed],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Kassai = game.as(kassaiOfTheGoldenSand);
      const handBefore = Kassai.zone("hand").length;
      Kassai.must.play(drawSwordsRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Kassai.zone("hand").length).toBe(handBefore);
      expectFabPlayer(Kassai).toHaveResourceCount(0);
      Kassai.activateAttack(cintariSaber);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(5);
      expectFabPlayer(Kassai).toHaveResourceCount(0);
      game.as(dash).must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(game.as(dash)).toHaveLife(15);
      expect(Kassai.zone("arsenal")).toEqual([sliceAndDiceRed.canonicalId]);
      expect(game.renderedPlayerNarrative(Kassai.id)).toEqual([
        "You played Draw Swords.",
        "Draw Swords gives the next attack +3 power.",
        "You drew: Snatch.",
        "You activated Cintari Saber.",
        "You attacked Opponent with Cintari Saber.",
        "Cintari Saber hit Opponent for 5.",
      ]);
      expect(game.renderedPlayerNarrative(game.as(dash).id)).toEqual([
        "Opponent played Draw Swords.",
        "Draw Swords gives the next attack +3 power.",
        "Opponent drew a card.",
        "Opponent activated Cintari Saber.",
        "Opponent attacked You with Cintari Saber.",
        "Cintari Saber hit You for 5.",
      ]);
    });

    it("KA-H2 [AAA] creates one Gold only on the next weapon hit", () => {
      const hit = FabTestEngine.start(
        {
          hero: kassaiOfTheGoldenSand,
          weapon1: [cintariSaber],
          hand: [bladeRunnerRed, glintTheQuicksilverBlue, hitAndRunBlue, snatchRed],
          arsenal: [sliceAndDiceRed],
          graveyard: [snatchRed, blazeHeadlongRed, isolateYellow, thatAllYouGotYellow],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Kassai = hit.as(kassaiOfTheGoldenSand);
      Kassai.must.activate(kassaiOfTheGoldenSand);
      hit.helpers.resolveUntilIdle({ ordering: "listed" });
      Kassai.must.activate(cintariSaber);
      hit.helpers.resolveRestOfCombat();
      expect(Kassai.zone("arena")).toContain("token:gold");

      const miss = FabTestEngine.start(
        {
          hero: kassaiOfTheGoldenSand,
          weapon1: [cintariSaber],
          hand: [bladeRunnerRed, glintTheQuicksilverBlue, hitAndRunBlue, snatchRed],
          arsenal: [sliceAndDiceRed],
          graveyard: [snatchRed, blazeHeadlongRed, isolateYellow, thatAllYouGotYellow],
          resourcePoints: 1,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const MissKassai = miss.as(kassaiOfTheGoldenSand);
      MissKassai.must.activate(kassaiOfTheGoldenSand);
      miss.helpers.resolveUntilIdle({ ordering: "listed" });
      MissKassai.must.activate(cintariSaber);
      miss.advanceCombatTo("defend");
      miss.as(dash).defendWith(miss.as(dash).cardsIn("hand", snatchRed));
      miss.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(MissKassai.zone("arena")).not.toContain("token:gold");
    });

    it("KA-01 [AAA] Glint targets the active Saber and draws for Reprise", () => {
      const game = FabTestEngine.start(
        {
          hero: kassaiOfTheGoldenSand,
          weapon1: [cintariSaber],
          hand: [bladeRunnerRed, bloodFollowsBladeYellow, hitAndRunBlue, glintTheQuicksilverBlue],
          arsenal: [sliceAndDiceRed],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8, life: 20 },
        manual,
      );
      const Kassai = game.as(kassaiOfTheGoldenSand);
      const Defender = game.as(dash);

      // Arrange — Slice resolves, then the real Saber proxy is defended by an
      // attack action card from hand so Reprise is true.
      Kassai.must.playFromArsenal(sliceAndDiceRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Kassai.must.pitch(hitAndRunBlue).activate(cintariSaber);
      game.advanceCombatTo("defend");
      Defender.must.defend(snatchRed);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Kassai);

      // Act — Glint declares and resolves against the active Weapon attack.
      Kassai.must.play(glintTheQuicksilverBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      // Assert — go again + Reprise draw. Combat math is first-class printed
      // text: Saber 2, Slice first-weapon +1, Cintari "defended by an attack
      // action" +1, Snatch 2{d} → 2 damage.
      expectFabPlayer(Kassai).toHaveHandCount(4).toHaveAP(1);
      expectFabCard(Kassai, glintTheQuicksilverBlue).toBeIn("graveyard");
      expect(Kassai.zone("arsenal")).toHaveLength(0);
      expectFabPlayer(Defender).toHaveLife(18);
    });
    it("KA-02 [AAA] Trot carries Raise's Sellsword from Saber into the same chain", () => {
      const game = FabTestEngine.start(
        {
          hero: kassaiOfTheGoldenSand,
          weapon1: [cintariSaber],
          hand: [drawSwordsRed, raiseAnArmyYellow, highCurrentCurrencyBlue, trotAlongBlue],
          arsenal: [bloodOnHerHandsYellow],
          arena: [fabToken("gold")],
          resourcePoints: 3,
          actionPoints: 1,
          deck: 8,
        },
        { hero: dash, hand: [], life: 20, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Kassai = game.as(kassaiOfTheGoldenSand);
      const Defender = game.as(dash);

      Kassai.must.play(trotAlongBlue);
      game.untilIdle({ ordering: "listed" });
      Kassai.play(raiseAnArmyYellow, { xValue: 1 });
      game.untilIdle({ ordering: "listed" });
      expectFabPlayer(Kassai).toHaveTokenCount("gold", 0);
      expectFabPlayer(Kassai).toHaveTokenCount("cintari-sellsword", 1).toHaveAP(1);

      Kassai.must.activate(cintariSaber);
      game.advanceUntil({ stopAt: "defend" });
      Defender.must.defend();
      expectCombat(game).toHaveKeyword("go-again");
      game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
      expectFabPlayer(Kassai).toHaveAP(1);

      const sellsword = Kassai.cardIn("arena", "token:cintari-sellsword");
      Kassai.activateAttack(sellsword);
      Defender.must.defend();
      game.closeCombat({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(15);
      expectFabPlayer(Kassai).toHaveAP(1).toHaveResourceCount(1);
      expectFabPlayer(Kassai).toHaveTokenCount("cintari-sellsword", 1);
      expect(Kassai.zone("arsenal")).toEqual([bloodOnHerHandsYellow.canonicalId]);
    });
    it("KA-03 [AAA] pitching Riches creates Gold that is spent the same turn", () => {
      const game = FabTestEngine.start(
        {
          hero: kassaiOfTheGoldenSand,
          weapon1: [cintariSaber],
          hand: [spoilsOfWarRed, richesOfTrPalDhaniYellow, glintTheQuicksilverBlue, bladeRunnerRed],
          arsenal: [runThroughYellow],
          resourcePoints: 0,
          deck: 8,
        },
        { hero: dash, hand: [], deck: 8, life: 20 },
        manual,
      );
      const Kassai = game.as(kassaiOfTheGoldenSand);
      const Defender = game.as(dash);

      Kassai.must.play(spoilsOfWarRed, { pitch: [richesOfTrPalDhaniYellow] });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Kassai.zone("arena")).toContain("token:gold");
      expectFabCard(Kassai, richesOfTrPalDhaniYellow).toBeIn("pitch");
      expectFabPlayer(Kassai).toHaveAP(1);
      Kassai.must.activate(cintariSaber);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Kassai);
      Kassai.must.playFromArsenal(runThroughYellow, { pitch: [glintTheQuicksilverBlue] });
      game.passBoth();
      expectCombat(game).toHaveKeyword("go-again");
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(16);
      expect(Kassai.zone("arena")).toContain("token:gold");

      Kassai.must.activate(fabToken("gold"));
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Kassai.zone("arena")).not.toContain("token:gold");
      expect(() => Kassai.must.activate(fabToken("gold"))).toThrow();
    });
    it("KA-04 [AAA] In the Swing and Blade Flurry resolve against equipment defense", () => {
      const game = FabTestEngine.start(
        {
          hero: kassaiOfTheGoldenSand,
          weapon1: [cintariSaber],
          weapon2: [cintariSaber],
          hand: [bladeFlurryRed, inTheSwingRed, hitAndRunBlue, trotAlongBlue],
          arsenal: [sliceAndDiceRed],
          resourcePoints: 3,
          actionPoints: 2,
          deck: 8,
        },
        { hero: dash, chest: [ironrotPlate], hand: [], deck: 8, life: 20 },
        manual,
      );
      const Kassai = game.as(kassaiOfTheGoldenSand);
      const Defender = game.as(dash);
      const firstSaber = Kassai.cardIn("weapon1", cintariSaber);
      const secondSaber = Kassai.cardIn("weapon2", cintariSaber);

      Kassai.must.play(trotAlongBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Kassai.must.playFromArsenal(sliceAndDiceRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Kassai.must.activate(firstSaber);
      game.advanceCombatTo("defend");
      Defender.must.defend(ironrotPlate);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Kassai);
      expect(() => Kassai.must.playReaction(inTheSwingRed)).toThrow();
      Kassai.must.playReaction(bladeFlurryRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(5);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(16);
      expectFabCard(Defender, ironrotPlate).toBeIn("graveyard");

      Kassai.must.activate(secondSaber);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Kassai);
      Kassai.must.playReaction(inTheSwingRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(10);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(6);
      expectFabCard(Kassai, inTheSwingRed).toBeIn("graveyard");
      expectFabCard(Kassai, bladeFlurryRed).toBeIn("graveyard");
    });
    it("KA-05 [AAA] draws to the hit-modified intellect before its turn-boundary expiry", () => {
      const run = (conditionActive: boolean) => {
        let game = FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            hand: [
              nourishingEmptinessRed,
              thatAllYouGotYellow,
              highCurrentCurrencyBlue,
              glintTheQuicksilverBlue,
            ],
            arsenal: [unsheathedRed],
            graveyard: conditionActive ? [] : [snatchRed],
            deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
          },
          {
            hero: dash,
            life: 20,
            hand: conditionActive ? [] : [snatchRed, snatchRed, snatchRed],
            deck: 8,
          },
          manual,
        );
        let Kassai = game.as(kassaiOfTheGoldenSand);
        let Defender = game.as(dash);

        Kassai.must.playFromArsenal(unsheathedRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        Kassai.must.playAttack(nourishingEmptinessRed, { pitch: [highCurrentCurrencyBlue] });
        game.advanceCombatTo("defend");
        expect(game.combat()?.activeLink?.keywords.includes("dominate")).toBe(conditionActive);
        if (conditionActive) Defender.must.defend();
        else Defender.defendWith(Defender.cardsIn("hand", snatchRed));
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Defender).toHaveLife(conditionActive ? 14 : 20);
        expect(Kassai.intellect()).toBe(conditionActive ? 5 : 4);
        expectFabCard(Kassai, unsheathedRed).toBeIn("graveyard");

        const beforeEnd = game.getState();
        game = FabTestEngine.fromState(
          restoreFabMatchSnapshot(
            serializeFabMatchSnapshot(beforeEnd),
            createFabMatchContext(beforeEnd.cardDefinitions, beforeEnd.publicCardIdentities),
          ),
        );
        Kassai = game.as(kassaiOfTheGoldenSand);
        Defender = game.as(dash);
        Kassai.endTurnWithArsenal(thatAllYouGotYellow);

        expectFabCard(Kassai, thatAllYouGotYellow).toBeIn("arsenal");
        expectFabPlayer(Kassai)
          .toHaveHandCount(conditionActive ? 5 : 4)
          .toHaveAP(0)
          .toHaveResourceCount(0);
        expect(Kassai.intellect()).toBe(4);
        expect(game.active().id).toBe(Defender.id);
      };

      run(true);
      run(false);
    });
    it("KA-E1 [AAA] Saber +1 and Hot Streak go again only after an attack-action defense", () => {
      const run = (weapon: "saber" | "streak", attackActionDefense: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            weapon1: [weapon === "saber" ? cintariSaber : hotStreak],
            hand: [sliceAndDiceRed, spoilsOfWarRed, glintTheQuicksilverBlue, hitAndRunBlue],
            arsenal: [bladeRunnerRed],
            resourcePoints: 2,
            deck: 8,
          },
          {
            hero: dash,
            chest: [ironrotPlate],
            hand: attackActionDefense ? [snatchRed] : [],
            deck: 8,
            life: 20,
          },
          manual,
        );
        const Kassai = game.as(kassaiOfTheGoldenSand);
        const Defender = game.as(dash);
        const armed = weapon === "saber" ? cintariSaber : hotStreak;

        Kassai.must.play(sliceAndDiceRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        Kassai.must.activate(armed);
        game.advanceCombatTo("defend");
        if (attackActionDefense) Defender.must.defend(snatchRed);
        else Defender.must.defend(ironrotPlate);
        game.advanceCombatTo("reaction");
        if (weapon === "saber") {
          expectCombat(game).toHaveAttackPower(attackActionDefense ? 4 : 3);
        } else {
          expectCombat(game).toHaveAttackPower(3);
          if (attackActionDefense) expectCombat(game).toHaveKeyword("go-again");
          else expectCombat(game).notToHaveKeyword("go-again");
        }
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        if (weapon === "streak" && attackActionDefense) {
          expectFabPlayer(Kassai).toHaveAP(1);
        }
      };

      run("saber", true);
      run("saber", false);
      run("streak", true);
      run("streak", false);
    });
    it("KA-E2 [AAA] Grains creates Vigor only when the {r} is paid", () => {
      const run = (pay: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            weapon1: [cintariSaber],
            chest: [grainsOfBloodspill],
            hand: [spoilsOfWarRed, bladeRunnerRed, glintTheQuicksilverBlue, hitAndRunBlue],
            arsenal: [sliceAndDiceRed],
            resourcePoints: 2,
            deck: 8,
          },
          { hero: dash, hand: [], deck: 8, life: 20 },
          manual,
        );
        const Kassai = game.as(kassaiOfTheGoldenSand);

        Kassai.must.playFromArsenal(sliceAndDiceRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        Kassai.must.activate(cintariSaber);
        game.advanceCombatTo("defend");
        game.as(dash).must.defend();
        game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: pay });
        expectFabPlayer(Kassai).toHaveTokenCount("vigor", pay ? 1 : 0);
        expectFabCard(Kassai, grainsOfBloodspill).toBeIn("chest");
        if (pay) {
          Kassai.must.endTurn();
          game.as(dash).must.endTurn();
          game.helpers.resolveUntilIdle({ ordering: "listed" });
          expectFabPlayer(Kassai).toHaveTokenCount("vigor", 0);
          expectFabPlayer(Kassai).toHaveResourceCount(1);
        }
      };

      run(true);
      run(false);
    });
    it("KA-E3 [AAA] Valiant Dynamo removes one -1{d} only after two weapon attacks", () => {
      const run = (twoWeapons: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            weapon1: [cintariSaber],
            weapon2: twoWeapons ? [cintariSaber] : undefined,
            legs: [{ card: valiantDynamo, state: { defenseCounterTotal: -1 } }],
            hand: [spoilsOfWarRed, bladeRunnerRed, glintTheQuicksilverBlue, hitAndRunBlue],
            arsenal: [sliceAndDiceRed],
            resourcePoints: 2,
            actionPoints: 2,
            deck: 8,
          },
          { hero: dash, hand: [], deck: 8, life: 20 },
          manual,
        );
        const Kassai = game.as(kassaiOfTheGoldenSand);
        const dynamoId = Kassai.findCardInZone("legs", valiantDynamo);
        expect(game.objectState(dynamoId)?.defenseCounterTotal).toBe(-1);

        Kassai.must.playFromArsenal(sliceAndDiceRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        Kassai.must.activate(Kassai.cardIn("weapon1", cintariSaber));
        game.helpers.resolveRestOfCombat();
        if (twoWeapons) {
          Kassai.must.activate(Kassai.cardIn("weapon2", cintariSaber));
          game.helpers.resolveRestOfCombat();
        } else {
          Kassai.must.playAttack(spoilsOfWarRed);
          game.helpers.resolveUntilIdle({ ordering: "listed" });
        }
        Kassai.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: twoWeapons });
        expect(game.objectState(dynamoId)?.defenseCounterTotal ?? 0).toBe(twoWeapons ? 0 : -1);
        expectFabCard(Kassai, valiantDynamo).toBeIn("legs");
      };

      run(true);
      run(false);
    });
    it("KA-E4 [AAA] Raise spends only Crown Gold; Blood binds destroy-N Copper to N +1{p} modes", () => {
      const run = (coppers: 0 | 1 | 2) => {
        const game = FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            head: [crownOfDominion],
            weapon1: [cintariSaber],
            weapon2: [cintariSaber],
            hand: [
              raiseAnArmyYellow,
              bloodOnHerHandsYellow,
              bladeRunnerRed,
              glintTheQuicksilverBlue,
            ],
            arsenal: [sliceAndDiceRed],
            arena: Array.from({ length: coppers }, () => fabToken("copper")),
            resourcePoints: 2,
            actionPoints: 2,
            deck: 8,
          },
          { hero: dash, hand: [], deck: 8, life: 20 },
          manual,
        );
        const Kassai = game.as(kassaiOfTheGoldenSand);
        game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

        expect(Kassai.zone("arena")).toContain("token:gold");
        expect(Kassai.zone("arena").filter((identity) => /copper/i.test(identity))).toHaveLength(
          coppers,
        );

        Kassai.exec({
          move: "begin-play",
          payload: { instanceId: Kassai.findCardInZone("hand", raiseAnArmyYellow) },
        });
        expect(game.getState().decision).toMatchObject({ kind: "numeric", min: 0, max: 1 });
        game.answerDecision(Kassai.id, { kind: "numeric", value: 1 });
        const goldCost = game.getState().decision;
        expect(goldCost?.kind).toBe("entity-target");
        if (goldCost?.kind !== "entity-target") throw new Error("expected Gold cost target");
        expect(goldCost.candidates).toHaveLength(1);
        game.answerDecision(Kassai.id, {
          kind: "entity-target",
          instanceIds: [goldCost.candidates[0]!.instanceId],
        });
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expect(Kassai.zone("arena")).not.toContain("token:gold");
        expect(
          Kassai.zone("arena").filter((identity) => identity === "token:cintari-sellsword"),
        ).toHaveLength(1);
        expectFabCard(Kassai, raiseAnArmyYellow).toBeIn("graveyard");

        const firstSaber = Kassai.cardIn("weapon1", cintariSaber);
        const secondSaber = Kassai.cardIn("weapon2", cintariSaber);

        Kassai.exec({
          move: "begin-play",
          payload: { instanceId: Kassai.findCardInZone("hand", bloodOnHerHandsYellow) },
        });
        const copperCost = game.getState().decision;
        if (copperCost?.kind === "entity-target") {
          game.answerDecision(Kassai.id, {
            kind: "entity-target",
            instanceIds: copperCost.candidates
              .slice(0, coppers)
              .map((candidate) => candidate.instanceId),
          });
        }
        for (let pick = 0; pick < coppers; pick += 1) {
          const mode = game.getState().decision;
          expect(mode?.kind).toBe("option");
          if (mode?.kind !== "option") throw new Error(`expected mode ${pick + 1} of ${coppers}`);
          Kassai.chooseOptions(
            `${bloodOnHerHandsYellow.canonicalId}:asAdditionalCostPlayBloodHerHandsDestroyAny:target1hWeaponSAttacksGet1Turn`,
          );
        }
        for (let pick = 0; pick < coppers; pick += 1) {
          const weaponTarget = game.getState().decision;
          if (weaponTarget?.kind === "entity-target") {
            game.answerDecision(Kassai.id, {
              kind: "entity-target",
              instanceIds: [firstSaber.instanceId],
            });
          }
        }
        game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });

        expect(Kassai.zone("arena").filter((identity) => /copper/i.test(identity))).toHaveLength(0);
        expectFabCard(Kassai, bloodOnHerHandsYellow).toBeIn("graveyard");
        expect(Kassai.zone("hand")).toEqual(
          expect.arrayContaining([bladeRunnerRed.canonicalId, glintTheQuicksilverBlue.canonicalId]),
        );
        expect(Kassai.zone("arsenal")).toEqual([sliceAndDiceRed.canonicalId]);

        Kassai.must.activate(firstSaber);
        game.passBoth();
        expectCombat(game).toHaveAttackPower(2 + coppers);
        game.helpers.resolveRestOfCombat();

        Kassai.must.activate(secondSaber);
        game.passBoth();
        expectCombat(game).toHaveAttackPower(2);
      };

      run(0);
      run(1);
      run(2);
    });
    it("KA-D1 [AAA] draws once after That All You Got defends a power-2 attack", () => {
      const run = (fromArsenal: boolean, lowPower: boolean) => {
        let game = FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            hand: fromArsenal
              ? [bladeRunnerRed, glintTheQuicksilverBlue, sinkBelowRed, fateForeseenRed]
              : [bladeRunnerRed, glintTheQuicksilverBlue, thatAllYouGotYellow, fateForeseenRed],
            arsenal: [fromArsenal ? thatAllYouGotYellow : sinkBelowRed],
            deck: 8,
          },
          { hero: dash, hand: [lowPower ? isolateYellow : snatchRed], deck: 8 },
          manual,
        );
        let Kassai = game.as(kassaiOfTheGoldenSand);
        let Attacker = game.as(dash);
        Kassai.must.endTurn();
        Attacker.must.playAttack(lowPower ? isolateYellow : snatchRed);
        game.advanceCombatTo("reaction");
        game.helpers.passPriorityTo(Kassai);
        Kassai.play(thatAllYouGotYellow, fromArsenal ? { from: "arsenal" } : undefined);
        game.passBoth();
        game.advanceCombatTo("resolution");
        expect(game.combat()?.step).toBe("resolution");
        const handBeforeClose = Kassai.zone("hand").length;

        const beforeClose = game.getState();
        game = FabTestEngine.fromState(
          restoreFabMatchSnapshot(
            serializeFabMatchSnapshot(beforeClose),
            createFabMatchContext(beforeClose.cardDefinitions, beforeClose.publicCardIdentities),
          ),
        );
        Kassai = game.as(kassaiOfTheGoldenSand);
        Attacker = game.as(dash);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Kassai).toHaveHandCount(handBeforeClose + (lowPower ? 1 : 0));
        expect(
          game
            .committedEvents()
            .filter((event) => event.name === "draw" && event.data.playerId === Kassai.id),
        ).toHaveLength(lowPower ? 1 : 0);
        expectFabCard(Kassai, thatAllYouGotYellow).toBeIn("graveyard");
        expect(Kassai.zone("arsenal")).toEqual(fromArsenal ? [] : [sinkBelowRed.canonicalId]);
        game.helpers.resolveRestOfCombat();
        expect(game.combat()).toBeNull();
        Attacker.must.endTurn();
        Kassai.must.endTurn();
        expectFabPlayer(Kassai).toHaveAP(0).toHaveResourceCount(0);
      };
      run(false, true);
      run(false, false);
      run(true, true);
    });
    it("KA-D2 [AAA] Blunten makes the attacker choose a discard only for a weapon", () => {
      for (const weapon of [true, false]) {
        let game = FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            head: [kabutoOfImperialAuthority],
            hand: [bluntenYellow, fateForeseenRed, glintTheQuicksilverBlue, bladeRunnerRed],
            arsenal: [sinkBelowRed],
            deck: 8,
          },
          {
            hero: dash,
            weapon1: [cintariSaber],
            weapon2: [cintariSaber],
            arena: [quicken],
            hand: [hitAndRunBlue, snatchRed, snatchRed, snatchRed],
            actionPoints: 2,
            resourcePoints: 3,
            deck: 8,
          },
          manual,
        );
        let Kassai = game.as(kassaiOfTheGoldenSand);
        let Attacker = game.as(dash);
        const firstSaber = Attacker.cardIn("weapon1", cintariSaber);
        const secondSaber = Attacker.cardIn("weapon2", cintariSaber);
        Kassai.must.endTurn();
        if (weapon) {
          Attacker.must.activate(firstSaber);
          game.answerDecision(Attacker.id, {
            kind: "payment",
            instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
          });
        } else Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Kassai.defendWith([bluntenYellow, kabutoOfImperialAuthority]);

        if (weapon) {
          const ordering = Kassai.expectDecision("ordering");
          game.answerDecision(Kassai.id, {
            kind: "ordering",
            orderedIds: ordering.entries.map((entry) => entry.id),
          });
          for (let safety = 0; !game.getState().decision && safety < 8; safety += 1) {
            const priorityPlayerId = game.getPriorityPlayerId();
            if (!priorityPlayerId) break;
            game.pass(priorityPlayerId);
          }
          const chosenDiscard = Attacker.cardsIn("hand", snatchRed)[0]!;
          game.assertCardHiddenFrom(Kassai, chosenDiscard, Attacker);
          const beforeChoice = game.getState();
          game = FabTestEngine.fromState(
            restoreFabMatchSnapshot(
              serializeFabMatchSnapshot(beforeChoice),
              createFabMatchContext(
                beforeChoice.cardDefinitions,
                beforeChoice.publicCardIdentities,
              ),
            ),
          );
          Kassai = game.as(kassaiOfTheGoldenSand);
          Attacker = game.as(dash);
          const decision = Attacker.expectDecision("entity-target");
          expect(decision.candidates).toHaveLength(3);
          expect(() => Kassai.expectDecision("entity-target")).toThrow();
          game.answerDecision(Attacker.id, {
            kind: "entity-target",
            instanceIds: [chosenDiscard.instanceId],
          });
        }
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabCard(Kassai, bluntenYellow).toBeIn("graveyard");
        expectFabCard(Kassai, kabutoOfImperialAuthority).toBeIn("graveyard");
        expectFabPlayer(Kassai).toHaveLife(40);
        expect(
          game
            .committedEvents()
            .filter((event) => event.name === "discard" && event.data.playerId === Attacker.id),
        ).toHaveLength(weapon ? 1 : 0);
        if (weapon) {
          const discard = game
            .committedEvents()
            .find((event) => event.name === "discard" && event.data.playerId === Attacker.id);
          expect(discard?.name === "discard" && discard.data.random).toBe(false);
        }
        const rejectedWeapon = Attacker.expectFailure({
          move: "activate",
          payload: { instanceId: secondSaber.instanceId },
        });
        expect(rejectedWeapon.errorCode).toBe("restricted_by_rule");
        expect(Kassai.zone("arsenal")).toEqual([sinkBelowRed.canonicalId]);
        Attacker.must.endTurn();
        expectFabPlayer(Attacker).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("KA-D3 [AAA] bottoms one chosen hidden-zone card, draws once, and Blade Breaks", () => {
      const startVariant = () =>
        FabTestEngine.start(
          {
            hero: kassaiOfTheGoldenSand,
            head: [crownOfProvidence],
            hand: [fateForeseenRed, bladeRunnerRed, glintTheQuicksilverBlue, hitAndRunBlue],
            arsenal: [sinkBelowRed],
            deck: 8,
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          manual,
        );

      for (const selected of [fateForeseenRed, sinkBelowRed] as const) {
        const game = startVariant();
        const Kassai = game.as(kassaiOfTheGoldenSand);
        const Attacker = game.as(dash);
        Kassai.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Kassai.defendWith(crownOfProvidence);
        game.helpers.resolveUntilIdle({
          optionalBoolean: true,
          entityTargetCanonicalId: selected.canonicalId,
        });
        game.helpers.resolveRestOfCombat();

        expectFabCard(Kassai, crownOfProvidence).toBeIn("graveyard");
        expect(Kassai.zone("deck")).toContain(selected.canonicalId);
        expect(Kassai.zone("hand")).toHaveLength(selected === sinkBelowRed ? 5 : 4);
        expect(Kassai.zone("arsenal")).toHaveLength(selected === sinkBelowRed ? 0 : 1);
        expectFabPlayer(Kassai).toHaveLife(38);
      }
    });
  });
});
