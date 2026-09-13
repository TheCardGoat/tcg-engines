/**
 * Wizard play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { aetherSpindleRed } from "../../../../cards/src/cards/actions/aether-spindle.ts";
import { aetherSpindleBlue } from "../../../../cards/src/cards/actions/aether-spindle.ts";
import { volticBoltBlue } from "../../../../cards/src/cards/actions/voltic-bolt.ts";
import { ravenousRabbleRed } from "../../../../cards/src/cards/actions/ravenous-rabble.ts";
import { whisperOfTheOracleRed } from "../../../../cards/src/cards/actions/whisper-of-the-oracle.ts";
import { whisperOfTheOracleBlue } from "../../../../cards/src/cards/actions/whisper-of-the-oracle.ts";
import { absorbInAetherRed } from "../../../../cards/src/cards/defense-reactions/absorb-in-aether.ts";
import { fateForeseenRed } from "../../../../cards/src/cards/defense-reactions/fate-foreseen.ts";
import { graspOfTheArknight } from "../../../../cards/src/cards/equipment/grasp-of-the-arknight.ts";
import { talismanicLens } from "../../../../cards/src/cards/equipment/talismanic-lens.ts";
import { mageMasterBoots } from "../../../../cards/src/cards/equipment/mage-master-boots.ts";
import { nullruneRobe } from "../../../../cards/src/cards/equipment/nullrune-robe.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { crucibleOfAetherweave } from "../../../../cards/src/cards/weapons/crucible-of-aetherweave.ts";
import { capOfQuickThinking } from "../../../../cards/src/cards/equipment/cap-of-quick-thinking.ts";
import { skyzykRed } from "../../../../cards/src/cards/actions/skyzyk.ts";
import { skywardSerenadeYellow } from "../../../../cards/src/cards/actions/skyward-serenade.ts";
import { flitteringChargeRed } from "../../../../cards/src/cards/actions/flittering-charge.ts";
import { secondStrikeRed } from "../../../../cards/src/cards/actions/second-strike.ts";
import { electrostaticDischargeRed } from "../../../../cards/src/cards/instants/electrostatic-discharge.ts";
import { fryRed } from "../../../../cards/src/cards/actions/fry.ts";
import { aetherIronweave } from "../../../../cards/src/cards/equipment/aether-ironweave.ts";
import { hitAndRunBlue } from "../../../../cards/src/cards/actions/hit-and-run.ts";
import { cinderingForesightRed } from "../../../../cards/src/cards/actions/cindering-foresight.ts";
import { forebodingBoltBlue } from "../../../../cards/src/cards/actions/foreboding-bolt.ts";
import { snapbackRed } from "../../../../cards/src/cards/actions/snapback.ts";
import { brutalAssaultRed } from "../../../../cards/src/cards/actions/brutal-assault.ts";
import { entwineLightningRed } from "../../../../cards/src/cards/actions/entwine-lightning.ts";
import { lightningSurgeRed } from "../../../../cards/src/cards/actions/lightning-surge.ts";
import { shockCharmers } from "../../../../cards/src/cards/equipment/shock-charmers.ts";
import { blinkBlue } from "../../../../cards/src/cards/instants/blink.ts";
import { lightningPressRed } from "../../../../cards/src/cards/instants/lightning-press.ts";
import { battlefrontBastionRed } from "../../../../cards/src/cards/actions/battlefront-bastion.ts";
import { emeritusScoldingRed } from "../../../../cards/src/cards/actions/emeritus-scolding.ts";
import { emeritusScoldingBlue } from "../../../../cards/src/cards/actions/emeritus-scolding.ts";
import { bladeRunnerRed } from "../../../../cards/src/cards/attack-reactions/blade-runner.ts";
import { blazeFiremind } from "../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { scarForAScarRed } from "../../../../cards/src/cards/actions/scar-for-a-scar.ts";
import { stonewallGauntlet } from "../../../../cards/src/cards/equipment/stonewall-gauntlet.ts";
import { tempestuousKissRed } from "../../../../cards/src/cards/actions/tempestuous-kiss.ts";
import { pathOfSameEndsRed } from "../../../../cards/src/cards/actions/path-of-same-ends.ts";
import { voltboundDualityRed } from "../../../../cards/src/cards/actions/voltbound-duality.ts";
import { quickSuccessionRed } from "../../../../cards/src/cards/actions/quick-succession.ts";
import { quickSuccessionYellow } from "../../../../cards/src/cards/actions/quick-succession.ts";
import { cometCollisionRed } from "../../../../cards/src/cards/actions/comet-collision.ts";
import { timesnapPotionBlue } from "../../../../cards/src/cards/actions/timesnap-potion.ts";
import { meteoricImpactRed } from "../../../../cards/src/cards/actions/meteoric-impact.ts";
import { aetherslingRed } from "../../../../cards/src/cards/actions/aethersling.ts";
import { nucleusAetherboltRed } from "../../../../cards/src/cards/actions/nucleus-aetherbolt.ts";
import { turnToMindfireRed } from "../../../../cards/src/cards/actions/turn-to-mindfire.ts";
import { flowstateEmbodimentRed } from "../../../../cards/src/cards/actions/flowstate-embodiment.ts";
import { electrolyzeRed } from "../../../../cards/src/cards/actions/electrolyze.ts";
import { flitteringSpikeRed } from "../../../../cards/src/cards/actions/flittering-spike.ts";
import { auroraLegacyOfTempest } from "../../../../cards/src/cards/heroes/aurora-legacy-of-tempest.ts";
import { echoflashYellow } from "../../../../cards/src/cards/instants/echoflash.ts";
import { coreReactionRed } from "../../../../cards/src/cards/instants/core-reaction.ts";
import { flashBoltRed } from "../../../../cards/src/cards/instants/flash-bolt.ts";
import { constellaContemplationYellow } from "../../../../cards/src/cards/instants/constella-contemplation.ts";
import { constellaUpliftYellow } from "../../../../cards/src/cards/instants/constella-uplift.ts";
import { cosmicFlareRed } from "../../../../cards/src/cards/instants/cosmic-flare.ts";
import { stormshardRed } from "../../../../cards/src/cards/instants/stormshard.ts";
import { chromaticRefinementRed } from "../../../../cards/src/cards/instants/chromatic-refinement.ts";
import { scorpioCometTail } from "../../../../cards/src/cards/weapons/scorpio-comet-tail.ts";
import { oscilio } from "../../../../cards/src/cards/heroes/oscilio.ts";
import { twinkleToes } from "../../../../cards/src/cards/equipment/twinkle-toes.ts";
import { volzarTheLightningRod } from "../../../../cards/src/cards/weapons/volzar-the-lightning-rod.ts";
import { isolateYellow } from "../../../../cards/src/cards/actions/isolate.ts";
import { seekerSMitts } from "../../../../cards/src/cards/equipment/seeker-s-mitts.ts";
import { painfulPremonitionBlue } from "../../../../cards/src/cards/actions/painful-premonition.ts";
import { strikeTwiceRed } from "../../../../cards/src/cards/actions/strike-twice.ts";
import { volticVanguard } from "../../../../cards/src/cards/equipment/voltic-vanguard.ts";
import { unflinchingFoothold } from "../../../../cards/src/cards/equipment/unflinching-foothold.ts";
import { cloudCoverRed } from "../../../../cards/src/cards/instants/cloud-cover.ts";
import { snapdragonScalers } from "../../../../cards/src/cards/equipment/snapdragon-scalers.ts";
import { quicken } from "../../../../cards/src/cards/tokens/quicken.ts";
import { arcLightningYellow } from "../../../../cards/src/cards/actions/arc-lightning.ts";
import { currentFunnelBlue } from "../../../../cards/src/cards/actions/current-funnel.ts";
import { arcaneTwiningBlue } from "../../../../cards/src/cards/actions/arcane-twining.ts";
import { photonSplicingBlue } from "../../../../cards/src/cards/actions/photon-splicing.ts";
import { lightningGreaves } from "../../../../cards/src/cards/equipment/lightning-greaves.ts";
import { facePurgatory } from "../../../../cards/src/cards/equipment/face-purgatory.ts";
import { arcanePolarityRed } from "../../../../cards/src/cards/instants/arcane-polarity.ts";
import { jackBeNimbleRed } from "../../../../cards/src/cards/actions/jack-be-nimble.ts";
import { nimbyRed } from "../../../../cards/src/cards/actions/nimby.ts";
import { dampenRed } from "../../../../cards/src/cards/actions/dampen.ts";
import { fyendalSFightingSpiritRed } from "../../../../cards/src/cards/actions/fyendal-s-fighting-spirit.ts";
import { spellfireCloak } from "../../../../cards/src/cards/equipment/spellfire-cloak.ts";
import { crownOfProvidence } from "../../../../cards/src/cards/equipment/crown-of-providence.ts";
import { enlightenedStrikeRed } from "../../../../cards/src/cards/actions/enlightened-strike.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { regurgitatingSlogRed } from "../../../../cards/src/cards/actions/regurgitating-slog.ts";
import { nimblismRed } from "../../../../cards/src/cards/actions/nimblism.ts";
import { glintTheQuicksilverBlue } from "../../../../cards/src/cards/attack-reactions/glint-the-quicksilver.ts";
import { sigilOfSolaceRed } from "../../../../cards/src/cards/instants/sigil-of-solace.ts";
import { astralBridgeRed } from "../../../../cards/src/cards/instants/astral-bridge.ts";
import { consignToCosmosShockYellow } from "../../../../cards/src/cards/actions/consign-to-cosmos-shock.ts";

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
import { emptyDash, toDefend, missBlockAndClose, manual } from "./helpers.ts";

function blazeBanishForInstant(
  game: ReturnType<typeof FabTestEngine.start>,
  blaze: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
  card: { readonly instanceId: string },
  energy: number,
): void {
  blaze.must.activate(blazeFiremind);
  game.advanceToDecision(blaze, "numeric");
  game.answerDecision(blaze.id, { kind: "numeric", value: energy });
  const decision = game.getState().decision;
  if (decision?.kind === "entity-target" && decision.actorId === blaze.id) {
    game.answerDecision(blaze.id, {
      kind: "entity-target",
      instanceIds: [card.instanceId],
    });
  }
}

describe("Wizard play lines", () => {
  describe("Oscilio", () => {
    it("OS-01 [AAA] Discharge then Flittering, then a Starfall Comet from arsenal", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [
            electrostaticDischargeRed,
            flitteringChargeRed,
            lightningSurgeRed,
            constellaUpliftYellow,
          ],
          arsenal: [cometCollisionRed],
          arena: [timesnapPotionBlue],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Defender = game.as(dash);

      Oscilio.activate(timesnapPotionBlue);
      game.helpers.resolveUntilIdle();
      Oscilio.must.play(electrostaticDischargeRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Oscilio.must.playAttack(flitteringChargeRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(7);
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(13);
      expectFabPlayer(Oscilio).toHaveAP(1);

      Oscilio.play(cometCollisionRed, {
        from: "arsenal",
        targetInstanceId: game.getState().players[Defender.id]!.heroCardId!,
      });
      game.passBoth();
      game.passBoth();
      expectFabPlayer(Defender).toHaveLife(9);
      expectFabCard(Oscilio, electrostaticDischargeRed).toBeIn("graveyard");
      expectFabCard(Oscilio, cometCollisionRed).toBeIn("graveyard");
      Oscilio.must.endTurn();
      expectFabPlayer(Oscilio).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("OS-H1 [AAA] Oscilio discards Cloud Cover then Comet Starfalls", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          weapon1: [volzarTheLightningRod],
          hand: [cloudCoverRed, cometCollisionRed, lightningPressRed, constellaContemplationYellow],
          arsenal: [flitteringChargeRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Defender = game.as(dash);

      Oscilio.must.activate(oscilio);
      game.advanceToDecision(Oscilio, "entity-target");
      Oscilio.chooseTargets(Oscilio.cardIn("hand", cloudCoverRed));
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Oscilio, cloudCoverRed).toBeIn("graveyard");
      expectFabPlayer(Oscilio).toHaveHandCount(4);

      Oscilio.play(cometCollisionRed, {
        targetInstanceId: game.getState().players[Defender.id]!.heroCardId!,
      });
      game.passBoth();
      game.passBoth();
      expectFabPlayer(Defender).toHaveLife(16);
      expect(() => Oscilio.must.activate(oscilio)).toThrow();
      Oscilio.must.endTurn();
      expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
    });

    it("OS-02 [AAA] Chromatic waits for its phase; Starfall only reads instant GY", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [cloudCoverRed, chromaticRefinementRed, coreReactionRed, flashBoltRed],
          arsenal: [meteoricImpactRed],
          resourcePoints: 5,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Defender = game.as(dash);

      Oscilio.must.play(chromaticRefinementRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Oscilio, chromaticRefinementRed).toBeIn("arena");

      Oscilio.must.play(cloudCoverRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Oscilio.play(flashBoltRed, { target: Defender.id });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(17);

      Oscilio.must.play(coreReactionRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      Oscilio.play(meteoricImpactRed, { from: "arsenal", target: Defender.id });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(8);
      expectFabCard(Oscilio, flashBoltRed).toBeIn("graveyard");
      expectFabCard(Oscilio, meteoricImpactRed).toBeIn("graveyard");
      expectFabCard(Oscilio, chromaticRefinementRed).toBeIn("arena");
      Oscilio.must.endTurn();
      expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
    });

    it("OS-03 [AAA] Aethersling then Electrolyze through Arcane Barrier", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [aetherslingRed, cosmicFlareRed, electrolyzeRed, stormshardRed],
          arsenal: [constellaContemplationYellow],
          resourcePoints: 1,
          deck: 8,
        },
        {
          hero: dash,
          chest: [nullruneRobe],
          resourcePoints: 2,
          hand: [],
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Defender = game.as(dash);

      Oscilio.must.play(cosmicFlareRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Oscilio).toHaveResourceCount(4);

      Oscilio.play(aetherslingRed, { target: Defender.id });
      game.passBoth();
      const barrier = Defender.expectDecision("option");
      Defender.chooseOptions(barrier.options[0]!.id);
      game.helpers.resolveUntilIdle({ optionalBoolean: true });
      expectFabPlayer(Defender).toHaveLife(17);
      expectFabPlayer(Oscilio).toHaveAP(1);

      Oscilio.must.playAttack(electrolyzeRed);
      game.toReaction("attacker");
      Oscilio.play(stormshardRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(10);

      Oscilio.play(constellaContemplationYellow, {
        from: "arsenal",
        target: Defender.id,
      });
      game.passBoth();
      const secondBarrier = Defender.expectDecision("option");
      Defender.chooseOptions(secondBarrier.options[0]!.id);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(10);
      expect(Oscilio.zone("arena")).toContain("token:ponder");
      Oscilio.must.endTurn();
    });

    it("OS-04 [AAA] Press on Snatch, then go-again Second Strike after Strike Twice", () => {
      const press = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [strikeTwiceRed, secondStrikeRed, lightningPressRed, snatchRed],
          arsenal: [flitteringSpikeRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const PressOscilio = press.as(oscilio);
      PressOscilio.must.playAttack(snatchRed);
      press.toReaction("attacker");
      PressOscilio.play(lightningPressRed);
      press.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(press.as(dash)).toHaveLife(13);
      expectFabPlayer(PressOscilio).toHaveAP(0);
      expect(() => PressOscilio.must.playAttack(secondStrikeRed)).toThrow();
      expect(PressOscilio.zone("arsenal")).toEqual([flitteringSpikeRed.canonicalId]);

      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [strikeTwiceRed, secondStrikeRed, lightningPressRed, snatchRed],
          arsenal: [flitteringSpikeRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Defender = game.as(dash);
      Oscilio.play(strikeTwiceRed, { target: Defender.id });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(17);
      expectFabPlayer(Oscilio).toHaveAP(0);
      expect(() => Oscilio.must.playAttack(secondStrikeRed)).toThrow();
      Oscilio.must.endTurn();
      expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
    });
    it("OS-06 [AAA] each Enlightened Strike mode then Lightning payoff", () => {
      for (const mode of [0, 1, 2] as const) {
        const game = FabTestEngine.start(
          {
            hero: oscilio,
            hand: [enlightenedStrikeRed, entwineLightningRed, blinkBlue, echoflashYellow],
            arsenal: [cometCollisionRed],
            deck: 8,
          },
          { hero: dash, hand: [], deck: 8 },
          FAB_MANUAL_HARNESS,
        );
        const Oscilio = game.as(oscilio);
        const Defender = game.as(dash);

        Oscilio.must.play(blinkBlue);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Oscilio).toHaveAP(2);

        Oscilio.play(enlightenedStrikeRed, {
          modeIndexes: [mode],
          target: Defender.id,
        });
        toDefend(game);
        expectCombat(game).toHaveAttackPower(mode === 1 ? 7 : 5);
        if (mode === 2) expectCombat(game).toHaveKeyword("go-again");
        else expectCombat(game).notToHaveKeyword("go-again");
        missBlockAndClose(game);
        expectFabPlayer(Defender).toHaveLife(mode === 1 ? 13 : 15);
        expect(Oscilio.zone("hand").length).toBeGreaterThanOrEqual(1);

        Oscilio.play(cometCollisionRed, {
          from: "arsenal",
          targetInstanceId: game.getState().players[Defender.id]!.heroCardId!,
        });
        game.passBoth();
        game.passBoth();
        expectFabPlayer(Defender).toHaveLife(mode === 1 ? 9 : 11);
        Oscilio.must.endTurn();
        expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("OS-H2 [AAA] discards a split card with an Instant side to draw exactly one", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          hand: [consignToCosmosShockYellow, cometCollisionRed, echoflashYellow, blinkBlue],
          arsenal: [astralBridgeRed],
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);

      // CR 9.2.2: away from the stack, Consign // Shock has the combined
      // properties of both sides, including Shock's Instant type.
      Oscilio.must.activate(oscilio);
      game.advanceToDecision(Oscilio, "entity-target");
      Oscilio.chooseTargets(Oscilio.cardIn("hand", consignToCosmosShockYellow));
      game.untilIdle({ ordering: "listed" });

      expectFabCard(Oscilio, consignToCosmosShockYellow).toBeIn("graveyard");
      expectFabPlayer(Oscilio).toHaveHandCount(4).toHaveAP(1);
      expect(Oscilio.zone("arsenal")).toEqual([astralBridgeRed.canonicalId]);
      Oscilio.expectActivationRejected(oscilio);
    });
    it("OS-E1 [AAA] Volzar amps only the next arcane after an instant hits GY", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          weapon1: [volzarTheLightningRod],
          hand: [
            constellaUpliftYellow,
            cometCollisionRed,
            cloudCoverRed,
            constellaContemplationYellow,
          ],
          arsenal: [flitteringChargeRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Defender = game.as(dash);

      Oscilio.must.activate(volzarTheLightningRod);
      Oscilio.must.play(cloudCoverRed);
      game.passBoth();
      game.passBoth();
      game.helpers.passPriorityTo(Oscilio);

      Oscilio.play(constellaUpliftYellow, { target: Defender.id });
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: volzarTheLightningRod.canonicalId,
      });
      expectFabPlayer(Defender).toHaveLife(18);
      expectFabCard(Oscilio, volzarTheLightningRod).toBeReady();

      Oscilio.play(cometCollisionRed, {
        targetInstanceId: game.getState().players[Defender.id]!.heroCardId!,
      });
      game.passBoth();
      game.passBoth();
      expectFabPlayer(Defender).toHaveLife(14);
      expect(() => Oscilio.must.activate(volzarTheLightningRod)).toThrow();
      Oscilio.must.endTurn();
      expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
    });
    it("OS-E2 [AAA] Twinkle Toes or Vanguard shield only after an instant", () => {
      for (const loadout of ["toes", "vanguard"] as const) {
        const game = FabTestEngine.start(
          {
            hero: oscilio,
            ...(loadout === "toes" ? { legs: [twinkleToes] } : { head: [volticVanguard] }),
            hand: [
              cloudCoverRed,
              lightningPressRed,
              constellaContemplationYellow,
              cometCollisionRed,
            ],
            arsenal: [flitteringChargeRed],
            deck: 8,
          },
          {
            hero: dash,
            hand: [snatchRed, snatchRed, snatchRed, snatchRed],
            deck: 8,
          },
          FAB_MANUAL_HARNESS,
        );
        const Oscilio = game.as(oscilio);
        const Attacker = game.as(dash);
        const gear = loadout === "toes" ? twinkleToes : volticVanguard;
        Oscilio.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("reaction");
        game.helpers.passPriorityTo(Oscilio);
        expect(() => Oscilio.must.activate(gear)).toThrow();
        Oscilio.must.play(cloudCoverRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        game.helpers.passPriorityTo(Oscilio);
        Oscilio.must.activate(gear);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabCard(Oscilio, gear).toBeIn("graveyard");
        game.helpers.resolveRestOfCombat();
        expectFabPlayer(Oscilio).toHaveLife(17);
      }
    });
    it("OS-E3 [AAA] Greaves grant instant go again once; Charmers add one hit", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          legs: [lightningGreaves],
          arms: [shockCharmers],
          hand: [blinkBlue, cloudCoverRed, lightningPressRed, cometCollisionRed],
          arsenal: [flitteringChargeRed],
          resourcePoints: 3,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Defender = game.as(dash);

      Oscilio.must.activate(lightningGreaves);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Oscilio, lightningGreaves).toBeIn("graveyard");

      Oscilio.must.play(blinkBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Oscilio).toHaveAP(3);

      Oscilio.must.activate(shockCharmers);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Oscilio.must.playFromArsenal(flitteringChargeRed);
      game.toReaction("attacker");
      Oscilio.play(lightningPressRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(12);
      expectFabPlayer(Oscilio).toHaveAP(4);
      Oscilio.must.endTurn();
      expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
    });
    it("OS-D1 [AAA] combines Cloud Cover with Bastion only when Bastion defends alone", () => {
      const run = (alone: boolean) => {
        let game = FabTestEngine.start(
          {
            hero: oscilio,
            arms: alone ? undefined : [stonewallGauntlet],
            hand: [
              battlefrontBastionRed,
              lightningPressRed,
              cometCollisionRed,
              constellaContemplationYellow,
            ],
            arsenal: [cloudCoverRed],
            deck: 8,
          },
          {
            hero: dash,
            hand: [brutalAssaultRed, whisperOfTheOracleBlue],
            deck: 8,
          },
          manual,
        );
        let Oscilio = game.as(oscilio);
        const Attacker = game.as(dash);
        Oscilio.must.endTurn();
        Attacker.must.playAttack(brutalAssaultRed, { pitch: [whisperOfTheOracleBlue] });
        game.advanceCombatTo("attack");
        game.helpers.passPriorityTo(Oscilio);
        Oscilio.play(cloudCoverRed, { from: "arsenal" });
        game.passBoth();
        game.advanceCombatTo("defend");
        Oscilio.defendWith(
          alone ? battlefrontBastionRed : [battlefrontBastionRed, stonewallGauntlet],
        );

        const beforeClose = game.getState();
        game = FabTestEngine.fromState(
          restoreFabMatchSnapshot(
            serializeFabMatchSnapshot(beforeClose),
            createFabMatchContext(beforeClose.cardDefinitions, beforeClose.publicCardIdentities),
          ),
        );
        Oscilio = game.as(oscilio);
        game.passBoth();
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Oscilio).toHaveLife(18);
        const prevented = game
          .committedEvents()
          .filter((event) => event.name === "prevent")
          .map((event) => event.data.preventedAmount);
        expect(prevented.reduce((total, amount) => total + amount, 0)).toBe(alone ? 4 : 3);
        const preventionSources = game
          .committedEvents()
          .filter((event) => event.name === "prevent")
          .map((event) => event.source?.canonicalId);
        expect(preventionSources).toContain(cloudCoverRed.canonicalId);
        expect(preventionSources.includes(battlefrontBastionRed.canonicalId)).toBe(alone);
        expectFabCard(Oscilio, cloudCoverRed).toBeIn("graveyard");
        expectFabCard(Oscilio, battlefrontBastionRed).toBeIn("graveyard");
        expect(Oscilio.zone("arsenal")).toEqual([]);
      };
      run(true);
      run(false);
    });
    it("OS-D2 [AAA] Crown bottoms one chosen hidden-zone card or draws nothing", () => {
      for (const selected of [cloudCoverRed, fateForeseenRed, null] as const) {
        const game = FabTestEngine.start(
          {
            hero: oscilio,
            head: [crownOfProvidence],
            hand: [
              cloudCoverRed,
              cometCollisionRed,
              lightningPressRed,
              constellaContemplationYellow,
            ],
            arsenal: [fateForeseenRed],
            deck: 8,
            deckTop: [lightningPressRed],
          },
          {
            hero: dash,
            hand: [snatchRed, snatchRed, snatchRed, snatchRed],
            deck: 8,
            deckTop: [snatchRed],
          },
          manual,
        );
        const Oscilio = game.as(oscilio);
        const Attacker = game.as(dash);
        Oscilio.must.endTurn();
        const oscilioNarrativeStart = game.renderedPlayerNarrative(Oscilio.id).length;
        const attackerNarrativeStart = game.renderedPlayerNarrative(Attacker.id).length;
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Oscilio.defendWith(crownOfProvidence);
        game.helpers.resolveUntilIdle({
          optionalBoolean: selected !== null,
          entityTargetCanonicalId: selected?.canonicalId,
        });
        game.helpers.resolveRestOfCombat();

        expectFabCard(Oscilio, crownOfProvidence).toBeIn("graveyard");
        if (selected) expect(Oscilio.zone("deck")).toContain(selected.canonicalId);
        expect(Oscilio.zone("hand")).toHaveLength(selected === fateForeseenRed ? 5 : 4);
        expect(Oscilio.zone("arsenal")).toHaveLength(selected === fateForeseenRed ? 0 : 1);
        expect(
          game
            .committedEvents()
            .filter((event) => event.name === "draw" && event.data.playerId === Oscilio.id),
        ).toHaveLength(selected ? 1 : 0);
        expectFabPlayer(Oscilio).toHaveLife(16);
        const selectedName =
          selected === cloudCoverRed
            ? "Cloud Cover"
            : selected === fateForeseenRed
              ? "Fate Foreseen"
              : null;
        const selectedZone = selected === fateForeseenRed ? "arsenal" : "hand";
        expect(game.renderedPlayerNarrative(Oscilio.id).slice(oscilioNarrativeStart)).toEqual([
          "Opponent played Snatch.",
          "Opponent attacked You with Snatch.",
          "You defended with Crown Of Providence.",
          ...(selectedName
            ? [
                `You put ${selectedName} from ${selectedZone} on the bottom of the deck.`,
                "You drew: Lightning Press.",
              ]
            : []),
          "Snatch hit You for 2.",
          "Opponent drew a card.",
          "Crown Of Providence was destroyed.",
        ]);
        expect(game.renderedPlayerNarrative(Attacker.id).slice(attackerNarrativeStart)).toEqual([
          "You played Snatch.",
          "You attacked Opponent with Snatch.",
          "Opponent defended with Crown Of Providence.",
          ...(selectedName
            ? [
                `Opponent put a card from ${selectedZone} on the bottom of the deck.`,
                "Opponent drew a card.",
              ]
            : []),
          "Snatch hit Opponent for 2.",
          "You drew: Snatch.",
          "Crown Of Providence was destroyed.",
        ]);
        Attacker.must.endTurn();
        Oscilio.must.endTurn();
        expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("OS-D3 [AAA] applies Stonewall only to an above-base attack's combat chain", () => {
      const startVariant = (buffed: boolean) =>
        FabTestEngine.start(
          {
            hero: oscilio,
            arms: [stonewallGauntlet],
            hand: [
              cloudCoverRed,
              cometCollisionRed,
              lightningPressRed,
              constellaContemplationYellow,
            ],
            arsenal: [fateForeseenRed],
            deck: 8,
          },
          {
            hero: dash,
            hand: buffed
              ? [nimblismRed, snatchRed, glintTheQuicksilverBlue, hitAndRunBlue]
              : [snatchRed, glintTheQuicksilverBlue, hitAndRunBlue, bladeRunnerRed],
            deck: 8,
          },
          manual,
        );

      for (const buffed of [true, false]) {
        const game = startVariant(buffed);
        const Oscilio = game.as(oscilio);
        let Attacker = game.as(dash);
        Oscilio.must.endTurn();
        if (buffed) {
          Attacker.must.play(nimblismRed);
          game.helpers.resolveUntilIdle({ ordering: "listed" });
        }
        Attacker.must.playAttack(snatchRed);
        game.advanceCombatTo("defend");
        expect(game.combat()?.activeLink?.attackPower).toBe(buffed ? 7 : 4);
        Oscilio.defendWith(stonewallGauntlet);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabCard(Oscilio, stonewallGauntlet).toBeIn("graveyard");
        expectFabPlayer(Oscilio).toHaveLife(buffed ? 13 : 15);
      }
    });
    it("OS-D4 [AAA] Cap discards Echoflash to prevent 1 and fire GY once", () => {
      const game = FabTestEngine.start(
        {
          hero: oscilio,
          head: [capOfQuickThinking],
          hand: [cloudCoverRed, echoflashYellow, blinkBlue, cometCollisionRed],
          arsenal: [fateForeseenRed],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Oscilio = game.as(oscilio);
      const Attacker = game.as(dash);
      Oscilio.must.endTurn();
      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Oscilio.defendWith();
      game.helpers.passPriorityTo(Oscilio);
      Oscilio.must.activate(capOfQuickThinking);
      game.passBoth();
      expectFabCard(Oscilio, capOfQuickThinking).toBeIn("graveyard");
      for (let i = 0; i < 12; i += 1) {
        const wait = game.waitState();
        if (wait.kind === "decision" && wait.decision.kind === "option") break;
        if (wait.kind === "priority") game.pass(wait.playerId);
      }
      const choice = Oscilio.expectDecision("option");
      Oscilio.chooseOptions(choice.options[0]!.id);
      Oscilio.chooseTargets(echoflashYellow);
      if (game.getState().decision) Oscilio.chooseTargetPlayers(Attacker);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: dash.canonicalId,
      });
      expectFabPlayer(Oscilio).toHaveLife(15);
      expectFabCard(Oscilio, echoflashYellow).toBeIn("graveyard");
      expect(Oscilio.zone("arsenal")).toEqual([fateForeseenRed.canonicalId]);
      Attacker.must.endTurn();
      Oscilio.must.endTurn();
      expectFabPlayer(Oscilio).toHaveAP(0).toHaveResourceCount(0);
    });
  });

  describe("Blaze, Firemind", () => {
    it("BL-01 [AAA] pitches blues for Spindle, then Blaze plays Bolt as an instant", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          hand: [aetherSpindleRed, arcaneTwiningBlue, photonSplicingBlue, volticBoltBlue],
          arsenal: [emeritusScoldingRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Defender = game.as(dash);

      Blaze.must.play(aetherSpindleRed, {
        pitch: [arcaneTwiningBlue, photonSplicingBlue],
        target: Defender.id,
      });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(16);
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(4, "energy");
      expectFabPlayer(Blaze).toHaveAP(0).toHaveResourceCount(3);

      const bolt = Blaze.cardIn("hand", volticBoltBlue);
      blazeBanishForInstant(game, Blaze, bolt, 3);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Blaze, volticBoltBlue).toBeBanished();

      game.helpers.passPriorityTo(Blaze);
      Blaze.play(volticBoltBlue, { from: "banished", target: Defender.id });
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(13);
      expect(Blaze.zone("arsenal")).toEqual([emeritusScoldingRed.canonicalId]);
      expectFabCard(Blaze, aetherSpindleRed).toBeIn("graveyard");
      Blaze.must.endTurn();
      expectFabPlayer(Blaze).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("BL-H1 [AAA] Lens opt plus Whisper energy lets Blaze play Spindle as an instant", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          head: [talismanicLens],
          hand: [volticBoltBlue, cinderingForesightRed, aetherSpindleRed, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Defender = game.as(dash);

      Blaze.must.activate(talismanicLens);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabCard(Blaze, talismanicLens).toBeIn("graveyard");
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(2, "energy");

      Blaze.must.play(whisperOfTheOracleBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(4, "energy");

      const spindle = Blaze.cardIn("hand", aetherSpindleRed);
      blazeBanishForInstant(game, Blaze, spindle, 4);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Blaze, aetherSpindleRed).toBeBanished();

      game.helpers.passPriorityTo(Blaze);
      Blaze.play(aetherSpindleRed, { from: "banished", target: Defender.id });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(16);
      expect(() => Blaze.must.activate(blazeFiremind)).toThrow();
    });

    it("BL-E2 [AAA] Mage Master Boots refunds AP only after the next NAA", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          legs: [mageMasterBoots],
          hand: [cinderingForesightRed, aetherSpindleRed, volticBoltBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);

      Blaze.must.activate(mageMasterBoots);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Blaze, mageMasterBoots).toBeIn("graveyard");
      expectFabPlayer(Blaze).toHaveAP(1);

      Blaze.must.play(whisperOfTheOracleBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Blaze).toHaveAP(1);
      expectFabCard(Blaze, whisperOfTheOracleBlue).toBeIn("graveyard");
    });

    it("BL-02 [AAA] Cindering opt plus Whisper order, then generic Bolt is unamped", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          hand: [
            cinderingForesightRed,
            whisperOfTheOracleRed,
            forebodingBoltBlue,
            painfulPremonitionBlue,
          ],
          arsenal: [nucleusAetherboltRed],
          resourcePoints: 1,
          deck: [
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            photonSplicingBlue,
          ],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const _Defender = game.as(dash);

      Blaze.must.play(whisperOfTheOracleRed);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(4, "energy");
      expectFabPlayer(Blaze).toHaveAP(1);

      Blaze.must.play(cinderingForesightRed);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(7, "energy");
      expectFabCard(Blaze, forebodingBoltBlue).toBeIn("hand");
      expectFabCard(Blaze, painfulPremonitionBlue).toBeIn("hand");
      expect(Blaze.zone("arsenal")).toEqual([nucleusAetherboltRed.canonicalId]);
      Blaze.must.endTurn();
      expectFabPlayer(Blaze).toHaveAP(0).toHaveResourceCount(0);
    });

    it("BL-03 [AAA] Mindfire tap is optional and declined branch creates no Ponder", () => {
      for (const tap of [true, false] as const) {
        const game = FabTestEngine.start(
          {
            hero: blazeFiremind,
            heroState: { energyCounters: 5 },
            hand: [turnToMindfireRed, dampenRed, aetherSpindleBlue, emeritusScoldingBlue],
            arsenal: [aetherslingRed],
            resourcePoints: 2,
            deck: 8,
          },
          emptyDash,
          FAB_MANUAL_HARNESS,
        );
        const Blaze = game.as(blazeFiremind);
        const Defender = game.as(dash);
        const mindfire = Blaze.cardIn("hand", turnToMindfireRed);
        blazeBanishForInstant(game, Blaze, mindfire, 5);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabCard(Blaze, turnToMindfireRed).toBeBanished();

        game.helpers.passPriorityTo(Blaze);
        Blaze.play(turnToMindfireRed, { from: "banished", target: Defender.id });
        game.passBoth();
        if (game.getState().decision?.kind === "boolean") Blaze.chooseBoolean(tap);
        game.helpers.resolveUntilIdle({ optionalBoolean: tap });
        expectFabPlayer(Defender).toHaveLife(15);
        expect(Blaze.zone("arena").includes("token:ponder")).toBe(tap);
        if (tap) expectFabCard(Blaze, blazeFiremind).toBeTapped();
        else expectFabCard(Blaze, blazeFiremind).toBeReady();
        expect(() => Blaze.must.activate(blazeFiremind)).toThrow();
        expect(Blaze.zone("arsenal")).toEqual([aetherslingRed.canonicalId]);
      }
    });

    it("BL-04 [AAA] Bolt then Snapback as instant, then Rabble closes combat", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          hand: [arcanePolarityRed, snapbackRed, volticBoltBlue, arcaneTwiningBlue],
          arsenal: [ravenousRabbleRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Defender = game.as(dash);

      Blaze.must.play(arcanePolarityRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Blaze).toHaveLife(18);

      Blaze.must.play(volticBoltBlue, {
        pitch: [arcaneTwiningBlue],
        target: Defender.id,
      });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(17);

      Blaze.play(snapbackRed, { target: Defender.id });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(14);
      expectFabPlayer(Blaze).toHaveAP(0);

      Blaze.must.endTurn();
      game.as(dash).must.endTurn();
      const next = FabTestEngine.start(
        {
          hero: blazeFiremind,
          hand: [arcanePolarityRed, snapbackRed, volticBoltBlue, arcaneTwiningBlue],
          arsenal: [ravenousRabbleRed],
          deck: [
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
            whisperOfTheOracleBlue,
          ],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Rabble = next.as(blazeFiremind);
      Rabble.must.playFromArsenal(ravenousRabbleRed);
      toDefend(next);
      expectCombat(next).toHaveAttackPower(2);
      missBlockAndClose(next);
      expect(next.combat()).toBeNull();
      expectFabPlayer(next.as(dash)).toHaveLife(18);
      expectFabPlayer(Rabble).toHaveAP(1);
      Rabble.play(volticBoltBlue, { pitch: [arcaneTwiningBlue], target: next.as(dash).id });
      next.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(next.as(dash)).toHaveLife(15);
      expect(next.combat()).toBeNull();
    });

    it("BL-05 [AAA] Fighting Spirit life-gain is not Absorb prevention", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          life: 16,
          hand: [
            absorbInAetherRed,
            fyendalSFightingSpiritRed,
            whisperOfTheOracleBlue,
            photonSplicingBlue,
          ],
          arsenal: [emeritusScoldingRed],
          deck: 8,
        },
        {
          hero: dash,
          life: 20,
          hand: [snatchRed, sigilOfSolaceRed, sigilOfSolaceRed, snatchRed],
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Attacker = game.as(dash);
      Blaze.must.endTurn();
      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Blaze.defendWith(fyendalSFightingSpiritRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Blaze).toHaveLife(15);
      expectFabCard(Blaze, fyendalSFightingSpiritRed).toBeIn("graveyard");
      Attacker.must.endTurn();

      Blaze.must.play(whisperOfTheOracleBlue);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      Blaze.play(photonSplicingBlue, { pitch: [absorbInAetherRed], target: Attacker.id });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Attacker).toHaveLife(18);
      expectFabCard(Blaze, absorbInAetherRed).toBeIn("pitch");
      expect(Blaze.zone("arsenal")).toEqual([emeritusScoldingRed.canonicalId]);
      Blaze.must.endTurn();
      expectFabPlayer(Blaze).toHaveAP(0).toHaveResourceCount(0);
    });

    it("BL-H2 [AAA] Cindering opt then Blaze plays Nucleus in combat", () => {
      const game = FabTestEngine.start(
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        {
          hero: blazeFiremind,
          hand: [
            nucleusAetherboltRed,
            cinderingForesightRed,
            aetherSpindleBlue,
            whisperOfTheOracleBlue,
          ],
          arsenal: [aetherSpindleRed],
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Attacker = game.as(dash);

      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Blaze);
      Blaze.must.play(cinderingForesightRed);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(3, "energy");
      game.helpers.passPriorityTo(Blaze);
      const nucleus = Blaze.cardIn("hand", nucleusAetherboltRed);
      blazeBanishForInstant(game, Blaze, nucleus, 3);
      game.passBoth();
      expectFabCard(Blaze, nucleusAetherboltRed).toBeBanished();

      game.helpers.passPriorityTo(Blaze);
      Blaze.play(nucleusAetherboltRed, { from: "banished", target: Attacker.id });
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabPlayer(Attacker).toHaveLife(16);
    });

    it("BL-E1 [AAA] Crucible +1 applies once and does not change Blaze X", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          weapon1: [crucibleOfAetherweave],
          heroState: { energyCounters: 4 },
          hand: [aetherSpindleRed, volticBoltBlue, aetherSpindleBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          resourcePoints: 3,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Defender = game.as(dash);

      Blaze.must.play(whisperOfTheOracleBlue);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabPlayer(Blaze).toHaveAP(1);

      Blaze.must.activate(crucibleOfAetherweave);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Blaze.must.play(aetherSpindleRed, { target: Defender.id });
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(15);

      const spindle = Blaze.cardIn("hand", aetherSpindleBlue);
      blazeBanishForInstant(game, Blaze, spindle, 2);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Blaze, aetherSpindleBlue).toBeBanished();

      const mismatch = FabTestEngine.start(
        {
          hero: blazeFiremind,
          weapon1: [crucibleOfAetherweave],
          heroState: { energyCounters: 4 },
          hand: [aetherSpindleRed, volticBoltBlue, aetherSpindleBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const WrongX = mismatch.as(blazeFiremind);
      mismatch.as(blazeFiremind).must.activate(crucibleOfAetherweave);
      mismatch.helpers.resolveUntilIdle({ ordering: "listed" });
      const blue = WrongX.cardIn("hand", aetherSpindleBlue);
      WrongX.must.activate(blazeFiremind);
      mismatch.advanceToDecision(WrongX, "numeric");
      mismatch.answerDecision(WrongX.id, { kind: "numeric", value: 4 });
      const xDecision = mismatch.getState().decision;
      if (xDecision?.kind === "entity-target" && xDecision.actorId === WrongX.id) {
        const tooHigh = WrongX.expectFailure({
          move: "answer-decision",
          payload: {
            decisionId: xDecision.decisionId,
            stateVersion: xDecision.stateVersion,
            answer: { kind: "entity-target", instanceIds: [blue.instanceId] },
          },
        });
        expect(tooHigh.accepted).toBe(false);
      } else {
        expect(WrongX.zone("hand")).toContain(aetherSpindleBlue.canonicalId);
      }
    });
    it("BL-D1 [AAA] combines arsenal Absorb and Cindering on exactly the next arcane card", () => {
      let game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          heroState: { energyCounters: 3 },
          hand: [
            nucleusAetherboltRed,
            cinderingForesightRed,
            forebodingBoltBlue,
            whisperOfTheOracleBlue,
          ],
          arsenal: [absorbInAetherRed],
          deck: 8,
        },
        {
          hero: dash,
          hand: [snatchRed, sigilOfSolaceRed, sigilOfSolaceRed, snatchRed],
          deck: 8,
        },
        manual,
      );
      let Blaze = game.as(blazeFiremind);
      let Attacker = game.as(dash);
      Blaze.must.endTurn();
      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Blaze);
      Blaze.play(absorbInAetherRed, {
        from: "arsenal",
        pitch: [forebodingBoltBlue],
      });
      Blaze.must.play(cinderingForesightRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      const armed = game.getState();
      game = FabTestEngine.fromState(
        restoreFabMatchSnapshot(
          serializeFabMatchSnapshot(armed),
          createFabMatchContext(armed.cardDefinitions, armed.publicCardIdentities),
        ),
      );
      Blaze = game.as(blazeFiremind);
      Attacker = game.as(dash);
      Attacker.must.play(Attacker.cardsIn("hand", sigilOfSolaceRed)[0]!);
      Attacker.pass();
      const nucleus = Blaze.cardIn("hand", nucleusAetherboltRed);
      blazeBanishForInstant(game, Blaze, nucleus, 3);
      game.passBoth();
      game.helpers.passPriorityTo(Blaze);
      Blaze.play(nucleusAetherboltRed, {
        from: "banished",
        targetInstanceId: Attacker.getState().players[Attacker.id]!.heroCardId!,
      });
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Attacker).toHaveLife(17);
      expect(
        game
          .committedEvents()
          .filter((event) => event.name === "deal-damage")
          .map((event) => event.data.amount),
      ).toContain(6);
      expectFabCard(Blaze, absorbInAetherRed).toBeIn("graveyard");
      expectFabCard(Blaze, cinderingForesightRed).toBeIn("graveyard");
      expect(Blaze.zone("pitch")).toContain(forebodingBoltBlue.canonicalId);
      expect(Blaze.zone("arsenal")).toEqual([]);
      expect(game.getState().replacementEffects).toEqual([]);
    });
    it("BL-D3 [AAA] binds Foothold to the active attack without leaking", () => {
      let game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          legs: [unflinchingFoothold],
          hand: [cinderingForesightRed, arcanePolarityRed, volticBoltBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          deck: 8,
        },
        {
          hero: dash,
          arena: [quicken],
          hand: [isolateYellow, isolateYellow, snatchRed, snatchRed],
          deck: 8,
        },
        manual,
      );
      let Blaze = game.as(blazeFiremind);
      let Attacker = game.as(dash);
      Blaze.must.endTurn();
      const firstIsolate = Attacker.cardsIn("hand", isolateYellow)[0]!;
      Attacker.must.playAttack(firstIsolate);
      game.advanceCombatTo("attack");
      expectCombat(game).toBeAtStep("attack").toHaveKeyword("dominate");
      game.helpers.passPriorityTo(Blaze);
      Blaze.must.activate(unflinchingFoothold);
      for (let safety = 0; game.getState().rulesStack.length > 0 && safety < 8; safety += 1) {
        const priorityPlayerId = game.getState().priority?.holderPlayerId;
        if (!priorityPlayerId) throw new Error("Foothold stack resolution lost public priority.");
        game.pass(priorityPlayerId);
      }
      expectCombat(game).toBeAtStep("attack").notToHaveKeyword("dominate");

      const beforeRestore = game.getState();
      game = FabTestEngine.fromState(
        restoreFabMatchSnapshot(
          serializeFabMatchSnapshot(beforeRestore),
          createFabMatchContext(beforeRestore.cardDefinitions, beforeRestore.publicCardIdentities),
        ),
      );
      Blaze = game.as(blazeFiremind);
      Attacker = game.as(dash);
      expectCombat(game).toBeAtStep("attack").notToHaveKeyword("dominate");
      const restoredAttackId = game.combat()?.activeLink?.activeAttack.sourceObjectId;
      const restoredAttack = restoredAttackId
        ? game.getState().objects[restoredAttackId]
        : undefined;
      expect(restoredAttack).toBeDefined();
      expect(
        game
          .getState()
          .continuousEffectInstances.some((effect) =>
            effect.initialSubjects.some(
              (subject) =>
                subject.instanceId === restoredAttackId &&
                subject.incarnation === restoredAttack?.incarnation,
            ),
          ),
      ).toBe(true);
      game.advanceCombatTo("defend");
      Blaze.defendWith([volticBoltBlue, whisperOfTheOracleBlue]);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expect(
        game
          .committedEvents()
          .filter((event) => event.name === "defend")
          .map((event) => event.data.object.canonicalId),
      ).toEqual([volticBoltBlue.canonicalId, whisperOfTheOracleBlue.canonicalId]);
      expect(
        game.committedEvents().find((event) => event.name === "resolve-combat-damage")?.data.damage,
      ).toBe(0);
      expectFabCard(Blaze, unflinchingFoothold).toBeIn("graveyard");
      expectFabPlayer(Blaze).toHaveLife(17).toHaveHandCount(2);
      expect(Blaze.zone("arsenal")).toEqual([nucleusAetherboltRed.canonicalId]);
      const battleworn = FabTestEngine.start(
        {
          hero: blazeFiremind,
          legs: [unflinchingFoothold],
          hand: [cinderingForesightRed, arcanePolarityRed, volticBoltBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        manual,
      );
      const BattlewornBlaze = battleworn.as(blazeFiremind);
      const PlainAttacker = battleworn.as(dash);
      const footholdId = BattlewornBlaze.findCardInZone("legs", unflinchingFoothold);
      BattlewornBlaze.must.endTurn();
      PlainAttacker.must.playAttack(PlainAttacker.cardsIn("hand", snatchRed)[0]!);
      battleworn.advanceCombatTo("defend");
      BattlewornBlaze.defendWith([unflinchingFoothold, volticBoltBlue]);
      battleworn.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(BattlewornBlaze.zone("legs")).toContain(unflinchingFoothold.canonicalId);
      expect(battleworn.objectState(footholdId)?.defenseCounterTotal).toBe(-1);
      expectFabPlayer(BattlewornBlaze).toHaveLife(17);
      expect(BattlewornBlaze.zone("arsenal")).toEqual([nucleusAetherboltRed.canonicalId]);
      PlainAttacker.must.endTurn();
      BattlewornBlaze.must.endTurn();
      expectFabPlayer(BattlewornBlaze).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const closed = FabTestEngine.start(
        {
          hero: blazeFiremind,
          legs: [unflinchingFoothold],
          hand: [cinderingForesightRed, arcanePolarityRed, volticBoltBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          deck: 8,
        },
        { hero: dash, hand: [isolateYellow, snatchRed, snatchRed, snatchRed], deck: 8 },
        manual,
      );
      const ClosedBlaze = closed.as(blazeFiremind);
      const closedAttempt = ClosedBlaze.expectFailure({
        move: "activate",
        payload: { instanceId: ClosedBlaze.cardIn("legs", unflinchingFoothold).instanceId },
      });
      expect(closedAttempt.accepted).toBe(false);
      expect(closedAttempt.errorCode).toBe("required_targets_unavailable");
      ClosedBlaze.must.endTurn();
      const FreshAttacker = closed.as(dash);
      FreshAttacker.must.playAttack(isolateYellow);
      closed.advanceCombatTo("attack");
      expectCombat(closed).toHaveKeyword("dominate");
    });
    it("BL-D4 [AAA] destroyed Spellfire Cloak cannot also pay Arcane Barrier", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          chest: [spellfireCloak],
          hand: [cinderingForesightRed, arcanePolarityRed, volticBoltBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          deck: 8,
        },
        {
          hero: oscilio,
          hand: [flashBoltRed, cosmicFlareRed, cloudCoverRed, blinkBlue],
          resourcePoints: 2,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Opponent = game.as(oscilio);
      expect(() => Blaze.must.activate(spellfireCloak)).toThrow();
      Blaze.must.endTurn();
      game.helpers.passPriorityTo(Blaze);
      Blaze.must.activate(spellfireCloak);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Blaze, spellfireCloak).toBeIn("graveyard");
      expectFabPlayer(Blaze).toHaveResourceCount(1);

      Opponent.must.play(cosmicFlareRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Opponent.play(flashBoltRed, { target: Blaze.id });
      game.passBoth();
      expectFabPlayer(Blaze).toHaveLife(14);
      expectFabPlayer(Blaze).toHaveResourceCount(1);
      Opponent.must.endTurn();
      expect(() => Blaze.must.activate(spellfireCloak)).toThrow();
      Blaze.must.endTurn();
      expectFabPlayer(Blaze).toHaveAP(0).toHaveResourceCount(0);
    });
    it("BL-D5 [AAA] Seeker's Mitts prevent 1 once and opt into Blaze energy", () => {
      const game = FabTestEngine.start(
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        {
          hero: blazeFiremind,
          arms: [seekerSMitts],
          hand: [cinderingForesightRed, arcanePolarityRed, volticBoltBlue, whisperOfTheOracleBlue],
          arsenal: [nucleusAetherboltRed],
          resourcePoints: 1,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Blaze = game.as(blazeFiremind);
      const Attacker = game.as(dash);
      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Blaze);
      Blaze.must.activate(seekerSMitts);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
      expectFabCard(Blaze, seekerSMitts).toBeIn("graveyard");
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(1, "energy");
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(Blaze).toHaveLife(14);
      Attacker.must.endTurn();
      expectFabCard(Blaze, blazeFiremind).toHaveCounters(1, "energy");
      Blaze.must.endTurn();
      expectFabPlayer(Blaze).toHaveAP(0).toHaveResourceCount(0);
    });
  });

  describe("Aurora, Legacy of Tempest", () => {
    it("AU-01 [AAA] Discharge plus Flittering, then Surge from arsenal", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [
            flitteringChargeRed,
            electrostaticDischargeRed,
            arcLightningYellow,
            currentFunnelBlue,
          ],
          arsenal: [lightningSurgeRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      const Defender = game.as(dash);

      Aurora.must.play(arcLightningYellow);
      game.helpers.resolveUntilIdle({ entityTargetCanonicalId: dash.canonicalId });
      expectFabPlayer(Aurora).toHaveAP(1);
      expectFabPlayer(Defender).toHaveLife(19);

      Aurora.must.play(electrostaticDischargeRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Aurora.must.playAttack(flitteringChargeRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(7).toHaveKeyword("go-again");
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: dash.canonicalId,
      });
      expectFabPlayer(Defender).toHaveLife(11);
      expectFabPlayer(Aurora).toHaveAP(1);

      Aurora.must.playFromArsenal(lightningSurgeRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: dash.canonicalId,
      });
      expectFabPlayer(Defender).toHaveLife(6);
      expectFabPlayer(Aurora).toHaveAP(1);
      expectFabCard(Aurora, arcLightningYellow).toBeIn("graveyard");
      expectFabCard(Aurora, currentFunnelBlue).toBeIn("hand");
      Aurora.must.endTurn();
      expectFabPlayer(Aurora).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("AU-H2 [AAA] Lightning Press +3s the attack and Aurora stays locked without a Flow", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [lightningPressRed, flitteringChargeRed, secondStrikeRed, currentFunnelBlue],
          arsenal: [flowstateEmbodimentRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      Aurora.must.playAttack(flitteringChargeRed);
      game.toReaction("attacker");
      Aurora.play(lightningPressRed);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(7);
      expectFabPlayer(Aurora).toHaveTokenCount("lightning-flow", 0);
      expect(() => Aurora.must.activate(auroraLegacyOfTempest)).toThrow();
      expect(Aurora.zone("arsenal")).toEqual([flowstateEmbodimentRed.canonicalId]);
    });

    it("AU-02 [AAA] each go-again source refunds AP once through Path and Kiss", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [flowstateEmbodimentRed, jackBeNimbleRed, quickSuccessionRed, pathOfSameEndsRed],
          arsenal: [tempestuousKissRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      const Defender = game.as(dash);

      Aurora.must.play(quickSuccessionRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Aurora).toHaveAP(1);

      Aurora.must.playAttack(pathOfSameEndsRed);
      toDefend(game);
      expectCombat(game).toHaveKeyword("go-again");
      expect(game.combat()?.activeLink?.attackPower).toBeGreaterThanOrEqual(4);
      missBlockAndClose(game);
      expect(Defender.life()).toBeLessThan(20);
      expectFabPlayer(Aurora).toHaveAP(1);

      Aurora.must.playAttack(flowstateEmbodimentRed);
      toDefend(game);
      expect(game.combat()?.activeLink?.attackPower).toBeGreaterThanOrEqual(4);
      missBlockAndClose(game);
      expect(Defender.life()).toBeLessThan(16);
      expectFabPlayer(Aurora).toHaveAP(0);

      expect(() => Aurora.must.playAttack(jackBeNimbleRed)).toThrow();
      expect(Aurora.zone("arsenal")).toEqual([tempestuousKissRed.canonicalId]);
      Aurora.must.endTurn();
      expectFabPlayer(Aurora).toHaveAP(0).toHaveResourceCount(0);
    });
    it("AU-03 [AAA] Skyward modes are public and illegal targets are rejected", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [fryRed, nimbyRed, skyzykRed, skywardSerenadeYellow],
          arsenal: [voltboundDualityRed],
          deck: [
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            nimblismRed,
            skyzykRed,
          ],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      const Defender = game.as(dash);

      Aurora.play(skywardSerenadeYellow, { modeIndexes: [0, 2] });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
      expectFabPlayer(Aurora).toHaveAP(1);
      expect(() => Aurora.play(skywardSerenadeYellow, { modeIndexes: [0, 1, 2] })).toThrow();

      Aurora.must.playAttack(fryRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(16);
      expect(Aurora.zone("arena")).not.toContain("token:embodiment-of-lightning");
      expect(Aurora.zone("arsenal")).toEqual([voltboundDualityRed.canonicalId]);
      Aurora.must.endTurn();
      expectFabPlayer(Aurora).toHaveAP(0).toHaveResourceCount(0);
    });
    it("AU-04 [AAA] Enlightened Strike mode, Press, then Scar without surplus AP", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [enlightenedStrikeRed, lightningPressRed, currentFunnelBlue, scarForAScarRed],
          arsenal: [snatchRed],
          deck: 8,
        },
        { hero: dash, hand: [], deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      const Defender = game.as(dash);

      Aurora.play(enlightenedStrikeRed, {
        modeIndexes: [2],
        target: Defender.id,
      });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(15);
      expectFabPlayer(Aurora).toHaveAP(1);

      Aurora.must.playAttack(currentFunnelBlue);
      toDefend(game);
      // Enlightened Strike is Generic, so Current Funnel's "last action card
      // was Lightning" rider does not fire and the attack has no go again.
      expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(13);
      expectFabPlayer(Aurora).toHaveAP(0);
      expect(Aurora.zone("arsenal")).toEqual([snatchRed.canonicalId]);
      Aurora.must.endTurn();
      expectFabPlayer(Aurora).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("AU-05 [AAA] Arc Lightning pings once per go-again and cleans up", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [
            arcLightningYellow,
            skywardSerenadeYellow,
            electrostaticDischargeRed,
            flitteringChargeRed,
          ],
          arsenal: [tempestuousKissRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      const Defender = game.as(dash);

      Aurora.must.play(arcLightningYellow);
      game.helpers.resolveUntilIdle({ entityTargetCanonicalId: dash.canonicalId });
      expectFabPlayer(Aurora).toHaveAP(1);

      Aurora.play(skywardSerenadeYellow, { modeIndexes: [0, 2] });
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: dash.canonicalId,
      });
      expectFabPlayer(Defender).toHaveLife(18);
      expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");

      Aurora.must.play(electrostaticDischargeRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Aurora.must.playAttack(flitteringChargeRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(8).toHaveKeyword("go-again");
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: dash.canonicalId,
      });
      expectFabPlayer(Defender).toHaveLife(9);
      expectFabPlayer(Aurora).toHaveAP(1);
      expect(Aurora.zone("arena")).not.toContain("token:embodiment-of-lightning");
      Aurora.must.endTurn();
      expectFabPlayer(Aurora).toHaveAP(0).toHaveResourceCount(0);
      expectFabPlayer(Defender).toHaveLife(9);
    });
    it("AU-06 [AAA] granted go again and printed go again each refund once", () => {
      const granted = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [nimblismRed, pathOfSameEndsRed, secondStrikeRed, skyzykRed],
          arsenal: [quickSuccessionYellow],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Granted = granted.as(auroraLegacyOfTempest);
      Granted.must.playFromArsenal(quickSuccessionYellow);
      granted.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Granted).toHaveAP(1);
      Granted.must.playAttack(skyzykRed);
      toDefend(granted);
      expectCombat(granted).toHaveAttackPower(5).toHaveKeyword("go-again");
      missBlockAndClose(granted);
      expectFabPlayer(Granted).toHaveAP(1);

      const printed = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [nimblismRed, pathOfSameEndsRed, secondStrikeRed, skyzykRed],
          arsenal: [quickSuccessionYellow],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Printed = printed.as(auroraLegacyOfTempest);
      Printed.must.play(nimblismRed);
      printed.helpers.resolveUntilIdle({ ordering: "listed" });
      Printed.must.playAttack(pathOfSameEndsRed);
      toDefend(printed);
      expectCombat(printed).toHaveAttackPower(6).toHaveKeyword("go-again");
      missBlockAndClose(printed);
      expectFabPlayer(Printed).toHaveAP(1);
      Printed.must.playAttack(secondStrikeRed);
      toDefend(printed);
      missBlockAndClose(printed);
      Printed.must.endTurn();
      expectFabPlayer(Printed).toHaveAP(0).toHaveResourceCount(0);
    });
    it("AU-H1 [AAA] converts Voltbound's Flow into one consumed Embodiment", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          hand: [voltboundDualityRed, flitteringChargeRed, secondStrikeRed, currentFunnelBlue],
          arsenal: [flowstateEmbodimentRed],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        manual,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      const Defender = game.as(dash);

      Aurora.must.activate(voltboundDualityRed);
      Aurora.chooseTargetPlayers(Defender);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(19);
      expectFabPlayer(Aurora).toHaveResourceCount(2);
      expectFabCard(Aurora, voltboundDualityRed).toBeIn("graveyard");
      expect(Aurora.zone("arena")).toContain("token:lightning-flow");

      Aurora.must.activate(auroraLegacyOfTempest);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Aurora).toHaveResourceCount(0);
      expectFabCard(Aurora, auroraLegacyOfTempest).toBeTapped();
      expect(Aurora.zone("arena")).not.toContain("token:lightning-flow");
      expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");

      Aurora.must.playAttack(flitteringChargeRed);
      game.advanceCombatTo("defend");
      Defender.must.defend();
      expect(Aurora.zone("arena")).not.toContain("token:embodiment-of-lightning");
      expectCombat(game).toHaveKeyword("go-again");
      game.helpers.resolveRestOfCombat();

      expectFabPlayer(Defender).toHaveLife(15);
      expectFabPlayer(Aurora).toHaveAP(1);
      expect(Aurora.zone("arsenal")).toEqual([flowstateEmbodimentRed.canonicalId]);
      Aurora.must.endTurn();
      expectFabPlayer(Aurora).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      expectFabCard(Aurora, auroraLegacyOfTempest).toBeReady();
    });
    it("AU-H2 [AAA] creates exactly the chosen Lightning token and Aurora consumes only Flow", () => {
      const run = (choice: "lightning-flow" | "embodiment-of-lightning") => {
        const game = FabTestEngine.start(
          {
            hero: auroraLegacyOfTempest,
            hand: [lightningPressRed, flowstateEmbodimentRed, secondStrikeRed, currentFunnelBlue],
            arsenal: [flitteringChargeRed],
            resourcePoints: 2,
            actionPoints: 1,
            deck: 8,
          },
          { hero: dash, hand: [], deck: 8 },
          FAB_MANUAL_HARNESS,
        );
        const Aurora = game.as(auroraLegacyOfTempest);

        Aurora.must.playAttack(flowstateEmbodimentRed);
        game.toReaction("attacker");
        Aurora.must.playInstant(lightningPressRed);
        game.advanceToDecision(Aurora, "effect-resolution");
        Aurora.choose(choice);
        game.closeCombat({ ordering: "listed" });

        expect(Aurora.zone("arena")).toContain(`token:${choice}`);
        expect(Aurora.zone("arena")).not.toContain(
          `token:${choice === "lightning-flow" ? "embodiment-of-lightning" : "lightning-flow"}`,
        );

        if (choice === "lightning-flow") {
          Aurora.must.activate(auroraLegacyOfTempest);
          game.untilIdle({ ordering: "listed" });
          expect(Aurora.zone("arena")).not.toContain("token:lightning-flow");
          expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
          expectFabCard(Aurora, auroraLegacyOfTempest).toBeTapped();
        } else {
          Aurora.expectActivationRejected(auroraLegacyOfTempest);
          expectFabCard(Aurora, auroraLegacyOfTempest).toBeReady();
        }
      };

      run("lightning-flow");
      run("embodiment-of-lightning");
    });
    it("AU-E1 [AAA] Scorpio attacks only while a Lightning attack is controlled", () => {
      const legal = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          weapon1: [scorpioCometTail],
          hand: [lightningSurgeRed, flitteringChargeRed, secondStrikeRed, currentFunnelBlue],
          arsenal: [arcLightningYellow],
          actionPoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Aurora = legal.as(auroraLegacyOfTempest);
      const Defender = legal.as(dash);
      Aurora.must.playAttack(flitteringChargeRed);
      legal.advanceCombatTo("resolution");
      Aurora.must.activate(scorpioCometTail);
      toDefend(legal);
      expectCombat(legal).toHaveAttackPower(1);
      missBlockAndClose(legal);
      expectFabPlayer(Defender).toHaveLife(14);
    });
    it("AU-E2 [AAA] Ironweave needs both an NAA and an attack action", () => {
      const game = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          chest: [aetherIronweave],
          hand: [nimblismRed, fryRed, secondStrikeRed, currentFunnelBlue],
          arsenal: [arcLightningYellow],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      expect(() => Aurora.must.activate(aetherIronweave)).toThrow();
      Aurora.must.play(nimblismRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(() => Aurora.must.activate(aetherIronweave)).toThrow();
      Aurora.must.playAttack(fryRed);
      toDefend(game);
      missBlockAndClose(game);
      Aurora.must.activate(aetherIronweave);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Aurora, aetherIronweave).toBeIn("graveyard");
      expectFabPlayer(Aurora).toHaveResourceCount(2).toHaveAP(1);
    });
    it("AU-E3 [AAA] Grasp costs 2/3 and Snapdragon only buffs cost-1 attacks", () => {
      const zero = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          arms: [graspOfTheArknight],
          hand: [flitteringChargeRed, secondStrikeRed, currentFunnelBlue, lightningPressRed],
          arsenal: [pathOfSameEndsRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Zero = zero.as(auroraLegacyOfTempest);
      Zero.must.activate(graspOfTheArknight);
      zero.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Zero.zone("arena")).toContain("token:runechant");
      expectFabPlayer(Zero).toHaveResourceCount(0).toHaveAP(1);

      const one = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          arms: [graspOfTheArknight],
          arena: [fabToken("runechant")],
          hand: [],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      one.as(auroraLegacyOfTempest).expectActivationRejected(graspOfTheArknight);
      expectFabPlayer(one.as(auroraLegacyOfTempest)).toHaveTokenCount("runechant", 1);

      const snap = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          legs: [snapdragonScalers],
          hand: [flitteringChargeRed, secondStrikeRed, currentFunnelBlue, lightningPressRed],
          arsenal: [pathOfSameEndsRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Snap = snap.as(auroraLegacyOfTempest);
      Snap.must.playAttack(flitteringChargeRed);
      snap.toReaction("attacker");
      Snap.must.activate(snapdragonScalers);
      if (snap.getState().decision) Snap.target(flitteringChargeRed);
      snap.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Snap, snapdragonScalers).toBeIn("graveyard");

      const kiss = FabTestEngine.start(
        {
          hero: auroraLegacyOfTempest,
          legs: [snapdragonScalers],
          hand: [tempestuousKissRed, secondStrikeRed, currentFunnelBlue, lightningPressRed],
          arsenal: [pathOfSameEndsRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Kiss = kiss.as(auroraLegacyOfTempest);
      Kiss.must.playAttack(tempestuousKissRed);
      kiss.toReaction("attacker");
      expect(() => Kiss.must.activate(snapdragonScalers)).toThrow();
    });
    it("AU-D1 [AAA] Face Purgatory requires both action-card defense types", () => {
      for (const omitted of ["none", "attack", "non-attack"] as const) {
        const game = FabTestEngine.start(
          {
            hero: auroraLegacyOfTempest,
            head: [facePurgatory],
            hand: [flowstateEmbodimentRed, nimblismRed, fryRed, currentFunnelBlue],
            arsenal: [lightningSurgeRed],
            deck: 8,
          },
          {
            hero: dash,
            hand: [snatchRed, hitAndRunBlue, glintTheQuicksilverBlue, regurgitatingSlogRed],
            deck: 8,
          },
          manual,
        );
        const Aurora = game.as(auroraLegacyOfTempest);
        const Attacker = game.as(dash);
        Aurora.must.endTurn();
        Attacker.must.playAttack(snatchRed);
        game.advanceCombatTo("defend");
        const defenders = [facePurgatory];
        if (omitted !== "attack") defenders.push(flowstateEmbodimentRed);
        if (omitted !== "non-attack") defenders.push(nimblismRed);
        Aurora.defendWith(defenders);
        game.helpers.resolveUntilIdle({
          ordering: "listed",
          entityTargetCanonicalId: hitAndRunBlue.canonicalId,
        });

        expectFabCard(Aurora, facePurgatory).toBeIn("graveyard");
        expectFabPlayer(Aurora).toHaveLife(40);
        expectFabPlayer(Attacker).toHaveHandCount(omitted === "none" ? 2 : 3);
        expectFabPlayer(Aurora).toHaveHandCount(3);
        if (omitted === "none") expectFabCard(Attacker, hitAndRunBlue).toBeIn("graveyard");
        else expectFabCard(Attacker, hitAndRunBlue).toBeIn("hand");
        expect(Aurora.zone("arsenal")).toEqual([lightningSurgeRed.canonicalId]);
        Attacker.must.endTurn();
        Aurora.must.endTurn();
        expectFabPlayer(Aurora).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });
    it("AU-D2 [AAA] Press needs an AAC; Voltbound Flow lets Aurora activate off-turn", () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [regurgitatingSlogRed, whisperOfTheOracleBlue, snatchRed, snatchRed],
          deck: 8,
        },
        {
          hero: auroraLegacyOfTempest,
          hand: [lightningPressRed, voltboundDualityRed, flitteringChargeRed, currentFunnelBlue],
          arsenal: [lightningSurgeRed],
          resourcePoints: 3,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Aurora = game.as(auroraLegacyOfTempest);
      const Attacker = game.as(dash);
      expect(() => Aurora.must.play(lightningPressRed)).toThrow();
      Attacker.must.playAttack(regurgitatingSlogRed, { pitch: [whisperOfTheOracleBlue] });
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Aurora);
      Aurora.must.activate(voltboundDualityRed);
      Aurora.chooseTargetPlayers(Attacker);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Attacker).toHaveLife(19);
      expect(Aurora.zone("arena")).toContain("token:lightning-flow");
      game.helpers.passPriorityTo(Aurora);
      Aurora.must.activate(auroraLegacyOfTempest);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Aurora.zone("arena")).toContain("token:embodiment-of-lightning");
      expectFabPlayer(Aurora).toHaveAP(0);
      expect(Aurora.zone("arsenal")).toEqual([lightningSurgeRed.canonicalId]);
    });
    it("AU-D3 [AAA] Ironweave and Grasp take Battleworn once and cannot re-defend at 0", () => {
      for (const loadout of ["ironweave", "grasp"] as const) {
        const game = FabTestEngine.start(
          {
            hero: auroraLegacyOfTempest,
            ...(loadout === "ironweave"
              ? { chest: [aetherIronweave] }
              : { arms: [graspOfTheArknight] }),
            hand: [flowstateEmbodimentRed, nimblismRed, fryRed, currentFunnelBlue],
            arsenal: [lightningSurgeRed],
            deck: 8,
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          FAB_MANUAL_HARNESS,
        );
        const Aurora = game.as(auroraLegacyOfTempest);
        const Attacker = game.as(dash);
        const gear = loadout === "ironweave" ? aetherIronweave : graspOfTheArknight;
        const zone = loadout === "ironweave" ? "chest" : "arms";
        Aurora.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Aurora.defendWith(gear);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabCard(Aurora, gear).toBeIn(zone);
        expectFabCard(Aurora, gear).toHaveDefenseCounters(-1);
        Attacker.must.endTurn();
        Aurora.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[1]!);
        game.advanceCombatTo("defend");
        Aurora.defendWith(gear);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabCard(Aurora, gear).toHaveDefenseCounters(-2);
      }
    });
  });
});
