/**
 * Runeblade play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { volticBoltRed } from "../../../../cards/src/cards/actions/voltic-bolt.ts";
import { graspOfTheArknight } from "../../../../cards/src/cards/equipment/grasp-of-the-arknight.ts";
import { mordredTideRed } from "../../../../cards/src/cards/actions/mordred-tide.ts";
import { whisperOfTheOracleBlue } from "../../../../cards/src/cards/actions/whisper-of-the-oracle.ts";
import { ravenousRabbleRed } from "../../../../cards/src/cards/actions/ravenous-rabble.ts";
import { reduceToRunechantRed } from "../../../../cards/src/cards/defense-reactions/reduce-to-runechant.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { flitteringChargeRed } from "../../../../cards/src/cards/actions/flittering-charge.ts";
import { secondStrikeRed } from "../../../../cards/src/cards/actions/second-strike.ts";
import { harnessLightningRed } from "../../../../cards/src/cards/actions/harness-lightning.ts";
import { starFall } from "../../../../cards/src/cards/weapons/star-fall.ts";
import { blitzKicks } from "../../../../cards/src/cards/equipment/blitz-kicks.ts";
import { bloodiedOval } from "../../../../cards/src/cards/equipment/bloodied-oval.ts";
import { ebonFold } from "../../../../cards/src/cards/equipment/ebon-fold.ts";
import { predatoryAssaultRed } from "../../../../cards/src/cards/actions/predatory-assault.ts";
import { hitAndRunBlue } from "../../../../cards/src/cards/actions/hit-and-run.ts";
import { mauvrionSkiesRed } from "../../../../cards/src/cards/actions/mauvrion-skies.ts";
import { widespreadAnnihilationBlue } from "../../../../cards/src/cards/actions/widespread-annihilation.ts";
import { funeralMoonRed } from "../../../../cards/src/cards/actions/funeral-moon.ts";
import { deathlyDelightRed } from "../../../../cards/src/cards/actions/deathly-delight.ts";
import { deathlyWailRed } from "../../../../cards/src/cards/actions/deathly-wail.ts";
import { deathlyWailBlue } from "../../../../cards/src/cards/actions/deathly-wail.ts";
import { envelopInDarknessRed } from "../../../../cards/src/cards/actions/envelop-in-darkness.ts";
import { putridStirringsRed } from "../../../../cards/src/cards/actions/putrid-stirrings.ts";
import { beseechTheDemigonRed } from "../../../../cards/src/cards/actions/beseech-the-demigon.ts";
import { tearThroughThePortalRed } from "../../../../cards/src/cards/actions/tear-through-the-portal.ts";
import { widespreadRuinRed } from "../../../../cards/src/cards/actions/widespread-ruin.ts";
import { grimoireOfTheHaunt } from "../../../../cards/src/cards/equipment/grimoire-of-the-haunt.ts";
import { dyadicCarapace } from "../../../../cards/src/cards/equipment/dyadic-carapace.ts";
import { vynnset } from "../../../../cards/src/cards/heroes/vynnset.ts";
import { oblivionBlue } from "../../../../cards/src/cards/instants/oblivion.ts";
import { flailOfAgony } from "../../../../cards/src/cards/weapons/flail-of-agony.ts";
import { arcanicShockwaveRed } from "../../../../cards/src/cards/actions/arcanic-shockwave.ts";
import { entwineLightningRed } from "../../../../cards/src/cards/actions/entwine-lightning.ts";
import { weaveLightningRed } from "../../../../cards/src/cards/actions/weave-lightning.ts";
import { sigilOfSufferingRed } from "../../../../cards/src/cards/defense-reactions/sigil-of-suffering.ts";
import { spellboundCreepers } from "../../../../cards/src/cards/equipment/spellbound-creepers.ts";
import { briar } from "../../../../cards/src/cards/heroes/briar.ts";
import { lightningPressRed } from "../../../../cards/src/cards/instants/lightning-press.ts";
import { runebloodIncantationRed } from "../../../../cards/src/cards/actions/runeblood-incantation.ts";
import { bladeRunnerRed } from "../../../../cards/src/cards/attack-reactions/blade-runner.ts";
import { vexingQuillhand } from "../../../../cards/src/cards/equipment/vexing-quillhand.ts";
import { arcaneLantern } from "../../../../cards/src/cards/equipment/arcane-lantern.ts";
import { deadwoodDirgeRed } from "../../../../cards/src/cards/actions/deadwood-dirge.ts";
import { maleficIncantationRed } from "../../../../cards/src/cards/actions/malefic-incantation.ts";
import { cullRed } from "../../../../cards/src/cards/actions/cull.ts";
import { bladeBeckonerHelm } from "../../../../cards/src/cards/equipment/blade-beckoner-helm.ts";
import { sonataGalaxiaRed } from "../../../../cards/src/cards/actions/sonata-galaxia.ts";
import { scarForAScarRed } from "../../../../cards/src/cards/actions/scar-for-a-scar.ts";
import { shadowPuppetryRed } from "../../../../cards/src/cards/actions/shadow-puppetry.ts";
import { invertExistenceBlue } from "../../../../cards/src/cards/instants/invert-existence.ts";
import { eloquentEulogyRed } from "../../../../cards/src/cards/actions/eloquent-eulogy.ts";
import { pathOfSameEndsRed } from "../../../../cards/src/cards/actions/path-of-same-ends.ts";
import { rushOfPowerRed } from "../../../../cards/src/cards/actions/rush-of-power.ts";
import { quickSuccessionRed } from "../../../../cards/src/cards/actions/quick-succession.ts";
import { quickSuccessionYellow } from "../../../../cards/src/cards/actions/quick-succession.ts";
import { isolateYellow } from "../../../../cards/src/cards/actions/isolate.ts";
import { deepRecessesOfExistenceBlue } from "../../../../cards/src/cards/actions/deep-recesses-of-existence.ts";
import { fastingCarcassBlue } from "../../../../cards/src/cards/actions/fasting-carcass.ts";
import { sproutStrengthRed } from "../../../../cards/src/cards/actions/sprout-strength.ts";
import { machinationsOfDominionBlue } from "../../../../cards/src/cards/actions/machinations-of-dominion.ts";
import { succumbToTemptationYellow } from "../../../../cards/src/cards/actions/succumb-to-temptation.ts";
import { facePurgatory } from "../../../../cards/src/cards/equipment/face-purgatory.ts";
import { arcanePolarityRed } from "../../../../cards/src/cards/instants/arcane-polarity.ts";
import { arcaneSeedsLifeRed } from "../../../../cards/src/cards/actions/arcane-seeds-life.ts";
import { burnUpShockRed } from "../../../../cards/src/cards/actions/burn-up-shock.ts";
import { lightningSurgeRed } from "../../../../cards/src/cards/actions/lightning-surge.ts";
import { sizzleRed } from "../../../../cards/src/cards/actions/sizzle.ts";
import { staticShockRed } from "../../../../cards/src/cards/actions/static-shock.ts";
import { swiftstrikeBracers } from "../../../../cards/src/cards/equipment/swiftstrike-bracers.ts";
import { dawnblade } from "../../../../cards/src/cards/weapons/dawnblade.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { nimblismRed } from "../../../../cards/src/cards/actions/nimblism.ts";
import { glintTheQuicksilverBlue } from "../../../../cards/src/cards/attack-reactions/glint-the-quicksilver.ts";
import { viseraiBetweenWorlds } from "../../../../cards/src/cards/heroes/viserai-between-worlds.ts";
import { sevenSinNebula } from "../../../../cards/src/cards/weapons/seven-sin-nebula.ts";
import { vexingGloombladeRed } from "../../../../cards/src/cards/actions/vexing-gloomblade.ts";
import { runicReavingRed } from "../../../../cards/src/cards/actions/runic-reaving.ts";
import { runicReavingYellow } from "../../../../cards/src/cards/actions/runic-reaving.ts";
import { runicDispositionRed } from "../../../../cards/src/cards/actions/runic-disposition.ts";
import { viseraiUsurper } from "../../../../cards/src/cards/heroes/viserai-usurper.ts";
import { openTheGateToIArathaelRed } from "../../../../cards/src/cards/actions/open-the-gate-to-i-arathael.ts";
import { unboundByShadowRed } from "../../../../cards/src/cards/actions/unbound-by-shadow.ts";
import { embraceSinYellow } from "../../../../cards/src/cards/actions/embrace-sin.ts";
import { runechantOfGreedYellow } from "../../../../cards/src/cards/instants/runechant-of-greed.ts";
import { demonboundGloombladeRed } from "../../../../cards/src/cards/actions/demonbound-gloomblade.ts";

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
  expectFabToken,
  expectFabUnplayable,
  expectWait,
  fabToken,
} from "../../testing/index.ts";
import { emptyDash, toDefend, missBlockAndClose, manual } from "./helpers.ts";

describe("Runeblade play lines", { timeout: 20_000 }, () => {
  describe("Briar", () => {
    it("BR-01 [AAA] Weave buffs fused Entwine, then first AAC damage creates Earth", () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          hand: [entwineLightningRed, weaveLightningRed, flitteringChargeRed, scarForAScarRed],
          arsenal: [arcanicShockwaveRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Defender = game.as(dash);

      Briar.must.play(weaveLightningRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveAP(1);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);

      Briar.must.playAttack(entwineLightningRed, {
        fuse: true,
        fuseCards: [flitteringChargeRed],
      });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(7).toHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(13);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1).toHaveAP(1);

      Briar.must.playAttack(flitteringChargeRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(9);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1).toHaveAP(0);
      expect(Briar.zone("arsenal")).toEqual([arcanicShockwaveRed.canonicalId]);
      expectFabCard(Briar, scarForAScarRed).toBeIn("hand");
      Briar.must.endTurn();
      expectFabPlayer(Briar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("BR-04 [AAA] Nimblism stacks +3 on Second Strike", () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          hand: [sproutStrengthRed, nimblismRed, lightningPressRed, secondStrikeRed],
          arsenal: [entwineLightningRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Defender = game.as(dash);

      Briar.must.play(nimblismRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Briar.attackWith(secondStrikeRed);
      expectCombat(game).toHaveAttackPower(6);
      game.helpers.resolveRestOfCombat();

      expectFabPlayer(Defender).toHaveLife(14);
      expect(Briar.zone("arsenal")).toEqual([entwineLightningRed.canonicalId]);
      expectFabCard(Briar, sproutStrengthRed).toBeIn("hand");
      Briar.must.endTurn();
      expectFabPlayer(Briar).toHaveAP(0).toHaveResourceCount(0);
    });

    it("BR-H2 [AAA] creates one Lightning on the second NAA and resets next turn", () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          hand: [quickSuccessionRed, sproutStrengthRed, secondStrikeRed, snatchRed],
          arsenal: [flitteringChargeRed],
          deck: [
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
          ],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);

      Briar.must.play(quickSuccessionRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
      Briar.must.play(sproutStrengthRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
      Briar.attackWith(snatchRed);
      missBlockAndClose(game);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);

      Briar.must.endTurn();
      game.as(dash).must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);

      const nimbles = Briar.cardsIn("hand", nimblismRed);
      Briar.must.play(nimbles[0]!);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);
      Briar.must.play(nimbles[1]!);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
    });

    it("BR-E1 [AAA] Star Fall is +1/go again only after a Lightning card", () => {
      const withLightning = FabTestEngine.start(
        {
          hero: briar,
          weapon1: [starFall],
          hand: [lightningPressRed, entwineLightningRed, snatchRed, quickSuccessionRed],
          arsenal: [flitteringChargeRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Briar = withLightning.as(briar);
      Briar.must.play(quickSuccessionRed);
      withLightning.helpers.resolveUntilIdle({ ordering: "listed" });
      Briar.must.activate(starFall);
      withLightning.advanceCombatTo("defend");
      expectCombat(withLightning).toHaveAttackPower(2).toHaveKeyword("go-again");

      const without = FabTestEngine.start(
        {
          hero: briar,
          weapon1: [starFall],
          hand: [lightningPressRed, entwineLightningRed, snatchRed, quickSuccessionRed],
          arsenal: [flitteringChargeRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Plain = without.as(briar);
      Plain.must.activate(starFall);
      without.advanceCombatTo("defend");
      expectCombat(without).toHaveAttackPower(1).notToHaveKeyword("go-again");
    });

    it("BR-02 [AAA] orders Runechants, Burn Up, and Static Shock exactly once", () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          hand: [arcaneSeedsLifeRed, burnUpShockRed, lightningSurgeRed, sizzleRed],
          arsenal: [staticShockRed],
          actionPoints: 1,
          deck: 8,
        },
        { hero: dash, hand: [], life: 30, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Defender = game.as(dash);

      Briar.play(arcaneSeedsLifeRed, { playMethod: { kind: "face", face: "left" } });
      game.untilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveTokenCount("runechant", 2).toHaveAP(1);

      Briar.play(burnUpShockRed, { playMethod: { kind: "face", face: "left" } });
      game.untilIdle({ ordering: "listed" });
      Briar.must.play(sizzleRed);
      game.untilIdle({ ordering: "listed" });

      // Playing the arsenal attack creates three simultaneous triggers: the
      // two Runechants and Briar's second-non-attack-action Embodiment trigger.
      // CR 7.2.4 puts them on the stack before the attack reaches Defend.
      Briar.play(staticShockRed, { from: "arsenal" });
      game.advanceUntil({ stopAt: "defend", ordering: "listed" });
      Defender.must.defend();
      game.closeCombat({ ordering: "listed" });

      // 2 Runechant arcane + 7 physical + 4 Burn Up arcane + 1 Static Shock
      // arcane = 14. Each packet resolves once, and both Runechants are spent.
      expectFabPlayer(Defender).toHaveLife(16);
      expectFabPlayer(Briar).toHaveTokenCount("runechant", 0).toHaveAP(1);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
      expectFabCard(Briar, lightningSurgeRed).toBeIn("hand");
      expect(Briar.zone("arsenal")).toEqual([]);
    });
    it("BR-03 [AAA] go-again chain then Path; Rabble power ignores life", () => {
      const run = (opponentLife: 20 | 22) => {
        const game = FabTestEngine.start(
          {
            hero: briar,
            hand: [harnessLightningRed, quickSuccessionRed, ravenousRabbleRed, snatchRed],
            arsenal: [pathOfSameEndsRed],
            deck: [
              nimblismRed,
              nimblismRed,
              nimblismRed,
              nimblismRed,
              nimblismRed,
              nimblismRed,
              nimblismRed,
              nimblismRed,
            ],
          },
          { hero: dash, hand: [], life: opponentLife, deck: 8 },
          FAB_MANUAL_HARNESS,
        );
        const Briar = game.as(briar);
        const Defender = game.as(dash);

        Briar.must.play(quickSuccessionRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);

        Briar.must.playAttack(ravenousRabbleRed);
        toDefend(game);
        expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
        missBlockAndClose(game);

        expectFabPlayer(Defender).toHaveLife(opponentLife - 5);
        expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1).toHaveAP(1);

        Briar.must.playFromArsenal(pathOfSameEndsRed);
        toDefend(game);
        expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
        missBlockAndClose(game);

        expectFabPlayer(Defender).toHaveLife(opponentLife - 10);
        expectFabPlayer(Briar).toHaveAP(1);

        Briar.must.play(harnessLightningRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Defender).toHaveLife(opponentLife - 13);
        expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 1);
        expectFabCard(Briar, snatchRed).toBeIn("hand");
        Briar.must.endTurn();
        expectFabPlayer(Briar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      };
      run(20);
      run(22);
    });
    it("BR-05 [AAA] Yellow Quick Succession buffs Rush then Flittering through arsenal", () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          hand: [arcanePolarityRed, rushOfPowerRed, sigilOfSufferingRed, quickSuccessionYellow],
          arsenal: [flitteringChargeRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Briar = game.as(briar);
      const Defender = game.as(dash);

      Briar.must.play(quickSuccessionYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-lightning", 0);

      Briar.must.playAttack(rushOfPowerRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(14);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1).toHaveAP(1);

      Briar.must.playFromArsenal(flitteringChargeRed);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Briar);
      Briar.must.playInstant(arcanePolarityRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(9);
      expectFabPlayer(Briar).toHaveLife(21).toHaveAP(1);
      expectFabCard(Briar, sigilOfSufferingRed).toBeIn("hand");
      expect(Briar.zone("arsenal")).toEqual([]);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
      Briar.must.endTurn();
      expectFabPlayer(Briar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
    });
    it("BR-H1 [AAA] creates no Earth on a block, then one Lightning and one Earth", () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          hand: [nimblismRed, weaveLightningRed, entwineLightningRed, snatchRed],
          arsenal: [flitteringChargeRed],
          deck: 8,
        },
        {
          hero: dash,
          hand: [snatchRed, snatchRed, snatchRed, snatchRed],
          deck: 8,
        },
        manual,
      );
      const Briar = game.as(briar);
      const Defender = game.as(dash);

      Briar.must.play(nimblismRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Briar.must.playAttack(entwineLightningRed, {
        fuse: true,
        fuseCards: [weaveLightningRed],
      });
      game.advanceCombatTo("defend");
      Defender.defendWith(Defender.cardsIn("hand", snatchRed));
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(20);
      expect(Briar.zone("arena")).not.toContain("token:embodiment-of-earth");

      Briar.must.play(weaveLightningRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Briar.zone("arena")).toContain("token:embodiment-of-lightning");

      Briar.must.playAttack(snatchRed);
      game.advanceCombatTo("defend");
      Defender.must.defend();
      expect(Briar.zone("arena")).not.toContain("token:embodiment-of-lightning");
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(16);
      expect(
        Briar.zone("arena").filter((card) => card === "token:embodiment-of-earth"),
      ).toHaveLength(1);
      expect(Briar.zone("arsenal")).toEqual([flitteringChargeRed.canonicalId]);
      Briar.must.endTurn();
      expectFabPlayer(Briar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("BR-E2 [AAA] Kicks need an instant and Bracers need Nimblism", () => {
      const kicksReady = FabTestEngine.start(
        {
          hero: briar,
          legs: [blitzKicks],
          hand: [arcanePolarityRed, nimblismRed, snatchRed, sproutStrengthRed],
          arsenal: [flitteringChargeRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const KicksBriar = kicksReady.as(briar);
      KicksBriar.must.playInstant(arcanePolarityRed);
      kicksReady.helpers.resolveUntilIdle({ ordering: "listed" });
      KicksBriar.must.activate(blitzKicks);
      kicksReady.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(KicksBriar).toHaveTokenCount("embodiment-of-lightning", 1);
      expectFabPlayer(KicksBriar).toHaveLife(21).toHaveResourceCount(0);
      expect(KicksBriar.zone("legs")).toEqual([]);

      const kicksBlocked = FabTestEngine.start(
        {
          hero: briar,
          legs: [blitzKicks],
          hand: [arcanePolarityRed, nimblismRed, snatchRed, sproutStrengthRed],
          arsenal: [flitteringChargeRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      kicksBlocked.as(briar).expectActivationRejected(blitzKicks);
      expectFabPlayer(kicksBlocked.as(briar)).toHaveTokenCount("embodiment-of-lightning", 0);

      const bracersReady = FabTestEngine.start(
        {
          hero: briar,
          arms: [swiftstrikeBracers],
          hand: [arcanePolarityRed, nimblismRed, snatchRed, sproutStrengthRed],
          arsenal: [flitteringChargeRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const BracersBriar = bracersReady.as(briar);
      BracersBriar.must.play(nimblismRed);
      bracersReady.helpers.resolveUntilIdle({ ordering: "listed" });
      BracersBriar.must.activate(swiftstrikeBracers);
      bracersReady.helpers.resolveUntilIdle({ ordering: "listed" });
      BracersBriar.must.playAttack(snatchRed);
      toDefend(bracersReady);
      expectCombat(bracersReady).toHaveAttackPower(9);
      missBlockAndClose(bracersReady);
      expectFabPlayer(bracersReady.as(dash)).toHaveLife(11);
      expect(BracersBriar.zone("arms")).toEqual([]);
      expect(BracersBriar.zone("arsenal")).toEqual([flitteringChargeRed.canonicalId]);

      const bracersBlocked = FabTestEngine.start(
        {
          hero: briar,
          arms: [swiftstrikeBracers],
          hand: [arcanePolarityRed, nimblismRed, snatchRed, sproutStrengthRed],
          arsenal: [flitteringChargeRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      bracersBlocked.as(briar).expectActivationRejected(swiftstrikeBracers);
    });
    it("BR-D1 [AAA] gives arsenal Sigil +1 defense only after actual arcane damage", () => {
      const run = (prevented: boolean) => {
        let game = FabTestEngine.start(
          {
            hero: briar,
            hand: [entwineLightningRed, nimblismRed, snatchRed, arcanePolarityRed],
            arsenal: [sigilOfSufferingRed],
            deck: 8,
          },
          {
            hero: dash,
            weapon2: prevented ? [arcaneLantern] : undefined,
            hand: [predatoryAssaultRed, whisperOfTheOracleBlue],
            deck: 8,
          },
          manual,
        );
        let Briar = game.as(briar);
        let Attacker = game.as(dash);
        Briar.must.endTurn();
        Attacker.must.playAttack(predatoryAssaultRed, { pitch: [whisperOfTheOracleBlue] });
        game.advanceCombatTo("reaction");
        game.helpers.passPriorityTo(Briar);
        Briar.play(sigilOfSufferingRed, { from: "arsenal" });
        game.passBoth();

        const beforeRestore = game.getState();
        game = FabTestEngine.fromState(
          restoreFabMatchSnapshot(
            serializeFabMatchSnapshot(beforeRestore),
            createFabMatchContext(
              beforeRestore.cardDefinitions,
              beforeRestore.publicCardIdentities,
            ),
          ),
        );
        Briar = game.as(briar);
        Attacker = game.as(dash);
        if (prevented) {
          const choice = Attacker.expectDecision("option");
          const barrier = choice.options.find((option) => option.id.endsWith(":arcane-barrier"));
          expect(barrier).toBeDefined();
          Attacker.chooseOptions(barrier!.id);
        }
        game.helpers.resolveUntilIdle({
          ordering: "listed",
          optionalOptions: "none",
        });

        expectFabPlayer(Attacker).toHaveLife(prevented ? 20 : 19);
        expectFabPlayer(Briar)
          .toHaveLife(prevented ? 17 : 18)
          .toHaveHandCount(4);
        expectFabPlayer(Attacker).toHaveResourceCount(prevented ? 0 : 1);
        expectFabCard(Briar, sigilOfSufferingRed).toBeIn("graveyard");
        expect(Briar.zone("arsenal")).toEqual([]);
        expect(Attacker.zone("pitch")).toContain(whisperOfTheOracleBlue.canonicalId);
        expect(
          game
            .committedEvents()
            .filter(
              (event) =>
                event.name === "prevent" &&
                "preventedAmount" in event.data &&
                event.data.preventedAmount === 1,
            ),
        ).toHaveLength(prevented ? 1 : 0);
      };
      run(false);
      run(true);
    });
    it("BR-D2 [AAA] gives Blade Beckoner +1 only against a weapon attack", () => {
      for (const weapon of [true, false]) {
        const game = FabTestEngine.start(
          {
            hero: briar,
            head: [bladeBeckonerHelm],
            hand: [entwineLightningRed, nimblismRed, snatchRed, arcanePolarityRed],
            arsenal: [sigilOfSufferingRed],
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
        const Briar = game.as(briar);
        const Attacker = game.as(dash);
        const helmId = Briar.findCardInZone("head", bladeBeckonerHelm);

        Briar.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        if (weapon) {
          Attacker.must.activate(dawnblade);
          game.answerDecision(Attacker.id, {
            kind: "payment",
            instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
          });
        } else Attacker.must.playAttack(snatchRed);
        game.advanceCombatTo("defend");
        Briar.defendWith(bladeBeckonerHelm);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Briar)
          .toHaveLife(weapon ? 19 : 17)
          .toHaveHandCount(4);
        expect(game.objectState(helmId)?.defenseCounterTotal).toBe(weapon ? -2 : -1);
        expectFabCard(Briar, bladeBeckonerHelm).toBeIn("head");
        expect(Briar.zone("arsenal")).toEqual([sigilOfSufferingRed.canonicalId]);
        Attacker.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        Briar.must.endTurn();
        expectFabPlayer(Briar).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("BR-D3 [AAA] gives Bloodied Oval 1 defense only while Briar is behind", () => {
      for (const life of [18, 20, 22] as const) {
        const game = FabTestEngine.start(
          {
            hero: briar,
            weapon2: [bloodiedOval],
            life,
            hand: [entwineLightningRed, nimblismRed, snatchRed, arcanePolarityRed],
            arsenal: [sigilOfSufferingRed],
            deck: 8,
          },
          { hero: dash, life: 20, hand: [isolateYellow, snatchRed, snatchRed, snatchRed], deck: 8 },
          manual,
        );
        const Briar = game.as(briar);
        const Attacker = game.as(dash);
        Briar.must.endTurn();
        Attacker.must.playAttack(isolateYellow);
        game.advanceCombatTo("defend");
        Briar.defendWith(bloodiedOval);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Briar).toHaveLife(life - (life < 20 ? 1 : 2));
        expectFabCard(Briar, bloodiedOval).toBeIn("graveyard");
        expect(Briar.zone("arsenal")).toEqual([sigilOfSufferingRed.canonicalId]);
        Attacker.must.endTurn();
        Briar.must.endTurn();
        expectFabPlayer(Briar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
  });

  describe("Vynnset", () => {
    it("VY-01 [AAA] Malefic then Deathly Wail creates Runechants on the close", () => {
      const game = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [
            deathlyWailRed,
            maleficIncantationRed,
            deepRecessesOfExistenceBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [runebloodIncantationRed],
          resourcePoints: 3,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Vynnset = game.as(vynnset);
      const Defender = game.as(dash);

      Vynnset.must.play(maleficIncantationRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Vynnset, maleficIncantationRed).toBeIn("arena");
      expectFabPlayer(Vynnset).toHaveAP(1);

      Vynnset.must.playAttack(deathlyWailRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(6);
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(14);
      expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 2);
      expectFabCard(Vynnset, deathlyWailRed).toBeIn("graveyard");
      expect(Vynnset.zone("arsenal")).toHaveLength(1);
      Vynnset.must.endTurn();
      expectFabPlayer(Vynnset).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("VY-H1 [AAA] start-phase banish creates a Runechant and a paid Shadow NAA spends life", () => {
      const game = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [
            funeralMoonRed,
            deathlyWailRed,
            deepRecessesOfExistenceBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [runebloodIncantationRed],
          resourcePoints: 3,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Vynnset = game.as(vynnset);
      Vynnset.endTurn();
      game.as(dash).endTurn();
      game.advanceToDecision(Vynnset, "entity-target");
      Vynnset.target(deepRecessesOfExistenceBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Vynnset, deepRecessesOfExistenceBlue).toBeBanished();
      expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);

      const life = Vynnset.life();
      Vynnset.play(funeralMoonRed);
      game.helpers.resolveUntilIdle({ optionalBoolean: true });
      expect(Vynnset.life()).toBe(life - 1);
      expect(Vynnset.zone("arsenal")).toEqual([runebloodIncantationRed.canonicalId]);
    });

    it("VY-H2 [AAA] declining the life payment keeps life, and an empty hand creates no Runechant", () => {
      const decline = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [
            funeralMoonRed,
            deathlyWailRed,
            deepRecessesOfExistenceBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [runebloodIncantationRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Vynnset = decline.as(vynnset);
      const life = Vynnset.life();
      Vynnset.play(funeralMoonRed);
      decline.helpers.resolveUntilIdle({ optionalBoolean: false });
      expect(Vynnset.life()).toBe(life);

      const empty = FabTestEngine.start(
        { hero: dash, hand: [], deck: 8 },
        {
          hero: vynnset,
          hand: [],
          arsenal: [runebloodIncantationRed],
          // Keep the start-turn hand genuinely empty after the legal turn-1
          // draw-to-intellect step; this scenario is about the empty boundary.
          deck: 0,
        },
        FAB_MANUAL_HARNESS,
      );
      empty.as(dash).endTurn();
      empty.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(empty.as(vynnset)).toHaveTokenCount("runechant", 0);
    });

    it("VY-02 [AAA] each Runechant packet is preventable on Deathly Wail", () => {
      const game = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [beseechTheDemigonRed, reduceToRunechantRed, oblivionBlue, deathlyWailBlue],
          arsenal: [sonataGalaxiaRed],
          arena: [fabToken("runechant"), fabToken("runechant"), fabToken("runechant")],
          resourcePoints: 3,
          deck: 8,
        },
        {
          hero: dash,
          weapon2: [arcaneLantern],
          hand: [],
          resourcePoints: 1,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Vynnset = game.as(vynnset);
      const Defender = game.as(dash);

      Vynnset.must.playAttack(deathlyWailBlue);
      game.passBoth();
      const first = Defender.expectDecision("option");
      const firstBarrier = first.options.find((option) => option.id.endsWith(":arcane-barrier"));
      expect(firstBarrier).toBeDefined();
      Defender.chooseOptions(firstBarrier!.id);
      for (let packets = 0; packets < 4; packets += 1) {
        if (game.combat()?.step === "defend") break;
        const decision = game.getState().decision;
        if (decision?.kind === "option" && decision.actorId === Defender.id) {
          Defender.chooseOptions();
          continue;
        }
        game.passBoth();
      }
      toDefend(game);
      expectCombat(game).toHaveAttackPower(4);
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(14);
      expectFabPlayer(Defender).toHaveResourceCount(0);
      expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);
      expectFabCard(Vynnset, deathlyWailBlue).toBeIn("graveyard");
      expectFabCard(Vynnset, oblivionBlue).toBeIn("hand");
      expect(Vynnset.zone("arsenal")).toEqual([sonataGalaxiaRed.canonicalId]);
      expect(game.renderedPlayerNarrative(Vynnset.id)).toEqual([
        "You played Deathly Wail.",
        "Runechant was destroyed.",
        "Opponent prevented 1 damage with Arcane Lantern.",
        "Runechant was destroyed.",
        "Opponent took 1 arcane damage from Runechant.",
        "Runechant was destroyed.",
        "Opponent took 1 arcane damage from Runechant.",
        "You attacked Opponent with Deathly Wail.",
        "Deathly Wail hit Opponent for 4.",
        "You created Runechant.",
        "Deathly Wail created Runechant for You.",
      ]);
      expect(game.renderedPlayerNarrative(Defender.id)).toEqual([
        "Opponent played Deathly Wail.",
        "Runechant was destroyed.",
        "You prevented 1 damage with Arcane Lantern.",
        "Runechant was destroyed.",
        "You took 1 arcane damage from Runechant.",
        "Runechant was destroyed.",
        "You took 1 arcane damage from Runechant.",
        "Opponent attacked You with Deathly Wail.",
        "Deathly Wail hit You for 4.",
        "Opponent created Runechant.",
        "Deathly Wail created Runechant for Opponent.",
      ]);
      Vynnset.must.endTurn();
      expectFabPlayer(Vynnset).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("VY-03 [AAA] Blood Debt ticks only on leftover banished cards", () => {
      const pay = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [shadowPuppetryRed, cullRed, fastingCarcassBlue, deepRecessesOfExistenceBlue],
          arsenal: [envelopInDarknessRed],
          resourcePoints: 1,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Paid = pay.as(vynnset);
      const life = Paid.life();
      Paid.must.play(shadowPuppetryRed);
      pay.helpers.resolveUntilIdle({ optionalBoolean: true, ordering: "listed" });
      expect(Paid.life()).toBe(life - 1);
      Paid.must.play(fastingCarcassBlue);
      if (pay.getState().decision?.kind === "boolean") Paid.decline();
      pay.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
      Paid.must.playFromArsenal(envelopInDarknessRed);
      pay.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
      expectFabPlayer(Paid).toHaveTokenCount("runechant", 1);
      Paid.must.play(cullRed);
      if (pay.getState().decision?.kind === "boolean") Paid.decline();
      if (pay.getState().decision?.kind === "entity-target") {
        Paid.target(deepRecessesOfExistenceBlue);
      }
      if (pay.getState().decision?.kind === "entity-target") {
        pay.as(dash).target(pay.as(dash).cardsIn("hand", snatchRed)[0]!);
      }
      pay.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Paid, deepRecessesOfExistenceBlue).toBeBanished();
      Paid.must.endTurn();
      expectFabPlayer(Paid).toHaveLife(life - 2);
      expectFabCard(Paid, deepRecessesOfExistenceBlue).toBeBanished();

      const decline = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [shadowPuppetryRed, cullRed, fastingCarcassBlue, deepRecessesOfExistenceBlue],
          arsenal: [envelopInDarknessRed],
          resourcePoints: 1,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Declined = decline.as(vynnset);
      const declinedLife = Declined.life();
      Declined.must.play(shadowPuppetryRed);
      decline.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
      expect(Declined.life()).toBe(declinedLife);
      Declined.must.play(fastingCarcassBlue);
      if (decline.getState().decision?.kind === "boolean") Declined.decline();
      decline.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
      Declined.must.playFromArsenal(envelopInDarknessRed);
      decline.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
      Declined.must.play(cullRed);
      if (decline.getState().decision?.kind === "boolean") Declined.decline();
      if (decline.getState().decision?.kind === "entity-target") {
        Declined.target(deepRecessesOfExistenceBlue);
      }
      if (decline.getState().decision?.kind === "entity-target") {
        decline.as(dash).target(decline.as(dash).cardsIn("hand", snatchRed)[0]!);
      }
      decline.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      Declined.must.endTurn();
      expectFabPlayer(Declined).toHaveLife(declinedLife - 1);
    });
    it("VY-04 [AAA] Mordred and Mauvrion create the exact Runechants after an arsenal hit", () => {
      const game = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [
            mordredTideRed,
            mauvrionSkiesRed,
            machinationsOfDominionBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [deathlyDelightRed],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, life: 20, deck: 8 },
        manual,
      );
      const Vynnset = game.as(vynnset);
      const Defender = game.as(dash);

      Vynnset.must.play(mordredTideRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Vynnset.must.play(mauvrionSkiesRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Vynnset.must.playFromArsenal(deathlyDelightRed);
      game.advanceCombatTo("defend");
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(15);
      expect(Vynnset.zone("arena").filter((card) => card === "token:runechant")).toHaveLength(4);
      expectFabCard(Vynnset, deathlyDelightRed).toBeIn("graveyard");
      expect(Vynnset.zone("hand")).toEqual([
        machinationsOfDominionBlue.canonicalId,
        widespreadAnnihilationBlue.canonicalId,
      ]);
      Vynnset.must.endTurn();
      expectFabPlayer(Vynnset).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("VY-05 [AAA] Tear grants a banished red; Invert no-ops with an empty graveyard", () => {
      const valid = FabTestEngine.start(
        { hero: dash, graveyard: [snatchRed, volticBoltRed], hand: [], deck: 8 },
        {
          hero: vynnset,
          hand: [funeralMoonRed, putridStirringsRed, invertExistenceBlue, oblivionBlue],
          arsenal: [tearThroughThePortalRed],
          resourcePoints: 4,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Vynnset = valid.as(vynnset);
      const Defender = valid.as(dash);

      Defender.endTurn();
      valid.advanceToDecision(Vynnset, "entity-target");
      Vynnset.target(funeralMoonRed);
      valid.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Vynnset, funeralMoonRed).toBeBanished();
      expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 1);

      Vynnset.must.playFromArsenal(tearThroughThePortalRed);
      valid.helpers.resolveUntilIdle({
        entityTargetCanonicalId: funeralMoonRed.canonicalId,
        optionalBoolean: false,
        ordering: "listed",
      });
      Vynnset.play(funeralMoonRed, { from: "banished" });
      valid.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
      expectFabPlayer(Vynnset).toHaveTokenCount("runechant", 2);
      expectFabCard(Vynnset, funeralMoonRed).toBeIn("graveyard");
      expectFabPlayer(Vynnset).toHaveAP(1);

      Vynnset.must.pitch(oblivionBlue).playInstant(invertExistenceBlue);
      valid.helpers.resolveUntilIdle({
        optionalBoolean: false,
        entityTargets: "maximum",
        ordering: "listed",
      });
      expectFabCard(Defender, snatchRed).toBeBanished();
      expectFabCard(Defender, volticBoltRed).toBeBanished();
      expectFabPlayer(Defender).toHaveLife(18);
      expectFabCard(Vynnset, oblivionBlue).toBeIn("pitch");
      Vynnset.must.endTurn();
      expectFabPlayer(Vynnset).toHaveHandCount(4).toHaveAP(0);

      const empty = FabTestEngine.start(
        {
          hero: vynnset,
          hand: [funeralMoonRed, putridStirringsRed, invertExistenceBlue, oblivionBlue],
          arsenal: [tearThroughThePortalRed],
          resourcePoints: 1,
          deck: 8,
        },
        { hero: dash, graveyard: [], hand: [], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Partial = empty.as(vynnset);
      expect(
        Partial.expectFailure({
          move: "begin-play",
          payload: { instanceId: Partial.findCardInZone("arsenal", tearThroughThePortalRed) },
        }).errorCode,
      ).toBeDefined();
      Partial.must.pitch(oblivionBlue).playInstant(invertExistenceBlue);
      empty.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabCard(Partial, invertExistenceBlue).toBeIn("graveyard");
      expectFabPlayer(empty.as(dash)).toHaveLife(20);
      expect(
        Partial.hasPriority() || empty.getState().priority?.holderPlayerId === Partial.id,
      ).toBe(true);
    });
    it("VY-06 [AAA] Succumb then Eulogy hit, then end-turn cleanup", () => {
      const game = FabTestEngine.start(
        {
          hero: vynnset,
          weapon1: [flailOfAgony],
          hand: [
            eloquentEulogyRed,
            succumbToTemptationYellow,
            deepRecessesOfExistenceBlue,
            deathlyWailBlue,
          ],
          arsenal: [widespreadRuinRed],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, hitAndRunBlue, snatchRed, snatchRed], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Vynnset = game.as(vynnset);
      const Defender = game.as(dash);

      Vynnset.must.play(succumbToTemptationYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Vynnset.must.playAttack(eloquentEulogyRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(4);
      Defender.must.defend();
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: hitAndRunBlue.canonicalId,
      });
      expectFabCard(Defender, hitAndRunBlue).toBeIn("graveyard");
      expectFabPlayer(Defender).toHaveLife(16);
      expectFabPlayer(Vynnset).toHaveTokenCount("eloquence", 1);
      expectFabCard(Vynnset, flailOfAgony).toBeIn("weapon1");
      expect(Vynnset.zone("arsenal")).toEqual([widespreadRuinRed.canonicalId]);
      Vynnset.must.endTurn();
      expectFabPlayer(Vynnset).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("VY-E1 [AAA] Flail hit creates one Runechant; a block and second swing do not", () => {
      const hit = FabTestEngine.start(
        {
          hero: vynnset,
          weapon1: [flailOfAgony],
          hand: [
            deathlyWailRed,
            eloquentEulogyRed,
            widespreadAnnihilationBlue,
            deepRecessesOfExistenceBlue,
          ],
          arsenal: [shadowPuppetryRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Hitter = hit.as(vynnset);
      const before = Hitter.life();
      Hitter.must.activate(flailOfAgony);
      toDefend(hit);
      expect(Hitter.life()).toBe(before - 1);
      expectCombat(hit).toHaveAttackPower(1);
      missBlockAndClose(hit);
      expectFabPlayer(hit.as(dash)).toHaveLife(19);
      expectFabPlayer(Hitter).toHaveTokenCount("runechant", 1);
      Hitter.expectActivationRejected(flailOfAgony);
      expect(Hitter.zone("arsenal")).toEqual([shadowPuppetryRed.canonicalId]);

      const blocked = FabTestEngine.start(
        {
          hero: vynnset,
          weapon1: [flailOfAgony],
          hand: [
            deathlyWailRed,
            eloquentEulogyRed,
            widespreadAnnihilationBlue,
            deepRecessesOfExistenceBlue,
          ],
          arsenal: [shadowPuppetryRed],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Blocked = blocked.as(vynnset);
      const blockedLife = Blocked.life();
      Blocked.must.activate(flailOfAgony);
      blocked.advanceCombatTo("defend");
      blocked.as(dash).defendWith(snatchRed);
      blocked.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Blocked.life()).toBe(blockedLife - 1);
      expectFabPlayer(Blocked).toHaveTokenCount("runechant", 0);
      expectFabPlayer(blocked.as(dash)).toHaveLife(20);
    });
    it("VY-E2 [AAA] Quillhand makes two Runechants; Grasp costs 2 plus current tokens", () => {
      const quill = FabTestEngine.start(
        {
          hero: vynnset,
          arms: [vexingQuillhand],
          hand: [
            deadwoodDirgeRed,
            maleficIncantationRed,
            deathlyWailBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [reduceToRunechantRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Quill = quill.as(vynnset);
      Quill.must.activate(vexingQuillhand);
      quill.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Quill).toHaveTokenCount("runechant", 2).toHaveAP(1);
      expect(Quill.zone("arms")).toEqual([]);
      expect(Quill.zone("arsenal")).toEqual([reduceToRunechantRed.canonicalId]);

      for (const tokens of [0, 1, 2] as const) {
        const game = FabTestEngine.start(
          {
            hero: vynnset,
            arms: [graspOfTheArknight],
            hand: [
              deadwoodDirgeRed,
              maleficIncantationRed,
              deathlyWailBlue,
              widespreadAnnihilationBlue,
            ],
            arsenal: [reduceToRunechantRed],
            arena: Array.from({ length: tokens }, () => fabToken("runechant")),
            resourcePoints: 2 + tokens,
            deck: 8,
          },
          emptyDash,
          FAB_MANUAL_HARNESS,
        );
        const Grasp = game.as(vynnset);
        Grasp.must.activate(graspOfTheArknight);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Grasp)
          .toHaveTokenCount("runechant", tokens + 1)
          .toHaveResourceCount(0)
          .toHaveAP(1);
      }
    });
    it("VY-E3 [AAA] Creepers binds only after an AAC and is once per turn", () => {
      const preserved = FabTestEngine.start(
        {
          hero: vynnset,
          legs: [spellboundCreepers],
          hand: [
            shadowPuppetryRed,
            maleficIncantationRed,
            deathlyWailBlue,
            deepRecessesOfExistenceBlue,
          ],
          arsenal: [succumbToTemptationYellow],
          arena: [fabToken("runechant")],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Live = preserved.as(vynnset);
      Live.must.playAttack(deathlyWailBlue);
      preserved.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargets: "minimum",
        optionalBoolean: false,
      });
      Live.must.activate(spellboundCreepers);
      preserved.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });
      expectFabCard(Live, spellboundCreepers).toHaveCounters(1, "bind");
      Live.expectActivationRejected(spellboundCreepers);
      Live.must.endTurn();
      expectFabCard(Live, spellboundCreepers).toBeIn("legs");

      const gated = FabTestEngine.start(
        {
          hero: vynnset,
          legs: [spellboundCreepers],
          hand: [
            shadowPuppetryRed,
            maleficIncantationRed,
            deathlyWailBlue,
            deepRecessesOfExistenceBlue,
          ],
          arsenal: [succumbToTemptationYellow],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      gated.as(vynnset).expectActivationRejected(spellboundCreepers);
      expectFabCard(gated.as(vynnset), spellboundCreepers).toBeIn("legs");
    });
    it("VY-D1 [AAA] Face Purgatory requires both action-card defense types", () => {
      for (const omitted of ["none", "attack", "non-attack"] as const) {
        const game = FabTestEngine.start(
          {
            hero: vynnset,
            head: [facePurgatory],
            hand: [
              deathlyWailRed,
              maleficIncantationRed,
              deepRecessesOfExistenceBlue,
              widespreadAnnihilationBlue,
            ],
            arsenal: [reduceToRunechantRed],
            deck: 8,
          },
          { hero: dash, hand: [snatchRed, hitAndRunBlue, snatchRed, snatchRed], deck: 8 },
          manual,
        );
        const Vynnset = game.as(vynnset);
        const Attacker = game.as(dash);
        Vynnset.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        const defenders = [facePurgatory];
        if (omitted !== "attack") defenders.push(deathlyWailRed);
        if (omitted !== "non-attack") defenders.push(maleficIncantationRed);
        Vynnset.defendWith(defenders);
        game.helpers.resolveUntilIdle({
          ordering: "listed",
          entityTargetCanonicalId: hitAndRunBlue.canonicalId,
        });

        expectFabCard(Vynnset, facePurgatory).toBeIn("graveyard");
        expectFabPlayer(Vynnset).toHaveLife(20).toHaveHandCount(3);
        expectFabPlayer(Attacker).toHaveHandCount(omitted === "none" ? 2 : 3);
        if (omitted === "none") expectFabCard(Attacker, hitAndRunBlue).toBeIn("graveyard");
        else expectFabCard(Attacker, hitAndRunBlue).toBeIn("hand");
        expect(Vynnset.zone("arsenal")).toEqual([reduceToRunechantRed.canonicalId]);
        game.helpers.resolveRestOfCombat();
        Attacker.must.endTurn();
        game.helpers.resolveUntilIdle({
          ordering: "listed",
          entityTargetCanonicalId: deepRecessesOfExistenceBlue.canonicalId,
        });
        expectFabCard(Vynnset, deepRecessesOfExistenceBlue).toBeIn("banished");
        expect(Vynnset.zone("arena").filter((card) => card === "token:runechant")).toHaveLength(1);
        Vynnset.must.endTurn();
        expectFabPlayer(Vynnset).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it(
      "VY-D2 [AAA] Reduce defends for 4 and never charges a negative cost",
      { timeout: 15_000 },
      () => {
        for (const runechants of [0, 1, 2] as const) {
          const game = FabTestEngine.start(
            { hero: dash, hand: [snatchRed, hitAndRunBlue, snatchRed, snatchRed], deck: 8 },
            {
              hero: vynnset,
              hand: [
                deathlyWailRed,
                maleficIncantationRed,
                deepRecessesOfExistenceBlue,
                widespreadAnnihilationBlue,
              ],
              arsenal: [reduceToRunechantRed],
              arena: Array.from({ length: runechants }, () => fabToken("runechant")),
              resourcePoints: runechants === 0 ? 1 : 0,
              deck: 8,
            },
            manual,
          );
          const Vynnset = game.as(vynnset);
          const Attacker = game.as(dash);
          Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
          game.advanceCombatTo("defend");
          Vynnset.must.defend();
          game.advanceCombatTo("reaction");
          game.helpers.passPriorityTo(Vynnset);
          Vynnset.must.playFromArsenal(reduceToRunechantRed);
          game.helpers.resolveUntilIdle({ ordering: "listed" });

          expectFabCard(Vynnset, reduceToRunechantRed).toBeIn("graveyard");
          expectFabPlayer(Vynnset).toHaveLife(20).toHaveResourceCount(0);
          expect(Vynnset.zone("arena").filter((card) => card === "token:runechant")).toHaveLength(
            runechants + 1,
          );
          expect(Vynnset.zone("arsenal")).toEqual([]);
          Attacker.must.endTurn();
          game.helpers.resolveUntilIdle({
            ordering: "listed",
            entityTargetCanonicalId: deepRecessesOfExistenceBlue.canonicalId,
          });
          expectFabCard(Vynnset, deepRecessesOfExistenceBlue).toBeIn("banished");
          Vynnset.must.endTurn();
          expectFabPlayer(Vynnset).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
        }
      },
    );
    it("VY-D3 [AAA] Dyadic, Grimoire, and Ebon Fold each answer a separate packet", () => {
      const dyadic = FabTestEngine.start(
        {
          hero: dash,
          hand: [volticBoltRed, whisperOfTheOracleBlue, snatchRed, snatchRed],
          resourcePoints: 2,
          deck: 8,
        },
        {
          hero: vynnset,
          chest: [dyadicCarapace],
          hand: [
            deathlyWailRed,
            maleficIncantationRed,
            deepRecessesOfExistenceBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [reduceToRunechantRed],
          resourcePoints: 2,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Shell = dyadic.as(vynnset);
      const Caster = dyadic.as(dash);
      Caster.play(volticBoltRed, { target: Shell.id, pitch: [whisperOfTheOracleBlue] });
      dyadic.passBoth();
      const dyadicChoice = Shell.expectDecision("option");
      const dyadicBarrier = dyadicChoice.options.find((option) =>
        option.id.includes("arcane-barrier"),
      );
      expect(dyadicBarrier).toBeDefined();
      Shell.chooseOptions(dyadicBarrier!.id);
      dyadic.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Shell).toHaveLife(17).toHaveResourceCount(0);
      expectFabCard(Shell, dyadicCarapace).toBeIn("chest");
      expect(Shell.zone("arsenal")).toEqual([reduceToRunechantRed.canonicalId]);

      const grim = FabTestEngine.start(
        {
          hero: vynnset,
          weapon2: [grimoireOfTheHaunt],
          hand: [
            deathlyWailRed,
            maleficIncantationRed,
            deepRecessesOfExistenceBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [reduceToRunechantRed],
          resourcePoints: 1,
          deck: 8,
        },
        { hero: dash, hand: [], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Scholar = grim.as(vynnset);
      Scholar.must.activate(grimoireOfTheHaunt);
      grim.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Scholar, grimoireOfTheHaunt).toBeBanished();
      expectFabPlayer(Scholar).toHaveTokenCount("eloquence", 1);
      Scholar.must.endTurn();
      expectFabPlayer(Scholar).toHaveLife(19);

      const fold = FabTestEngine.start(
        {
          hero: dash,
          hand: [volticBoltRed, whisperOfTheOracleBlue, snatchRed, snatchRed],
          resourcePoints: 2,
          deck: 8,
        },
        {
          hero: vynnset,
          head: [ebonFold],
          hand: [
            deathlyWailRed,
            maleficIncantationRed,
            deepRecessesOfExistenceBlue,
            widespreadAnnihilationBlue,
          ],
          arsenal: [reduceToRunechantRed],
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Hood = fold.as(vynnset);
      fold.as(dash).play(volticBoltRed, {
        target: Hood.id,
        pitch: [whisperOfTheOracleBlue],
      });
      fold.passBoth();
      const foldChoice = Hood.expectDecision("option");
      const spellvoid = foldChoice.options.find((option) => option.id.includes("spellvoid"));
      expect(spellvoid).toBeDefined();
      Hood.chooseOptions(spellvoid!.id);
      fold.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Hood).toHaveLife(17);
      expectFabCard(Hood, ebonFold).toBeIn("graveyard");
    });
  });

  describe("Viserai, Between Worlds", () => {
    it("VB-H1 [AAA] three IAR Runechant creates banish three known tops at the 3-count threshold", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiBetweenWorlds,
          hand: [runicReavingRed, runicReavingYellow, runicDispositionRed],
          deck: 8,
          deckTop: [volticBoltRed, whisperOfTheOracleBlue, snatchRed],
          actionPoints: 1,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiBetweenWorlds);

      Viserai.activate(runicReavingRed);
      game.untilIdle();
      expectFabToken(game, "runechant").toHaveCount(1);
      expectFabCard(Viserai, snatchRed).toBeBanished();

      Viserai.activate(runicReavingYellow);
      game.untilIdle();
      expectFabToken(game, "runechant").toHaveCount(2);
      expectFabCard(Viserai, whisperOfTheOracleBlue).toBeBanished();

      Viserai.activate(runicDispositionRed);
      game.untilIdle();
      expectFabToken(game, "runechant").toHaveCount(3);
      expectFabCard(Viserai, volticBoltRed).toBeBanished();
      expectFabCard(Viserai, runicReavingRed).toBeIn("graveyard");
      expectFabCard(Viserai, runicReavingYellow).toBeIn("graveyard");
      expectFabCard(Viserai, runicDispositionRed).toBeIn("graveyard");
      expectFabPlayer(Viserai).toHaveAP(1).toHaveLife(20);
      Viserai.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
    });

    it("VB-H2 [AAA] two IAR Runechant creates banish twice and do not traverse", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiBetweenWorlds,
          hand: [runicReavingRed, runicReavingYellow],
          deck: 8,
          deckTop: [volticBoltRed, whisperOfTheOracleBlue, snatchRed],
          actionPoints: 1,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiBetweenWorlds);

      Viserai.activate(runicReavingRed);
      game.untilIdle();
      Viserai.activate(runicReavingYellow);
      game.untilIdle();

      expectFabToken(game, "runechant").toHaveCount(2);
      expectFabCard(Viserai, snatchRed).toBeBanished();
      expectFabCard(Viserai, whisperOfTheOracleBlue).toBeBanished();
      expect(Viserai.zone("deck")).toContain(volticBoltRed.canonicalId);
      expect(Viserai.zone("banished")).not.toContain(volticBoltRed.canonicalId);
      expectFabCard(Viserai, viseraiBetweenWorlds)
        .toHaveName("Viserai Between Worlds")
        .notToHaveSupertype("Demon");
      expectFabPlayer(Viserai).toHaveAP(1);
    });

    it("VB-L1 [AAA] a Runechant create face-up-banishes the known top", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiBetweenWorlds,
          hand: [runicReavingRed],
          deck: 8,
          deckTop: [snatchRed],
          actionPoints: 1,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiBetweenWorlds);

      Viserai.activate(runicReavingRed);
      game.untilIdle();

      expectFabToken(game, "runechant").toHaveCount(1);
      expectFabCard(Viserai, snatchRed).toBeBanished().toBeFaceUp();
      expectFabPlayer(Viserai).toHaveAP(1);
    });

    it("VB-E1 [AAA] an IAR Gloomblade from banished unlocks Seven Sin, and a hero hit creates a Runechant", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiBetweenWorlds,
          weapon1: [sevenSinNebula],
          hand: [],
          banished: [vexingGloombladeRed],
          resourcePoints: 4,
          actionPoints: 2,
          deck: 8,
          deckTop: [snatchRed],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiBetweenWorlds);
      const Defender = game.as(dash);

      Viserai.playAttack(vexingGloombladeRed, { from: "banished" });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(5);
      Defender.must.defend();
      game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
      Viserai.targetRequired(Defender);
      game.closeCombat();
      expectFabPlayer(Defender).toHaveLife(13);
      expectFabCard(Viserai, vexingGloombladeRed).toBeIn("graveyard");

      Viserai.activateAttack(sevenSinNebula);
      expectCombat(game).toBeOpen().toHaveAttackPower(3);
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(10);
      expectFabToken(game, "runechant").toHaveCount(1);
      expectFabCard(Viserai, snatchRed).toBeBanished();
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
      Viserai.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
    });

    it("VB-E2 [AAA] Seven Sin is illegal cold and the from-banished gate expires at end of turn", () => {
      const cold = FabTestEngine.start(
        {
          hero: viseraiBetweenWorlds,
          weapon1: [sevenSinNebula],
          hand: [],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Cold = cold.as(viseraiBetweenWorlds);
      Cold.expectActivationRejected(sevenSinNebula);
      expectFabCard(Cold, sevenSinNebula).toBeIn("weapon1");
      expectFabToken(cold, "runechant").toHaveCount(0);

      const gated = FabTestEngine.start(
        {
          hero: viseraiBetweenWorlds,
          weapon1: [sevenSinNebula],
          hand: [],
          arena: [fabToken("vigor")],
          banished: [vexingGloombladeRed],
          resourcePoints: 3,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = gated.as(viseraiBetweenWorlds);
      const Defender = gated.as(dash);

      Viserai.playAttack(vexingGloombladeRed, { from: "banished" });
      Defender.must.defend();
      gated.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
      Viserai.targetRequired(Defender);
      gated.closeCombat();
      expectFabCard(Viserai, vexingGloombladeRed).toBeIn("graveyard");

      Viserai.must.endTurn();
      gated.helpers.resolveUntilIdle({ ordering: "listed" });
      Defender.must.endTurn();
      gated.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Viserai).toHaveResourceCount(1).toHaveAP(1);
      expectFabCard(Viserai, sevenSinNebula).toBeIn("weapon1").toBeReady();
      Viserai.expectActivationRejected(sevenSinNebula);
      expectFabCard(Viserai, sevenSinNebula).toBeIn("weapon1").toBeReady();
      expectFabPlayer(Viserai).toHaveResourceCount(1).toHaveAP(1);
    });

    it("VB-01 [AAA] hero banish feeds an IAR Gloomblade that unlocks Seven Sin and the hit retriggers", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiBetweenWorlds,
          weapon1: [sevenSinNebula],
          hand: [runicReavingRed],
          resourcePoints: 4,
          actionPoints: 2,
          deck: 8,
          deckTop: [snatchRed, vexingGloombladeRed],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiBetweenWorlds);
      const Defender = game.as(dash);

      Viserai.activate(runicReavingRed);
      game.untilIdle();
      expectFabToken(game, "runechant").toHaveCount(1);
      expectFabCard(Viserai, vexingGloombladeRed).toBeBanished();
      expectFabCard(Viserai, runicReavingRed).toBeIn("graveyard");

      Viserai.playAttack(vexingGloombladeRed, { from: "banished" });
      toDefend(game);
      // Usurp spends the Runechant created by Reaving for the printed +2{p}.
      expectCombat(game).toHaveAttackPower(7);
      expectFabToken(game, "runechant").toHaveCount(0);
      Defender.must.defend();
      game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
      Viserai.targetRequired(Defender);
      game.closeCombat();
      expectFabPlayer(Defender).toHaveLife(11);
      expectFabPlayer(Viserai).toHaveAP(1).toHaveResourceCount(1);

      Viserai.activateAttack(sevenSinNebula);
      expectCombat(game).toBeOpen().toHaveAttackPower(3);
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(8);
      expectFabToken(game, "runechant").toHaveCount(1);
      expectFabCard(Viserai, snatchRed).toBeBanished();
      expectFabCard(Viserai, vexingGloombladeRed).toBeIn("graveyard");
      expectCombat(game).toBeClosed();
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
      Viserai.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
      expectFabToken(game, "runechant").toHaveCount(1);
      expectFabCard(Viserai, snatchRed).toBeBanished();
    });
  });

  describe("Viserai, Usurper", () => {
    it("VU-01 [AAA] Open the Gate hits with go again, the Gate plays Unbound from banished, then the turn ends clean", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [openTheGateToIArathaelRed],
          banished: [unboundByShadowRed],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiUsurper);
      const Defender = game.as(dash);

      Viserai.playAttack(openTheGateToIArathaelRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(16);
      expectFabToken(game, "gate-to-i-arathael").toHaveCount(1).toBeIn("arena");
      expectFabPlayer(Viserai).toHaveAP(1).toHaveResourceCount(1);

      Viserai.activate(fabToken("gate-to-i-arathael"));
      Viserai.target(unboundByShadowRed);
      game.helpers.untilIdle({ optionals: "accept", ordering: "listed" });
      expectFabToken(game, "gate-to-i-arathael").toHaveCount(0);

      Viserai.playAttack(unboundByShadowRed, { from: "banished" });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(12);
      expectFabCard(Viserai, unboundByShadowRed).toBeIn("graveyard");
      expectFabCard(Viserai, openTheGateToIArathaelRed).toBeIn("graveyard");
      expectFabToken(game, "gate-to-i-arathael").toHaveCount(1);
      expectCombat(game).toBeClosed();
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
      Viserai.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
      expectFabCard(Viserai, viseraiUsurper).toHaveName("Viserai Usurper");
    });

    it("VU-E1 [AAA] Unbound is unplayable from banished without a Gate grant", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [],
          banished: [unboundByShadowRed],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiUsurper);

      expectFabUnplayable(
        () => Viserai.playAttack(unboundByShadowRed, { from: "banished" }),
        /banished/i,
      );
      expectFabCard(Viserai, unboundByShadowRed).toBeBanished();
      expectFabPlayer(Viserai).toHaveAP(1);
    });

    it("VU-02 [AAA] Embrace Sin plays a Runechant aura from banished, then Demonbound Usurps it", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [embraceSinYellow],
          banished: [runechantOfGreedYellow, demonboundGloombladeRed],
          resourcePoints: 1,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiUsurper);
      const Defender = game.as(dash);

      Viserai.play(embraceSinYellow);
      game.untilIdle();
      expectFabCard(Viserai, embraceSinYellow).toBeIn("graveyard");
      expectFabPlayer(Viserai).toHaveAP(1);

      Viserai.play(runechantOfGreedYellow, { from: "banished" });
      game.untilIdle();
      expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("arena");

      Viserai.playAttack(demonboundGloombladeRed, { from: "banished" });
      toDefend(game);
      // Printed 3{p} + Embrace Sin +2 + Usurp +2.
      expectCombat(game).toHaveAttackPower(7).toHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(13);
      expectFabCard(Viserai, demonboundGloombladeRed).toBeIn("graveyard");
      expectFabCard(Viserai, runechantOfGreedYellow).toBeIn("graveyard");
      expectCombat(game).toBeClosed();
      expectFabPlayer(Viserai).toHaveAP(1).toHaveResourceCount(0);
      Viserai.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
    });

    it("VU-D1 [AAA] leftover Demonbound Blood Debt costs 1{h}; playing it from banished skips the tax", () => {
      const leftover = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [],
          banished: [demonboundGloombladeRed],
          life: 20,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Taxed = leftover.as(viseraiUsurper);
      Taxed.must.endTurn();
      leftover.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Taxed).toHaveLife(19);
      expectFabCard(Taxed, demonboundGloombladeRed).toBeBanished();
      leftover.helpers.expectLog("flesh-and-blood.lose-life", { playerId: Taxed.id, amount: 1 });

      const skipped = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [],
          banished: [demonboundGloombladeRed],
          resourcePoints: 0,
          life: 20,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Paid = skipped.as(viseraiUsurper);
      const Defender = skipped.as(dash);
      Paid.playAttack(demonboundGloombladeRed, { from: "banished" });
      toDefend(skipped);
      expectCombat(skipped).toHaveAttackPower(3);
      missBlockAndClose(skipped);
      expectFabPlayer(Defender).toHaveLife(17);
      expectFabCard(Paid, demonboundGloombladeRed).toBeIn("graveyard");
      expectFabPlayer(Paid).toHaveAP(1).toHaveResourceCount(0);
      Paid.must.endTurn();
      skipped.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Paid).toHaveLife(20).toHaveAP(0).toHaveResourceCount(0);
      skipped.helpers.expectNoPublicLog("flesh-and-blood.lose-life", {
        playerId: Paid.id,
        amount: 1,
      });
    });

    it("VU-H3 [AAA] the second Blood Debt attack this turn does not get go again", () => {
      const game = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [demonboundGloombladeRed],
          banished: [demonboundGloombladeRed],
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = game.as(viseraiUsurper);
      const Defender = game.as(dash);

      Viserai.playAttack(demonboundGloombladeRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(17);
      game.helpers.expectLog("flesh-and-blood.go-again", { cardName: "Demonbound Gloomblade" });
      expectFabPlayer(Viserai).toHaveAP(1);

      Viserai.playAttack(demonboundGloombladeRed, { from: "banished" });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(3).notToHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(14);
      expectCombat(game).toBeClosed();
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
      Viserai.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0).toHaveLife(20);
    });

    it("VU-T1 [AAA] activating a Gate this turn offers traverse; an inert Gate does not", () => {
      const activated = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [],
          arena: [fabToken("gate-to-i-arathael")],
          banished: [unboundByShadowRed],
          resourcePoints: 1,
          actionPoints: 1,
          life: 20,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Viserai = activated.as(viseraiUsurper);
      Viserai.activate(fabToken("gate-to-i-arathael"));
      Viserai.target(unboundByShadowRed);
      activated.helpers.untilIdle({ optionals: "accept" });
      expectFabToken(activated, "gate-to-i-arathael").toHaveCount(0);
      expectFabCard(Viserai, unboundByShadowRed).toBeBanished();

      Viserai.endTurn();
      activated.passBoth();
      expectWait(activated).toHaveDecision("boolean");
      Viserai.decline();
      activated.helpers.resolveUntilIdle();
      expectFabPlayer(Viserai).toHaveAP(0).toHaveResourceCount(0);
      expectFabCard(Viserai, viseraiUsurper).toHaveName("Viserai Usurper");

      const inert = FabTestEngine.start(
        {
          hero: viseraiUsurper,
          hand: [],
          arena: [fabToken("gate-to-i-arathael")],
          banished: [unboundByShadowRed],
          resourcePoints: 1,
          actionPoints: 1,
          life: 20,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Idle = inert.as(viseraiUsurper);
      expectFabToken(inert, "gate-to-i-arathael").toHaveCount(1);
      Idle.must.endTurn();
      inert.helpers.resolveUntilIdle({ optionalBoolean: false });
      expectWait(inert).notToHaveDecision();
      expectFabToken(inert, "gate-to-i-arathael").toHaveCount(1);
      expectFabCard(Idle, viseraiUsurper).toHaveName("Viserai Usurper");
      inert.helpers.expectNoPublicLog("flesh-and-blood.activate", {
        cardName: "Gate to i'Arathael",
      });
    });
  });
});
