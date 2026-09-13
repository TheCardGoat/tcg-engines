/**
 * Guardian play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { fiddlerSGreenRed } from "../../../../cards/src/cards/blocks/fiddler-s-green.ts";
import { crumbleToEternityBlue } from "../../../../cards/src/cards/actions/crumble-to-eternity.ts";
import { frozenToDeathBlue } from "../../../../cards/src/cards/actions/frozen-to-death.ts";
import { jarlVetreiI } from "../../../../cards/src/cards/heroes/jarl-vetrei-i.ts";
import { boulderDropRed } from "../../../../cards/src/cards/actions/boulder-drop.ts";
import { commandAndConquerRed } from "../../../../cards/src/cards/actions/command-and-conquer.ts";
import { fateForeseenRed } from "../../../../cards/src/cards/defense-reactions/fate-foreseen.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { ironrotPlate } from "../../../../cards/src/cards/equipment/ironrot-plate.ts";
import { bravo } from "../../../../cards/src/cards/heroes/bravo.ts";
import { mangleRed } from "../../../../cards/src/cards/actions/mangle.ts";
import { oakenOldRed } from "../../../../cards/src/cards/actions/oaken-old.ts";
import { autumnSTouchBlue } from "../../../../cards/src/cards/actions/autumn-s-touch.ts";
import { channelLakeFrigidBlue } from "../../../../cards/src/cards/actions/channel-lake-frigid.ts";
import { ballLightningRed } from "../../../../cards/src/cards/actions/ball-lightning.ts";
import { tearAsunderBlue } from "../../../../cards/src/cards/actions/tear-asunder.ts";
import { pulseOfIsenloftBlue } from "../../../../cards/src/cards/defense-reactions/pulse-of-isenloft.ts";
import { heartOfIce } from "../../../../cards/src/cards/equipment/heart-of-ice.ts";
import { rampartOfTheRamSHead } from "../../../../cards/src/cards/equipment/rampart-of-the-ram-s-head.ts";
import { blizzardBlue } from "../../../../cards/src/cards/instants/blizzard.ts";
import { titanSFist } from "../../../../cards/src/cards/weapons/titan-s-fist.ts";
import { cogwerxBaseHead } from "../../../../cards/src/cards/equipment/cogwerx-base-head.ts";
import { cogwerxBaseLegs } from "../../../../cards/src/cards/equipment/cogwerx-base-legs.ts";
import { imposingVisageBlue } from "../../../../cards/src/cards/actions/imposing-visage.ts";
import { stalagmiteBastionOfIsenloft } from "../../../../cards/src/cards/equipment/stalagmite-bastion-of-isenloft.ts";
import { fruitsOfTheForestBlue } from "../../../../cards/src/cards/actions/fruits-of-the-forest.ts";
import { rootboundCarapaceRed } from "../../../../cards/src/cards/defense-reactions/rootbound-carapace.ts";
import { rippleAwayBlue } from "../../../../cards/src/cards/actions/ripple-away.ts";
import { batterToAPulpRed } from "../../../../cards/src/cards/actions/batter-to-a-pulp.ts";
import { channelIcelochGlazeBlue } from "../../../../cards/src/cards/actions/channel-iceloch-glaze.ts";
import { ironrotGauntlet } from "../../../../cards/src/cards/equipment/ironrot-gauntlet.ts";
import { fellingOfTheCrownRed } from "../../../../cards/src/cards/actions/felling-of-the-crown.ts";
import { plowUnderYellow } from "../../../../cards/src/cards/actions/plow-under.ts";
import { everbloomLifeBlue } from "../../../../cards/src/cards/actions/everbloom-life.ts";
import { briar } from "../../../../cards/src/cards/shared/test-recipients.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { nimblismBlue } from "../../../../cards/src/cards/actions/nimblism.ts";
import { staunchResponseRed } from "../../../../cards/src/cards/defense-reactions/staunch-response.ts";
import { sinkBelowRed } from "../../../../cards/src/cards/defense-reactions/sink-below.ts";

import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "../../testing/index.ts";
import { emptyDash, manual } from "./helpers.ts";

describe("Guardian play lines", () => {
  describe("Jarl Vetreiði", () => {
    it("JA-H1 [AAA] Channel then Frozen occupy only the two exposed zones", () => {
      const game = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [mangleRed, channelLakeFrigidBlue, autumnSTouchBlue, frozenToDeathBlue],
          arsenal: [oakenOldRed],
          resourcePoints: 5,
          deck: 8,
        },
        {
          hero: dash,
          hand: [],
          chest: [ironrotPlate],
          arms: [ironrotGauntlet],
          life: 20,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Jarl = game.as(jarlVetreiI);
      const Opponent = game.as(dash);

      Jarl.must.play(channelLakeFrigidBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Opponent.zone("head")).toContain("token:frostbite");

      Jarl.must.play(frozenToDeathBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expect(Opponent.zone("head")).toContain("token:frostbite");
      expect(Opponent.zone("legs")).toContain("token:frostbite");
      expect(Opponent.zone("chest")).not.toContain("token:frostbite");
      expect(Jarl.zone("arsenal")).toEqual([oakenOldRed.canonicalId]);
      Jarl.must.endTurn();
      expectFabPlayer(Jarl).toHaveAP(0).toHaveResourceCount(0);
    });

    it("JA-H2 [AAA] Ice creates no Frostbite when every equipment zone is occupied", () => {
      const occupied = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [mangleRed, channelLakeFrigidBlue, blizzardBlue, frozenToDeathBlue],
          arsenal: [oakenOldRed],
          resourcePoints: 2,
          deck: 8,
        },
        {
          hero: dash,
          hand: [],
          head: [cogwerxBaseHead],
          chest: [ironrotPlate],
          arms: [ironrotGauntlet],
          legs: [cogwerxBaseLegs],
          life: 20,
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      occupied.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      const OccupiedJarl = occupied.as(jarlVetreiI);
      OccupiedJarl.must.play(channelLakeFrigidBlue);
      occupied.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(occupied.as(dash).zone("head")).toEqual([cogwerxBaseHead.canonicalId]);
      expect(
        occupied
          .as(dash)
          .zone("arena")
          .filter((id) => id === "token:frostbite"),
      ).toHaveLength(0);

      const exposed = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [mangleRed, channelLakeFrigidBlue, blizzardBlue, frozenToDeathBlue],
          arsenal: [oakenOldRed],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      exposed.as(jarlVetreiI).must.play(channelLakeFrigidBlue);
      exposed.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(exposed.as(dash).zone("head")).toContain("token:frostbite");
    });

    it("JA-01 [AAA] Channel exposes Frostbite, then Oaken Old fuses and taxes the next action", () => {
      const game = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [oakenOldRed, channelLakeFrigidBlue, blizzardBlue, autumnSTouchBlue],
          arsenal: [mangleRed],
          resourcePoints: 5,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], life: 20, deck: 8 },
        manual,
      );
      const Jarl = game.as(jarlVetreiI);
      const Opponent = game.as(dash);

      Jarl.must.play(channelLakeFrigidBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Opponent.zone("head")).toContain("token:frostbite");

      Jarl.play(oakenOldRed, {
        fuse: true,
        fuseCards: [autumnSTouchBlue, blizzardBlue],
      });
      game.passBoth();
      expect(game.combat()?.activeLink?.attackPower).toBe(9);
      game.advanceCombatTo("defend");
      Opponent.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Opponent).toHaveLife(11).toHaveHandCount(2);
      expect(Jarl.zone("arsenal")).toEqual([mangleRed.canonicalId]);
      Jarl.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Jarl, channelLakeFrigidBlue).toBeIn("graveyard");
      expect(() => Opponent.must.play(snatchRed)).toThrow();
      expect(Opponent.zone("head")).toContain("token:frostbite");
    });
    it("JA-02 [AAA] Channel Iceloch upkeep destroys the aura and Felling hits at printed power", () => {
      const game = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [
            fellingOfTheCrownRed,
            channelIcelochGlazeBlue,
            crumbleToEternityBlue,
            pulseOfIsenloftBlue,
          ],
          arsenal: [plowUnderYellow],
          deck: 8,
        },
        { hero: dash, hand: [], life: 20, deck: 8 },
        manual,
      );
      const Jarl = game.as(jarlVetreiI);
      const Opponent = game.as(dash);

      Jarl.must.play(channelIcelochGlazeBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Jarl, channelIcelochGlazeBlue).toBeIn("arena");
      expect(Opponent.zone("head")).toContain("token:frostbite");

      Jarl.must.pitch(pulseOfIsenloftBlue).playAttack(fellingOfTheCrownRed);
      game.advanceCombatTo("defend");
      Opponent.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Opponent).toHaveLife(16);
      expect(Jarl.zone("arsenal")).toEqual([plowUnderYellow.canonicalId]);
      expectFabCard(Jarl, fellingOfTheCrownRed).toBeIn("graveyard");
      expect(game.renderedPlayerNarrative(Jarl.id)).toEqual([
        "You played Channel Iceloch Glaze.",
        "Opponent created Frostbite.",
        "You played Felling Of The Crown.",
        "You attacked Opponent with Felling Of The Crown.",
        "Felling Of The Crown hit Opponent for 4.",
      ]);
      expect(game.renderedPlayerNarrative(Opponent.id)).toEqual([
        "Opponent played Channel Iceloch Glaze.",
        "You created Frostbite.",
        "Opponent played Felling Of The Crown.",
        "Opponent attacked You with Felling Of The Crown.",
        "Felling Of The Crown hit You for 4.",
      ]);

      Jarl.must.endTurn();
      game.helpers.resolveUntilIdle({ optionalBoolean: false });
      expectFabCard(Jarl, channelIcelochGlazeBlue).toBeIn("graveyard");
    });
    it("JA-03 [AAA] Life face spends no AP and unfused Frozen omits only the fused destroy", () => {
      const game = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [boulderDropRed, everbloomLifeBlue, fruitsOfTheForestBlue, frozenToDeathBlue],
          arsenal: [rootboundCarapaceRed],
          life: 20,
          deck: 8,
        },
        {
          hero: dash,
          hand: [],
          chest: [ironrotPlate],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const Jarl = game.as(jarlVetreiI);
      const Opponent = game.as(dash);

      Jarl.must.playInstant(everbloomLifeBlue, { playMethod: { kind: "face", face: "right" } });
      game.passBoth();
      expectFabPlayer(Jarl).toHaveLife(21).toHaveAP(1);
      expectFabCard(Jarl, everbloomLifeBlue).toBeIn("graveyard");

      expect(() =>
        Jarl.play(frozenToDeathBlue, { fuse: true, fuseCards: [fruitsOfTheForestBlue] }),
      ).toThrow();
      Jarl.must.pitch(fruitsOfTheForestBlue).play(frozenToDeathBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
      expect(Opponent.zone("head")).toContain("token:frostbite");
      expectFabCard(Opponent, ironrotPlate).toBeIn("chest");
      expect(Jarl.zone("arsenal")).toEqual([rootboundCarapaceRed.canonicalId]);
    });
    it("JA-04 [AAA] destroys the defending hero's arsenal only when Command and Conquer hits", () => {
      const game = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [commandAndConquerRed, imposingVisageBlue, rippleAwayBlue, tearAsunderBlue],
          arsenal: [oakenOldRed],
          deck: 8,
        },
        { hero: dash, hand: [], arsenal: [fateForeseenRed], life: 20, deck: 8 },
        manual,
      );
      const Jarl = game.as(jarlVetreiI);
      const Defender = game.as(dash);

      Jarl.must.playAttack(commandAndConquerRed, { pitch: [tearAsunderBlue] });
      game.advanceCombatTo("defend");
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(14);
      expectFabCard(Defender, fateForeseenRed).toBeIn("graveyard");
      expect(Defender.zone("arsenal")).toEqual([]);
      expect(Jarl.zone("arsenal")).toEqual([oakenOldRed.canonicalId]);
      Jarl.must.endTurn();
      expectFabPlayer(Jarl).toHaveAP(0).toHaveResourceCount(0);
    });
    it("JA-05 [AAA] equipment Blade Break and Staunch close a guardian defense chain", () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed],
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [mangleRed, staunchResponseRed, autumnSTouchBlue, channelLakeFrigidBlue],
          arsenal: [crumbleToEternityBlue],
          chest: [ironrotPlate],
          resourcePoints: 2,
          life: 20,
          deck: 8,
        },
        manual,
      );
      const Attacker = game.as(dash);
      const Jarl = game.as(jarlVetreiI);

      Attacker.must.playAttack(snatchRed);
      game.advanceCombatTo("defend");
      Jarl.must.defend(ironrotPlate);
      game.toReaction("defender");
      Jarl.must.playReaction(staunchResponseRed, { modeIndexes: [1] });
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Jarl).toHaveLife(20).toHaveResourceCount(0);
      expectFabCard(Jarl, ironrotPlate).toBeIn("graveyard");
      expectFabCard(Jarl, staunchResponseRed).toBeIn("graveyard");
      expect(Jarl.zone("arsenal")).toEqual([crumbleToEternityBlue.canonicalId]);
      expect(game.combat()).toBeNull();
    });
    it("JA-06 [AAA] Blizzard strips go again this turn and the restriction expires next turn", () => {
      const game = FabTestEngine.start(
        {
          hero: briar,
          hand: [ballLightningRed, ballLightningRed],
          actionPoints: 1,
          resourcePoints: 0,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [fiddlerSGreenRed, blizzardBlue, fruitsOfTheForestBlue, pulseOfIsenloftBlue],
          arsenal: [boulderDropRed],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const Attacker = game.as(briar);
      const Jarl = game.as(jarlVetreiI);

      Attacker.attackWith(Attacker.cardsIn("hand", ballLightningRed)[0]!);
      Jarl.must.defend(fiddlerSGreenRed);
      game.advanceCombatTo("reaction");
      Attacker.pass();
      Jarl.must.playInstant(blizzardBlue);
      game.passBoth();
      game.passBoth();
      // Attacker has 0{r}, so Errata Bulletin #3's pay-escape is unavailable.

      expectCombat(game).notToHaveKeyword("go-again");
      expectFabCard(Jarl, blizzardBlue).toBeIn("graveyard");
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      // Ball Lightning's this-chain +1 replacement matches Lightning-in-types
      // (3{p}+1 − 1{d} = 3; Fiddler's Green GY gains 3{h} → 20).
      expectFabPlayer(Jarl).toHaveLife(20);
      expect(() =>
        Attacker.must.playAttack(Attacker.cardsIn("hand", ballLightningRed)[0]!),
      ).toThrow();

      Attacker.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Jarl.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Attacker.attackWith(Attacker.cardsIn("hand", ballLightningRed)[0]!);
      expectCombat(game).toHaveKeyword("go-again");
    });

    it("JA-E2 [AAA] Heart of Ice taxes opponent cards and Titan's Fist gains +1 after a cost-3+ pitch", () => {
      const game = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [boulderDropRed, autumnSTouchBlue, channelLakeFrigidBlue, fruitsOfTheForestBlue],
          arsenal: [mangleRed],
          chest: [heartOfIce],
          weapon1: [titanSFist],
          pitch: [fruitsOfTheForestBlue],
          resourcePoints: 4,
          deck: 8,
        },
        { hero: dash, hand: [sinkBelowRed], resourcePoints: 0, life: 20, deck: 8 },
        manual,
      );
      const Jarl = game.as(jarlVetreiI);
      const Opponent = game.as(dash);

      Jarl.activate(heartOfIce);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Jarl).toHaveAP(1).toHaveResourceCount(3);

      Jarl.activate(titanSFist);
      game.passBoth();
      expectCombat(game).toHaveAttackPower(4);
      game.advanceCombatTo("reaction");
      expect(() => Opponent.must.playReaction(sinkBelowRed)).toThrow();

      const untaxed = FabTestEngine.start(
        {
          hero: jarlVetreiI,
          hand: [boulderDropRed, autumnSTouchBlue, channelLakeFrigidBlue, fruitsOfTheForestBlue],
          arsenal: [mangleRed],
          chest: [heartOfIce],
          weapon1: [titanSFist],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [], life: 20, deck: 8 },
        manual,
      );
      const UntaxedJarl = untaxed.as(jarlVetreiI);
      UntaxedJarl.activate(titanSFist);
      untaxed.passBoth();
      expectCombat(untaxed).toHaveAttackPower(3);
    });
    it("JA-D1 [AAA] Rootbound decompose banishes 2 Earth plus 1 action or rejects without partial banish", () => {
      const valid = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed],
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed, staunchResponseRed],
          arsenal: [rootboundCarapaceRed],
          graveyard: [autumnSTouchBlue, autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const ValidAttacker = valid.as(dash);
      const ValidJarl = valid.as(jarlVetreiI);
      ValidAttacker.must.playAttack(snatchRed);
      valid.toReaction("defender");
      ValidJarl.must.playFromArsenal(rootboundCarapaceRed);
      valid.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
      expectFabPlayer(ValidJarl).toHaveLife(20);
      expect(ValidJarl.zone("banished")).toHaveLength(3);
      expectFabCard(ValidJarl, rootboundCarapaceRed).toBeIn("graveyard");

      const invalid = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed],
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed, staunchResponseRed],
          arsenal: [rootboundCarapaceRed],
          graveyard: [autumnSTouchBlue, autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const InvalidAttacker = invalid.as(dash);
      const InvalidJarl = invalid.as(jarlVetreiI);
      InvalidAttacker.must.playAttack(snatchRed);
      invalid.toReaction("defender");
      InvalidJarl.must.playFromArsenal(rootboundCarapaceRed);
      invalid.advanceToDecision(InvalidJarl, "boolean");
      InvalidJarl.accept();
      // 2 Earth + 1 Action (Channel) is a determined legal set (CR 1.8.6c).
      // Sink Below is a Defense Reaction, not part of that set.
      expect(
        InvalidJarl.zone("graveyard").filter((id) => id === autumnSTouchBlue.canonicalId),
      ).toHaveLength(0);
      expect(
        InvalidJarl.zone("banished").filter((id) => id === autumnSTouchBlue.canonicalId),
      ).toHaveLength(2);
      expect(InvalidJarl.zone("banished")).toContain(channelLakeFrigidBlue.canonicalId);
      expect(InvalidJarl.zone("graveyard")).toContain(sinkBelowRed.canonicalId);
      expect(InvalidJarl.zone("banished")).toHaveLength(3);
    });
    it("JA-D2 [AAA] Staunch +3 defense only after the optional 4{r} and pitch returns at end phase", () => {
      const paid = FabTestEngine.start(
        {
          hero: bravo,
          hand: [batterToAPulpRed],
          resourcePoints: 6,
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [staunchResponseRed, sinkBelowRed, autumnSTouchBlue, pulseOfIsenloftBlue],
          arsenal: [rootboundCarapaceRed],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const PaidAttacker = paid.as(bravo);
      const PaidJarl = paid.as(jarlVetreiI);
      PaidAttacker.must.playAttack(batterToAPulpRed);
      paid.toReaction("defender");
      PaidJarl.must.playReaction(staunchResponseRed, {
        pitch: [pulseOfIsenloftBlue, autumnSTouchBlue],
        modeIndexes: [0],
      });
      paid.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(PaidJarl).toHaveLife(20);
      PaidAttacker.must.endTurn();
      paid.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(PaidJarl.zone("pitch")).toEqual([]);

      const base = FabTestEngine.start(
        {
          hero: bravo,
          hand: [batterToAPulpRed],
          resourcePoints: 6,
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [staunchResponseRed, sinkBelowRed, autumnSTouchBlue, pulseOfIsenloftBlue],
          arsenal: [rootboundCarapaceRed],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const BaseAttacker = base.as(bravo);
      const BaseJarl = base.as(jarlVetreiI);
      BaseAttacker.must.playAttack(batterToAPulpRed);
      base.toReaction("defender");
      BaseJarl.must
        .pitch(pulseOfIsenloftBlue)
        .playReaction(staunchResponseRed, { modeIndexes: [1] });
      base.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(BaseJarl).toHaveLife(17);
      expect(BaseJarl.resourcePoints()).toBeGreaterThan(0);
      BaseAttacker.must.endTurn();
      base.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(BaseJarl.zone("pitch")).toEqual([]);
    });
    it("JA-D3 [AAA] Pulse +1{d} applies to Earth/Ice actions this turn, not Sink Below or next turn", () => {
      const game = FabTestEngine.start(
        {
          hero: bravo,
          hand: [snatchRed, batterToAPulpRed, nimblismBlue, nimblismBlue, snatchRed],
          actionPoints: 2,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [pulseOfIsenloftBlue, autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed],
          arsenal: [rootboundCarapaceRed],
          resourcePoints: 2,
          life: 20,
          deck: 8,
        },
        manual,
      );
      const Attacker = game.as(bravo);
      const Jarl = game.as(jarlVetreiI);

      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.toReaction("defender");
      Jarl.must.playReaction(pulseOfIsenloftBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Jarl).toHaveLife(20);

      Attacker.must.pitch(nimblismBlue, nimblismBlue).playAttack(batterToAPulpRed);
      game.advanceCombatTo("defend");
      Jarl.must.defend(autumnSTouchBlue);
      game.toReaction("defender");
      Jarl.must.playReaction(sinkBelowRed);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      // 10 − (Autumn 3+1) − Sink 4 = 2; if Sink also gained +1 this would be 1.
      expectFabPlayer(Jarl).toHaveLife(18);

      Attacker.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Jarl.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Jarl.must.defend(channelLakeFrigidBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Jarl).toHaveLife(17);
    });
    it("JA-D4 [AAA] Blizzard (Errata Bulletin #3) keeps go again only if the attacker pays {r}{r}", () => {
      const paid = FabTestEngine.start(
        {
          hero: briar,
          hand: [ballLightningRed, ballLightningRed],
          resourcePoints: 2,
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [blizzardBlue, autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed],
          arsenal: [rootboundCarapaceRed],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const PaidAttacker = paid.as(briar);
      const PaidJarl = paid.as(jarlVetreiI);
      PaidAttacker.attackWith(PaidAttacker.cardsIn("hand", ballLightningRed)[0]!);
      paid.advanceCombatTo("reaction");
      PaidAttacker.pass();
      PaidJarl.must.playInstant(blizzardBlue);
      paid.advanceToDecision(PaidAttacker, "boolean");
      PaidAttacker.chooseBoolean(true);
      expectCombat(paid).toHaveKeyword("go-again");
      expectFabPlayer(PaidAttacker).toHaveResourceCount(0);

      const declined = FabTestEngine.start(
        {
          hero: briar,
          hand: [ballLightningRed, ballLightningRed],
          resourcePoints: 2,
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [blizzardBlue, autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed],
          arsenal: [rootboundCarapaceRed],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const DeclinedAttacker = declined.as(briar);
      const DeclinedJarl = declined.as(jarlVetreiI);
      DeclinedAttacker.attackWith(DeclinedAttacker.cardsIn("hand", ballLightningRed)[0]!);
      declined.advanceCombatTo("reaction");
      DeclinedAttacker.pass();
      DeclinedJarl.must.playInstant(blizzardBlue);
      declined.advanceToDecision(DeclinedAttacker, "boolean");
      DeclinedAttacker.chooseBoolean(false);
      expectCombat(declined).notToHaveKeyword("go-again");
      declined.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expect(() =>
        DeclinedAttacker.must.playAttack(DeclinedAttacker.cardsIn("hand", ballLightningRed)[0]!),
      ).toThrow();
    });
    it("JA-D5 [AAA] Stalagmite Frostbites the attacker and Rampart offers an independent {r} payment each link", () => {
      const frost = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed],
          actionPoints: 1,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed, rootboundCarapaceRed],
          arsenal: [staunchResponseRed],
          weapon2: [stalagmiteBastionOfIsenloft],
          life: 20,
          deck: 8,
        },
        manual,
      );
      const FrostAttacker = frost.as(dash);
      const FrostJarl = frost.as(jarlVetreiI);
      FrostAttacker.must.playAttack(snatchRed);
      frost.advanceCombatTo("defend");
      FrostJarl.must.defend(stalagmiteBastionOfIsenloft);
      frost.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(FrostAttacker.zone("arena")).toContain("token:frostbite");
      expect(FrostJarl.zone("arena")).not.toContain("token:frostbite");
      expectFabPlayer(FrostJarl).toHaveLife(18);

      const rampart = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed, snatchRed],
          actionPoints: 2,
          deck: 8,
        },
        {
          hero: jarlVetreiI,
          hand: [autumnSTouchBlue, channelLakeFrigidBlue, sinkBelowRed, rootboundCarapaceRed],
          arsenal: [staunchResponseRed],
          weapon2: [rampartOfTheRamSHead],
          resourcePoints: 2,
          life: 20,
          deck: 8,
        },
        manual,
      );
      const RampartAttacker = rampart.as(dash);
      const RampartJarl = rampart.as(jarlVetreiI);
      RampartAttacker.must.playAttack(RampartAttacker.cardsIn("hand", snatchRed)[0]!);
      rampart.advanceCombatTo("defend");
      RampartJarl.must.defend(rampartOfTheRamSHead);
      rampart.helpers.resolveUntilIdle({ optionalBoolean: true });
      expectFabCard(RampartJarl, rampartOfTheRamSHead).toHaveDefense(1);
      expectFabPlayer(RampartJarl).toHaveResourceCount(1).toHaveLife(17);

      RampartAttacker.must.playAttack(RampartAttacker.cardsIn("hand", snatchRed)[0]!);
      rampart.advanceCombatTo("defend");
      RampartJarl.must.defend(rampartOfTheRamSHead);
      rampart.helpers.resolveUntilIdle({ optionalBoolean: true });
      expectFabCard(RampartJarl, rampartOfTheRamSHead).toHaveDefense(2);
      expectFabPlayer(RampartJarl).toHaveResourceCount(0).toHaveLife(15);
    });
  });
});
