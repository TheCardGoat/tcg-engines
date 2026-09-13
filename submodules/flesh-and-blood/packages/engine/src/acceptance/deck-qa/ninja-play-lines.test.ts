/**
 * Ninja play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { ravenousRabbleRed } from "../../../../cards/src/cards/actions/ravenous-rabble.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { bloodiedOval } from "../../../../cards/src/cards/equipment/bloodied-oval.ts";
import { burningBladeDanceRed } from "../../../../cards/src/cards/actions/burning-blade-dance.ts";
import { displayLoyaltyRed } from "../../../../cards/src/cards/actions/display-loyalty.ts";
import { fireTenetStrikeFirstRed } from "../../../../cards/src/cards/actions/fire-tenet-strike-first.ts";
import { hotOnTheirHeelsRed } from "../../../../cards/src/cards/actions/hot-on-their-heels.ts";
import { dragonPowerBlue } from "../../../../cards/src/cards/actions/dragon-power.ts";
import { lavaBurstRed } from "../../../../cards/src/cards/actions/lava-burst.ts";
import { crouchingTiger } from "../../../../cards/src/cards/actions/crouching-tiger.ts";
import { tearingShuko } from "../../../../cards/src/cards/equipment/tearing-shuko.ts";
import { pouncingPaws } from "../../../../cards/src/cards/equipment/pouncing-paws.ts";
import { nipAtTheHeelsBlue } from "../../../../cards/src/cards/attack-reactions/nip-at-the-heels.ts";
import { kunaiOfRetribution } from "../../../../cards/src/cards/weapons/kunai-of-retribution.ts";
import { hitAndRunBlue } from "../../../../cards/src/cards/actions/hit-and-run.ts";
import { entwineLightningRed } from "../../../../cards/src/cards/actions/entwine-lightning.ts";
import { sigilOfSufferingRed } from "../../../../cards/src/cards/defense-reactions/sigil-of-suffering.ts";
import { briar } from "../../../../cards/src/cards/heroes/briar.ts";
import { lightningPressRed } from "../../../../cards/src/cards/instants/lightning-press.ts";
import { bladeRunnerRed } from "../../../../cards/src/cards/attack-reactions/blade-runner.ts";
import { arcaneLantern } from "../../../../cards/src/cards/equipment/arcane-lantern.ts";
import { phoenixFlameRed } from "../../../../cards/src/cards/actions/phoenix-flame.ts";
import { riseFromTheAshesRed } from "../../../../cards/src/cards/actions/rise-from-the-ashes.ts";
import { blazeHeadlongRed } from "../../../../cards/src/cards/actions/blaze-headlong.ts";
import { roninRenegadeRed } from "../../../../cards/src/cards/actions/ronin-renegade.ts";
import { brandWithCinderclawRed } from "../../../../cards/src/cards/actions/brand-with-cinderclaw.ts";
import { fai } from "../../../../cards/src/cards/heroes/fai.ts";
import { searingEmberblade } from "../../../../cards/src/cards/weapons/searing-emberblade.ts";
import { bladeBeckonerHelm } from "../../../../cards/src/cards/equipment/blade-beckoner-helm.ts";
import { scarForAScarRed } from "../../../../cards/src/cards/actions/scar-for-a-scar.ts";
import { isolateYellow } from "../../../../cards/src/cards/actions/isolate.ts";
import { enflameTheFirebrandRed } from "../../../../cards/src/cards/actions/enflame-the-firebrand.ts";
import { fireThatBurnsWithinRed } from "../../../../cards/src/cards/actions/fire-that-burns-within.ts";
import { maskOfTheSwarmingClaw } from "../../../../cards/src/cards/equipment/mask-of-the-swarming-claw.ts";
import { arcanePolarityRed } from "../../../../cards/src/cards/instants/arcane-polarity.ts";
import { dawnblade } from "../../../../cards/src/cards/weapons/dawnblade.ts";
import { brandWithCinderclawYellow } from "../../../../cards/src/cards/actions/brand-with-cinderclaw.ts";
import { risingResentmentRed } from "../../../../cards/src/cards/actions/rising-resentment.ts";
import { breakingPointRed } from "../../../../cards/src/cards/actions/breaking-point.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { nimblismRed } from "../../../../cards/src/cards/actions/nimblism.ts";
import { glintTheQuicksilverBlue } from "../../../../cards/src/cards/attack-reactions/glint-the-quicksilver.ts";
import { sinkBelowRed } from "../../../../cards/src/cards/defense-reactions/sink-below.ts";

import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "../../testing/index.ts";
import { emptyDash, toDefend, manual } from "./helpers.ts";

describe("Ninja play lines", () => {
  describe("Fai", () => {
    it("FI-01 [AAA] chains Brand and Headlong into a 2-link Phoenix Flame", () => {
      const game = FabTestEngine.start(
        {
          hero: fai,
          hand: [blazeHeadlongRed, brandWithCinderclawRed, risingResentmentRed, dragonPowerBlue],
          arsenal: [phoenixFlameRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Fai = game.as(fai);
      const Defender = game.as(dash);

      Fai.attackWith(brandWithCinderclawRed);
      expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
      game.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(17);

      Fai.attackWith(blazeHeadlongRed);
      expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
      game.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(13);

      Fai.attackWith(phoenixFlameRed, { from: "arsenal" });
      expectCombat(game).toHaveAttackPower(1).toHaveKeyword("go-again");
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(Defender).toHaveLife(12);
      expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
      expectFabPlayer(Fai).toHaveAP(1);

      Fai.must.activate(fai);
      if (game.getState().decision?.kind === "payment") {
        game.answerDecision(Fai.id, {
          kind: "payment",
          instanceIds: [Fai.cardIn("hand", dragonPowerBlue).instanceId],
        });
      }
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
      expect(game.renderedPlayerNarrative(Fai.id)).toEqual([
        "You played Brand With Cinderclaw.",
        "You attacked Opponent with Brand With Cinderclaw.",
        "Brand With Cinderclaw hit Opponent for 3.",
        "You played Blaze Headlong.",
        "You attacked Opponent with Blaze Headlong.",
        "Blaze Headlong hit Opponent for 4.",
        "You played Phoenix Flame.",
        "You attacked Opponent with Phoenix Flame.",
        "Phoenix Flame hit Opponent for 1.",
        "You pitched Dragon Power for 3.",
        "You activated Fai.",
      ]);
      expect(game.renderedPlayerNarrative(Defender.id)).toEqual([
        "Opponent played Brand With Cinderclaw.",
        "Opponent attacked You with Brand With Cinderclaw.",
        "Brand With Cinderclaw hit You for 3.",
        "Opponent played Blaze Headlong.",
        "Opponent attacked You with Blaze Headlong.",
        "Blaze Headlong hit You for 4.",
        "Opponent played Phoenix Flame.",
        "Opponent attacked You with Phoenix Flame.",
        "Phoenix Flame hit You for 1.",
        "Opponent pitched Dragon Power for 3.",
        "Opponent activated Fai.",
      ]);
      Fai.must.endTurn();
      expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("FI-H2 [AAA] Brand makes only the next chain-link attack Draconic for Fai", () => {
      const branded = FabTestEngine.start(
        {
          hero: fai,
          hand: [brandWithCinderclawRed, roninRenegadeRed, snatchRed, dragonPowerBlue],
          arsenal: [dragonPowerBlue],
          graveyard: [phoenixFlameRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Fai = branded.as(fai);
      Fai.must.playAttack(brandWithCinderclawRed);
      branded.advanceCombatTo("resolution");
      Fai.must.playAttack(snatchRed);
      branded.advanceCombatTo("resolution");
      Fai.must.activate(fai);
      branded.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");

      const unbranded = FabTestEngine.start(
        {
          hero: fai,
          hand: [brandWithCinderclawRed, roninRenegadeRed, snatchRed, dragonPowerBlue],
          arsenal: [dragonPowerBlue],
          graveyard: [phoenixFlameRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Plain = unbranded.as(fai);
      Plain.must.playAttack(snatchRed);
      unbranded.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      Plain.must.activate(fai);
      if (unbranded.getState().decision?.kind === "payment") {
        expectFabCard(Plain, phoenixFlameRed).toBeIn("graveyard");
      } else {
        unbranded.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
        expectFabCard(Plain, phoenixFlameRed).toBeIn("graveyard");
      }
    });

    it("FI-H1 [AAA] Fai's Flame recover costs 3/2/1/0 by Draconic link count", () => {
      const run = (links: 0 | 1 | 2 | 3) => {
        const game = FabTestEngine.start(
          {
            hero: fai,
            hand: [blazeHeadlongRed, brandWithCinderclawRed, risingResentmentRed, dragonPowerBlue],
            arsenal: [snatchRed],
            graveyard: [phoenixFlameRed],
            resourcePoints: 3,
            deck: 8,
          },
          emptyDash,
          FAB_MANUAL_HARNESS,
        );
        const Fai = game.as(fai);
        if (links >= 1) {
          Fai.attackWith(brandWithCinderclawRed);
          game.advanceCombatTo("resolution");
        }
        if (links >= 2) {
          Fai.attackWith(blazeHeadlongRed);
          game.advanceCombatTo("resolution");
        }
        if (links >= 3) {
          Fai.attackWith(risingResentmentRed);
          game.helpers.resolveUntilIdle({ optionalBoolean: false });
          if (game.combat()) game.advanceCombatTo("resolution");
        }

        const before = Fai.resourcePoints();
        Fai.must.activate(fai);
        if (game.getState().decision?.kind === "payment") {
          game.answerDecision(Fai.id, {
            kind: "payment",
            instanceIds: [Fai.cardIn("hand", dragonPowerBlue).instanceId],
          });
        }
        game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
        expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");
        if (links < 3) expect(Fai.resourcePoints()).toBe(before - (3 - links));
        expect(() => Fai.must.activate(fai)).toThrow();
      };

      run(0);
      run(1);
      run(2);
      run(3);
    });

    it("FI-E1 [AAA] Emberblade gains go again only with two Draconic links", () => {
      const before = FabTestEngine.start(
        {
          hero: fai,
          weapon1: [searingEmberblade],
          hand: [blazeHeadlongRed, brandWithCinderclawRed, risingResentmentRed, dragonPowerBlue],
          arsenal: [phoenixFlameRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Early = before.as(fai);
      Early.must.activate(searingEmberblade);
      before.advanceCombatTo("defend");
      expectCombat(before).toHaveAttackPower(3).notToHaveKeyword("go-again");
      before.helpers.resolveRestOfCombat();

      const after = FabTestEngine.start(
        {
          hero: fai,
          weapon1: [searingEmberblade],
          hand: [blazeHeadlongRed, brandWithCinderclawRed, risingResentmentRed, dragonPowerBlue],
          arsenal: [phoenixFlameRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Late = after.as(fai);
      Late.attackWith(brandWithCinderclawRed);
      after.advanceCombatTo("resolution");
      Late.attackWith(blazeHeadlongRed);
      after.advanceCombatTo("resolution");
      Late.must.activate(searingEmberblade);
      after.advanceCombatTo("defend");
      expectCombat(after).toHaveAttackPower(3).toHaveKeyword("go-again");
    });

    it("FI-E3 [AAA] Kunai survives the link and destroys only when the chain closes", () => {
      const game = FabTestEngine.start(
        {
          hero: fai,
          weapon1: [kunaiOfRetribution],
          hand: [blazeHeadlongRed, brandWithCinderclawRed, risingResentmentRed, dragonPowerBlue],
          arsenal: [phoenixFlameRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Fai = game.as(fai);
      Fai.must.activate(kunaiOfRetribution);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(1).toHaveKeyword("go-again");
      expectFabCard(Fai, kunaiOfRetribution).toBeIn("weapon1");
      game.advanceCombatTo("resolution");
      expectFabCard(Fai, kunaiOfRetribution).toBeIn("weapon1");
      game.helpers.resolveRestOfCombat();
      expectFabCard(Fai, kunaiOfRetribution).toBeIn("graveyard");
      expect(() => Fai.must.activate(kunaiOfRetribution)).toThrow();
    });

    it("FI-02 [AAA] Enflame and Lava Burst only pay off at their printed Draconic-link counts", () => {
      const chain = FabTestEngine.start(
        {
          hero: fai,
          hand: [burningBladeDanceRed, enflameTheFirebrandRed, lavaBurstRed, dragonPowerBlue],
          arsenal: [brandWithCinderclawRed],
          actionPoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], life: 20, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Fai = chain.as(fai);
      const Defender = chain.as(dash);

      Fai.must.playFromArsenal(brandWithCinderclawRed);
      chain.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(17);

      Fai.must.playAttack(enflameTheFirebrandRed);
      chain.advanceCombatTo("defend");
      expectCombat(chain).toHaveAttackPower(2);
      Defender.must.defend();
      chain.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(15);

      Fai.must.playAttack(burningBladeDanceRed);
      chain.advanceCombatTo("defend");
      expectCombat(chain).toHaveAttackPower(3);
      Defender.defendWith(Defender.cardsIn("hand", snatchRed).slice(0, 2));
      chain.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(15);

      Fai.must.playAttack(lavaBurstRed);
      chain.advanceCombatTo("defend");
      expectCombat(chain).toHaveAttackPower(5);
      Defender.must.defend();
      chain.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Defender).toHaveLife(10);
      Fai.must.endTurn();
      expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const earlyBurst = FabTestEngine.start(
        {
          hero: fai,
          hand: [lavaBurstRed, burningBladeDanceRed, enflameTheFirebrandRed, dragonPowerBlue],
          arsenal: [brandWithCinderclawRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      earlyBurst.as(fai).must.playAttack(lavaBurstRed);
      earlyBurst.advanceCombatTo("defend");
      expectCombat(earlyBurst).toHaveAttackPower(2);
    });
    it("FI-03 [AAA] Strike First +1s only the next Draconic, then Heels marks only at 2+ links", () => {
      const game = FabTestEngine.start(
        {
          hero: fai,
          hand: [fireTenetStrikeFirstRed, hotOnTheirHeelsRed, roninRenegadeRed, nipAtTheHeelsBlue],
          arsenal: [risingResentmentRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Fai = game.as(fai);
      const Defender = game.as(dash);

      Fai.must.playAttack(fireTenetStrikeFirstRed);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
      game.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(17);

      Fai.must.playAttack(roninRenegadeRed);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
      game.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(13);

      Fai.must.playAttack(hotOnTheirHeelsRed);
      game.toReaction("attacker");
      // Multiple attacks qualify (base power 3 or less); the player picks,
      // so name the active link's attack explicitly.
      Fai.must.play(nipAtTheHeelsBlue, {
        targetInstanceId: game.getState().combat?.activeLink?.activeAttack.sourceObjectId,
      });
      game.passBoth();
      expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(Defender).toHaveLife(9);
      expect(game.getState().players[Defender.id]!.marked).toBe(true);
      expectFabPlayer(Fai).toHaveAP(1);

      Fai.must.playFromArsenal(risingResentmentRed);
      game.advanceCombatTo("defend");
      expectCombat(game).toHaveAttackPower(3);
      game.helpers.resolveUntilIdle({ optionalBoolean: false });
      expectFabPlayer(Defender).toHaveLife(6);
      Fai.must.endTurn();
      expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const unmarked = FabTestEngine.start(
        {
          hero: fai,
          hand: [hotOnTheirHeelsRed, fireTenetStrikeFirstRed, roninRenegadeRed, nipAtTheHeelsBlue],
          arsenal: [risingResentmentRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      unmarked.as(fai).must.playAttack(hotOnTheirHeelsRed);
      unmarked.advanceCombatTo("defend");
      expectCombat(unmarked).toHaveAttackPower(3).notToHaveKeyword("go-again");
      unmarked.helpers.resolveRestOfCombat();
      expect(unmarked.getState().players[unmarked.as(dash).id]!.marked).toBe(false);
    });
    it("FI-04 [AAA] recurs Phoenix Flame only from its legal graveyard zone", () => {
      const start = () =>
        FabTestEngine.start(
          {
            hero: fai,
            hand: [fireThatBurnsWithinRed, riseFromTheAshesRed, displayLoyaltyRed, dragonPowerBlue],
            arsenal: [phoenixFlameRed],
            deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
          },
          { hero: dash, life: 20, deck: 8 },
          manual,
        );

      const legal = start();
      const Fai = legal.as(fai);
      const Defender = legal.as(dash);
      Fai.must.playFromArsenal(phoenixFlameRed);
      legal.helpers.resolveRestOfCombat();
      expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");

      Fai.must.play(riseFromTheAshesRed);
      legal.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
      expectFabCard(Fai, phoenixFlameRed).toBeIn("hand");

      Fai.must.playAttack(fireThatBurnsWithinRed, { pitch: [dragonPowerBlue] });
      legal.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
      expectFabPlayer(Defender).toHaveLife(13);
      expectFabCard(Fai, phoenixFlameRed).toBeIn("graveyard");
      expect(
        legal
          .committedEvents()
          .filter((event) => event.name === "draw" && event.data.playerId === Fai.id),
      ).toHaveLength(1);

      Fai.must.playAttack(displayLoyaltyRed);
      legal.helpers.resolveRestOfCombat();
      expectFabPlayer(Defender).toHaveLife(10);
      expect(Fai.zone("banished")).toEqual([]);
      Fai.must.endTurn();
      expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const absent = start();
      const AbsentFai = absent.as(fai);
      AbsentFai.must.play(riseFromTheAshesRed);
      absent.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
      expect(absent.getState().decision).toBeNull();
      expectFabCard(AbsentFai, phoenixFlameRed).toBeIn("arsenal");

      AbsentFai.must.playAttack(fireThatBurnsWithinRed, { pitch: [dragonPowerBlue] });
      absent.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
      expectFabPlayer(absent.as(dash)).toHaveLife(15);
      expect(
        absent
          .committedEvents()
          .filter((event) => event.name === "draw" && event.data.playerId === AbsentFai.id),
      ).toHaveLength(0);
      expect(AbsentFai.zone("banished")).toEqual([]);
      AbsentFai.must.endTurn();
      expectFabPlayer(AbsentFai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("FI-05 [AAA] reaches Breaking Point at chain link four only from the lower-life branch", () => {
      const rupture = FabTestEngine.start(
        {
          hero: fai,
          life: 19,
          hand: [breakingPointRed, snatchRed, scarForAScarRed, ravenousRabbleRed],
          arsenal: [brandWithCinderclawYellow],
          deck: [
            dragonPowerBlue,
            dragonPowerBlue,
            dragonPowerBlue,
            dragonPowerBlue,
            dragonPowerBlue,
            dragonPowerBlue,
          ],
        },
        { hero: dash, life: 20, arsenal: [sinkBelowRed], deck: 8 },
        manual,
      );
      const Fai = rupture.as(fai);
      const Defender = rupture.as(dash);

      Fai.must.playAttack(scarForAScarRed);
      rupture.advanceCombatTo("resolution");
      Fai.must.playAttack(ravenousRabbleRed);
      rupture.advanceCombatTo("resolution");
      Fai.must.playFromArsenal(brandWithCinderclawYellow);
      rupture.advanceCombatTo("resolution");
      Fai.must.playAttack(breakingPointRed, { pitch: [snatchRed] });
      rupture.helpers.resolveUntilIdle({ entityTargets: "minimum" });

      expectFabPlayer(Defender).toHaveLife(7);
      expectFabCard(Defender, sinkBelowRed).toBeIn("graveyard");
      expect(Defender.zone("arsenal")).toEqual([]);
      expect(rupture.combat()).toBeNull();
      Fai.must.endTurn();
      expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const equal = FabTestEngine.start(
        {
          hero: fai,
          life: 20,
          hand: [breakingPointRed, snatchRed, scarForAScarRed, ravenousRabbleRed],
          arsenal: [brandWithCinderclawYellow],
          deck: 8,
        },
        { hero: dash, life: 20, arsenal: [sinkBelowRed], deck: 8 },
        manual,
      );
      const EqualFai = equal.as(fai);
      EqualFai.must.playAttack(scarForAScarRed);
      equal.helpers.resolveRestOfCombat();
      expectFabPlayer(EqualFai).toHaveAP(0);
      expectFabCard(equal.as(dash), sinkBelowRed).toBeIn("arsenal");
      EqualFai.must.endTurn();
      expectFabPlayer(EqualFai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("FI-E2 [AAA] Paws makes a playable banished Tiger; Shuko +2s only the next Tiger", () => {
      const paws = FabTestEngine.start(
        {
          hero: fai,
          legs: [pouncingPaws],
          hand: [blazeHeadlongRed, brandWithCinderclawRed, risingResentmentRed, dragonPowerBlue],
          arsenal: [phoenixFlameRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const PawsFai = paws.as(fai);
      PawsFai.must.activate(pouncingPaws);
      paws.helpers.resolveUntilIdle({ optionalBoolean: true });
      expectFabCard(PawsFai, pouncingPaws).toBeIn("graveyard");
      expect(PawsFai.zone("banished")).toContain("token:crouching-tiger");
      const tigerId = paws
        .getState()
        .containers.zonesByPlayerId[PawsFai.id]!.banished.find(
          (instanceId) =>
            paws.getState().objects[instanceId]?.canonicalId === "token:crouching-tiger",
        );
      expect(tigerId).toBeDefined();
      PawsFai.playInstance(tigerId!, { from: "banished" });
      paws.advanceCombatTo("defend");
      expectCombat(paws).toHaveAttackPower(0).toHaveKeyword("go-again");
      paws.helpers.resolveRestOfCombat();
      expectFabPlayer(paws.as(dash)).toHaveLife(20);
      expect(() => PawsFai.must.activate(pouncingPaws)).toThrow();

      const shuko = FabTestEngine.start(
        {
          hero: fai,
          arms: [tearingShuko],
          hand: [crouchingTiger, crouchingTiger, brandWithCinderclawRed, dragonPowerBlue],
          arsenal: [phoenixFlameRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const ShukoFai = shuko.as(fai);
      ShukoFai.must.activate(tearingShuko);
      shuko.passBoth();
      expectFabCard(ShukoFai, tearingShuko).toBeIn("graveyard");
      const [firstTiger, laterTiger] = ShukoFai.cardsIn("hand", crouchingTiger);
      ShukoFai.must.playAttack(firstTiger!);
      shuko.advanceCombatTo("defend");
      expectCombat(shuko).toHaveAttackPower(2);
      shuko.advanceCombatTo("resolution");
      expectFabPlayer(shuko.as(dash)).toHaveLife(18);
      ShukoFai.must.playAttack(laterTiger!);
      shuko.advanceCombatTo("defend");
      expectCombat(shuko).toHaveAttackPower(0);
    });
    it("FI-D1 [AAA] applies Blade Beckoner's weapon bonus and preserves Fai's next turn", () => {
      const startVariant = (weapon: boolean) =>
        FabTestEngine.start(
          {
            hero: fai,
            head: [bladeBeckonerHelm],
            hand: [blazeHeadlongRed, brandWithCinderclawRed, dragonPowerBlue, arcanePolarityRed],
            arsenal: [phoenixFlameRed],
            deck: 8,
          },
          {
            hero: dash,
            weapon1: weapon ? [dawnblade] : undefined,
            hand: [snatchRed, glintTheQuicksilverBlue, hitAndRunBlue, bladeRunnerRed],
            resourcePoints: weapon ? 1 : 0,
            deck: 8,
          },
          manual,
        );

      for (const weapon of [true, false]) {
        const game = startVariant(weapon);
        const Fai = game.as(fai);
        let Attacker = game.as(dash);
        const helmId = Fai.findCardInZone("head", bladeBeckonerHelm);
        Fai.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        if (weapon) {
          Attacker.must.activate(dawnblade);
          game.answerDecision(Attacker.id, {
            kind: "payment",
            instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
          });
        } else Attacker.must.playAttack(snatchRed);
        game.advanceCombatTo("defend");
        Fai.defendWith(bladeBeckonerHelm);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Fai).toHaveLife(weapon ? 19 : 17);
        expect(game.objectState(helmId)?.defenseCounterTotal).toBe(weapon ? -2 : -1);
        expect(Fai.zone("head")).toContain(bladeBeckonerHelm.canonicalId);

        Attacker.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        Fai.must.playAttack(blazeHeadlongRed);
        game.advanceCombatTo("defend");
        Attacker.must.defend();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        Fai.must.endTurn();
        expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
        expect(Fai.zone("arsenal")).toEqual([phoenixFlameRed.canonicalId]);
      }
    });
    it("FI-D2 [AAA] gives Bloodied Oval 1 defense only while Fai is behind", () => {
      for (const behind of [true, false]) {
        const game = FabTestEngine.start(
          {
            hero: fai,
            weapon2: [bloodiedOval],
            life: behind ? 18 : 20,
            hand: [blazeHeadlongRed, brandWithCinderclawRed, dragonPowerBlue, arcanePolarityRed],
            arsenal: [phoenixFlameRed],
            deck: 8,
          },
          { hero: dash, life: 20, hand: [isolateYellow], deck: 8 },
          manual,
        );
        const Fai = game.as(fai);
        const Attacker = game.as(dash);
        Fai.must.endTurn();
        Attacker.must.playAttack(isolateYellow);
        game.advanceCombatTo("defend");
        Fai.defendWith(bloodiedOval);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Fai).toHaveLife(behind ? 17 : 18);
        expectFabCard(Fai, bloodiedOval).toBeIn("graveyard");
        expect(Fai.zone("arsenal")).toEqual([phoenixFlameRed.canonicalId]);
      }
    });
    it("FI-D3 [AAA] chooses Mask Spellvoid or Lantern Arcane Barrier independently", () => {
      for (const mask of [true, false]) {
        const game = FabTestEngine.start(
          {
            hero: fai,
            head: mask ? [maskOfTheSwarmingClaw] : undefined,
            weapon2: mask ? undefined : [arcaneLantern],
            resourcePoints: mask ? 0 : 1,
            hand: [blazeHeadlongRed, brandWithCinderclawRed, dragonPowerBlue, arcanePolarityRed],
            arsenal: [phoenixFlameRed],
            deck: 8,
          },
          {
            hero: briar,
            hand: [entwineLightningRed, nimblismRed, snatchRed, arcanePolarityRed],
            arsenal: [sigilOfSufferingRed],
            deck: 8,
          },
          manual,
        );
        const Fai = game.as(fai);
        const Defender = game.as(briar);

        Fai.must.playAttack(blazeHeadlongRed);
        game.advanceCombatTo("reaction");
        game.helpers.passPriorityTo(Defender);
        Defender.play(sigilOfSufferingRed, { from: "arsenal" });
        game.passBoth();
        const choice = Fai.expectDecision("option");
        const prevention = choice.options.find((option) =>
          option.id.endsWith(mask ? ":spellvoid" : ":arcane-barrier"),
        );
        expect(prevention).toBeDefined();
        Fai.chooseOptions(prevention!.id);
        game.helpers.resolveUntilIdle({ ordering: "listed", optionalOptions: "none" });

        expectFabPlayer(Fai).toHaveLife(20).toHaveResourceCount(0);
        expectFabPlayer(Defender).toHaveLife(19);
        expectFabCard(Defender, sigilOfSufferingRed).toBeIn("graveyard");
        if (mask) expectFabCard(Fai, maskOfTheSwarmingClaw).toBeIn("graveyard");
        else expectFabCard(Fai, arcaneLantern).toBeIn("weapon2");
        expect(Fai.zone("arsenal")).toEqual([phoenixFlameRed.canonicalId]);
        expect(
          game
            .committedEvents()
            .filter(
              (event) =>
                event.name === "prevent" &&
                event.source?.canonicalId ===
                  (mask ? maskOfTheSwarmingClaw.canonicalId : arcaneLantern.canonicalId),
            ),
        ).toHaveLength(1);
        Fai.must.endTurn();
        expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("FI-D4 [AAA] Arcane Polarity gains 4 only after unprevented arcane damage", () => {
      for (const prevented of [false, true]) {
        const game = FabTestEngine.start(
          {
            hero: fai,
            weapon2: prevented ? [arcaneLantern] : undefined,
            resourcePoints: prevented ? 1 : 0,
            hand: [blazeHeadlongRed, brandWithCinderclawRed, dragonPowerBlue, arcanePolarityRed],
            arsenal: [phoenixFlameRed],
            deck: 8,
          },
          {
            hero: briar,
            hand: [entwineLightningRed, nimblismRed, snatchRed, lightningPressRed],
            arsenal: [sigilOfSufferingRed],
            deck: 8,
          },
          manual,
        );
        const Fai = game.as(fai);
        const Defender = game.as(briar);
        Fai.must.playAttack(blazeHeadlongRed);
        game.advanceCombatTo("reaction");
        game.helpers.passPriorityTo(Defender);
        Defender.play(sigilOfSufferingRed, { from: "arsenal" });
        game.passBoth();
        if (prevented) {
          const choice = Fai.expectDecision("option");
          const barrier = choice.options.find((option) => option.id.endsWith(":arcane-barrier"));
          expect(barrier).toBeDefined();
          Fai.chooseOptions(barrier!.id);
        }
        game.helpers.resolveUntilIdle({ ordering: "listed", optionalOptions: "none" });
        Fai.must.playInstant(arcanePolarityRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Fai)
          .toHaveLife(prevented ? 21 : 23)
          .toHaveResourceCount(0);
        expectFabCard(Fai, arcanePolarityRed).toBeIn("graveyard");
        expectFabCard(Defender, sigilOfSufferingRed).toBeIn("graveyard");
        expect(Fai.zone("arsenal")).toEqual([phoenixFlameRed.canonicalId]);
        game.helpers.resolveRestOfCombat();
        Fai.must.endTurn();
        expectFabPlayer(Fai).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
  });
});
