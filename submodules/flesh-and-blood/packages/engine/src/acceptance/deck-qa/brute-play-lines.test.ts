/**
 * Brute play lines from the tournament-deck QA inventory.
 *
 * Green Rhinar/Tuffnut full-turn cases live together so the class inventory
 * can be read in one file.
 */
import { describe, expect, it } from "vitest";

import { commandAndConquerRed } from "../../../../cards/src/cards/actions/command-and-conquer.ts";
import { volticBoltRed } from "../../../../cards/src/cards/actions/voltic-bolt.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { eyeOfOphidiaBlue } from "../../../../cards/src/cards/resources/eye-of-ophidia.ts";
import { savageSash } from "../../../../cards/src/cards/equipment/savage-sash.ts";
import { battlefrontBastionBlue } from "../../../../cards/src/cards/actions/battlefront-bastion.ts";
import { alphaInstinctBlue } from "../../../../cards/src/cards/actions/alpha-instinct.ts";
import { skullhorn } from "../../../../cards/src/cards/equipment/skullhorn.ts";
import { beastWithinYellow } from "../../../../cards/src/cards/actions/beast-within.ts";
import { scowlingFleshBag } from "../../../../cards/src/cards/equipment/scowling-flesh-bag.ts";
import { beatenTrackers } from "../../../../cards/src/cards/equipment/beaten-trackers.ts";
import { rok } from "../../../../cards/src/cards/weapons/rok.ts";
import { swingBigRed } from "../../../../cards/src/cards/actions/swing-big.ts";
import { bareFangsRed } from "../../../../cards/src/cards/actions/bare-fangs.ts";
import { wildRideRed } from "../../../../cards/src/cards/actions/wild-ride.ts";
import { battlefrontBastionYellow } from "../../../../cards/src/cards/actions/battlefront-bastion.ts";
import { blazeFiremind } from "../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { thickHideHunterYellow } from "../../../../cards/src/cards/actions/thick-hide-hunter.ts";
import { sendPackingYellow } from "../../../../cards/src/cards/actions/send-packing.ts";
import { monstrousVeil } from "../../../../cards/src/cards/equipment/monstrous-veil.ts";
import { ravenousMeataxe } from "../../../../cards/src/cards/weapons/ravenous-meataxe.ts";
import { tearLimbFromLimbBlue } from "../../../../cards/src/cards/actions/tear-limb-from-limb.ts";
import { pulpingRed } from "../../../../cards/src/cards/actions/pulping.ts";
import { aggressivePounceRed } from "../../../../cards/src/cards/actions/aggressive-pounce.ts";
import { toughAsARokBlue } from "../../../../cards/src/cards/actions/tough-as-a-rok.ts";
import { hulkUpBlue } from "../../../../cards/src/cards/actions/hulk-up.ts";
import { rockyardRodeoBlue } from "../../../../cards/src/cards/actions/rockyard-rodeo.ts";
import { skeraStrapping } from "../../../../cards/src/cards/equipment/skera-strapping.ts";
import { comebackKicks } from "../../../../cards/src/cards/equipment/comeback-kicks.ts";
import { pilferTheTombBlue } from "../../../../cards/src/cards/instants/pilfer-the-tomb.ts";
import { savageFeastRed } from "../../../../cards/src/cards/actions/savage-feast.ts";
import { wreckerRompBlue } from "../../../../cards/src/cards/actions/wrecker-romp.ts";
import { rhinarRecklessRampage } from "../../../../cards/src/cards/heroes/rhinar-reckless-rampage.ts";
import { splatterSkullRed } from "../../../../cards/src/cards/actions/splatter-skull.ts";
import { goodNaturedBrutalityYellow } from "../../../../cards/src/cards/actions/good-natured-brutality.ts";
import { jawsOfVictoryRed } from "../../../../cards/src/cards/actions/jaws-of-victory.ts";
import { windUpTheCrowdBlue } from "../../../../cards/src/cards/actions/wind-up-the-crowd.ts";
import { crowdGoesWildYellow } from "../../../../cards/src/cards/actions/crowd-goes-wild.ts";
import { noHeroStandsAloneYellow } from "../../../../cards/src/cards/actions/no-hero-stands-alone.ts";
import { digInYellow } from "../../../../cards/src/cards/actions/dig-in.ts";
import { toughSmashupYellow } from "../../../../cards/src/cards/actions/tough-smashup.ts";
import { recklessStampedeRed } from "../../../../cards/src/cards/actions/reckless-stampede.ts";
import { showOfStrengthRed } from "../../../../cards/src/cards/actions/show-of-strength.ts";
import { songOfSinewYellow } from "../../../../cards/src/cards/actions/song-of-sinew.ts";
import { strongestSurviveYellow } from "../../../../cards/src/cards/actions/strongest-survive.ts";
import { buckwildRed } from "../../../../cards/src/cards/actions/buckwild.ts";
import { buckwildYellow } from "../../../../cards/src/cards/actions/buckwild.ts";
import { unexpectedBackhandYellow } from "../../../../cards/src/cards/actions/unexpected-backhand.ts";
import { vigorousSmashupRed } from "../../../../cards/src/cards/actions/vigorous-smashup.ts";
import { vigorousSmashupBlue } from "../../../../cards/src/cards/actions/vigorous-smashup.ts";
import { gauntletsOfTyrannicalRex } from "../../../../cards/src/cards/equipment/gauntlets-of-tyrannical-rex.ts";
import { tuffnut } from "../../../../cards/src/cards/heroes/tuffnut.ts";
import { eraseFaceRed } from "../../../../cards/src/cards/actions/erase-face.ts";
import { crownOfProvidence } from "../../../../cards/src/cards/equipment/crown-of-providence.ts";
import { bloodrushBellowYellow } from "../../../../cards/src/cards/actions/bloodrush-bellow.ts";
import { sandSketchedPlanBlue } from "../../../../cards/src/cards/actions/sand-sketched-plan.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { recklessSwingBlue } from "../../../../cards/src/cards/defense-reactions/reckless-swing.ts";
import { scabskinLeathers } from "../../../../cards/src/cards/equipment/scabskin-leathers.ts";
import { sigilOfSolaceRed } from "../../../../cards/src/cards/instants/sigil-of-solace.ts";
import { crackedBaubleYellow } from "../../../../cards/src/cards/resources/cracked-bauble.ts";

import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "../../testing/index.ts";
import { emptyDash, toDefend, missBlockAndClose, sixPowerDeck, manual } from "./helpers.ts";

describe("Brute play lines", () => {
  describe("Rhinar, Reckless Rampage", () => {
    it("RH-01 [AAA] Bloodrush 6+ then Pulping from arsenal", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          hand: [bloodrushBellowYellow, swingBigRed, eyeOfOphidiaBlue, wreckerRompBlue],
          arsenal: [pulpingRed],
          resourcePoints: 3,
          deck: [
            beastWithinYellow,
            beastWithinYellow,
            beastWithinYellow,
            beastWithinYellow,
            beastWithinYellow,
            beastWithinYellow,
            beastWithinYellow,
            beastWithinYellow,
          ],
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        { ...FAB_MANUAL_HARNESS, seed: "rh-h1-4" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Defender = game.as(dash);

      Rhinar.must.play(bloodrushBellowYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Rhinar).toHaveAP(1).toHaveResourceCount(2);
      expectFabPlayer(Defender).toHaveHandCount(3);

      Rhinar.must.playFromArsenal(pulpingRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabPlayer(Defender).toHaveLife(12);
      expectFabCard(Rhinar, pulpingRed).toBeIn("graveyard");
      expect(Rhinar.zone("arsenal")).toEqual([]);
      Rhinar.endTurnWithArsenal(swingBigRed);
      expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("RH-H2 [AAA] Meataxe gains +2 only after a 6+ random discard", () => {
      const six = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          weapon1: [ravenousMeataxe],
          hand: [swingBigRed, beastWithinYellow, wreckerRompBlue, pulpingRed],
          arsenal: [pulpingRed],
          resourcePoints: 2,
          deck: sixPowerDeck(),
        },
        emptyDash,
        { ...FAB_MANUAL_HARNESS, seed: "rh-h2-6" },
      );
      const Rhinar = six.as(rhinarRecklessRampage);
      Rhinar.activate(ravenousMeataxe);
      six.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(six.as(dash)).toHaveLife(15);

      const sub = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          weapon1: [ravenousMeataxe],
          hand: [sandSketchedPlanBlue, eyeOfOphidiaBlue, eyeOfOphidiaBlue, eyeOfOphidiaBlue],
          arsenal: [pulpingRed],
          resourcePoints: 2,
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
        emptyDash,
        { ...FAB_MANUAL_HARNESS, seed: "rh-h2-sub" },
      );
      sub.as(rhinarRecklessRampage).activate(ravenousMeataxe);
      sub.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(sub.as(dash)).toHaveLife(17);
    });

    it("RH-H3 [AAA] Splatter Skull bins the intimidate card so it does not return", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          hand: [splatterSkullRed, beastWithinYellow, bloodrushBellowYellow, swingBigRed],
          arsenal: [pulpingRed],
          resourcePoints: 3,
          deck: sixPowerDeck(),
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        { ...FAB_MANUAL_HARNESS, seed: "rh-h3" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Defender = game.as(dash);
      Rhinar.must.play(bloodrushBellowYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Defender.zone("banished").length).toBeGreaterThan(0);

      Rhinar.must.playAttack(splatterSkullRed);
      toDefend(game);
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expect(Defender.zone("graveyard")).toContain(snatchRed.canonicalId);
      Rhinar.must.endTurn();
      expect(Defender.zone("banished")).toEqual([]);
      expectFabPlayer(Rhinar).toHaveAP(0).toHaveResourceCount(0);
    });

    it("RH-02 [AAA] each intimidate owns its own face-down return", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          hand: [pulpingRed, savageFeastRed, beastWithinYellow, alphaInstinctBlue],
          arsenal: [recklessStampedeRed],
          resourcePoints: 3,
          actionPoints: 2,
          deck: sixPowerDeck(),
        },
        {
          hero: dash,
          hand: [snatchRed, commandAndConquerRed, eyeOfOphidiaBlue, wreckerRompBlue],
          deck: 8,
        },
        { ...manual, seed: "rh-02" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Defender = game.as(dash);

      Rhinar.must.playAttack(pulpingRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      const firstBanished = Defender.zone("banished");
      expect(firstBanished).toHaveLength(1);
      expect(Defender.zone("banished")).toEqual(firstBanished);

      Rhinar.must.playAttack(savageFeastRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      const bothBanished = Defender.zone("banished");
      expect(bothBanished).toHaveLength(2);
      expect(bothBanished).toEqual(expect.arrayContaining(firstBanished));

      expect(Rhinar.zone("arsenal")).toEqual([recklessStampedeRed.canonicalId]);
      Rhinar.must.endTurn();
      expect(Defender.zone("banished")).toEqual([]);
      expectFabPlayer(Defender).toHaveHandCount(4);
      expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("RH-03 [AAA] Bare Fangs and Pounce pay off only after a 6+ discard", () => {
      const startBranch = (seed: string, deckTop: typeof wreckerRompBlue) =>
        FabTestEngine.start(
          {
            hero: rhinarRecklessRampage,
            hand: [bareFangsRed, aggressivePounceRed, buckwildYellow, wreckerRompBlue],
            arsenal: [showOfStrengthRed],
            resourcePoints: 4,
            actionPoints: 2,
            deck: [
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              deckTop,
            ],
          },
          { hero: dash, hand: [snatchRed, wreckerRompBlue], deck: 8 },
          { ...manual, seed },
        );

      const high = startBranch("rh-03-6", wreckerRompBlue);
      const HighRhinar = high.as(rhinarRecklessRampage);
      const HighDefender = high.as(dash);
      HighRhinar.playAttack(bareFangsRed, { stopAt: "on-attack" });
      high.advanceUntil({ stopAt: "defend" });
      expectCombat(high).toHaveAttackPower(8);
      expect(HighDefender.zone("banished")).toHaveLength(1);
      HighDefender.must.defend();
      high.helpers.resolveRestOfCombat();
      expectFabPlayer(HighDefender).toHaveLife(12);

      HighRhinar.must.playAttack(aggressivePounceRed);
      toDefend(high);
      expectCombat(high).toHaveKeyword("go-again");
      HighDefender.must.defend();
      high.helpers.resolveRestOfCombat();
      expect(HighRhinar.zone("arsenal")).toEqual([showOfStrengthRed.canonicalId]);
      HighRhinar.must.endTurn();
      expectFabPlayer(HighRhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const low = startBranch("rh-03-sub", snatchRed);
      const LowRhinar = low.as(rhinarRecklessRampage);
      const LowDefender = low.as(dash);
      LowRhinar.playAttack(bareFangsRed, { stopAt: "on-attack" });
      low.advanceUntil({ stopAt: "defend" });
      expectCombat(low).toHaveAttackPower(6);
      expect(LowDefender.zone("banished")).toHaveLength(0);
      LowDefender.must.defend();
      low.helpers.resolveRestOfCombat();
      expect(() => LowRhinar.must.playAttack(aggressivePounceRed)).not.toThrow();
      toDefend(low);
      expectCombat(low).notToHaveKeyword("go-again");
      LowDefender.must.defend();
      low.helpers.resolveRestOfCombat();
      expectFabPlayer(LowRhinar).toHaveAP(0);
    });

    it("RH-04 [AAA] Command and Conquer bins arsenal and blocks the defense reaction", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          hand: [commandAndConquerRed, eraseFaceRed, sendPackingYellow, recklessSwingBlue],
          arsenal: [wildRideRed],
          resourcePoints: 2,
          deck: sixPowerDeck(),
        },
        {
          hero: dash,
          hand: [recklessSwingBlue, snatchRed, snatchRed, snatchRed],
          arsenal: [snatchRed],
          deck: 8,
        },
        { ...manual, seed: "rh-04" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Defender = game.as(dash);

      Rhinar.must.playAttack(commandAndConquerRed);
      toDefend(game);
      Defender.must.defend();
      game.advanceCombatTo("reaction");
      expect(() => Defender.must.playReaction(recklessSwingBlue)).toThrow();
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expect(Defender.zone("arsenal")).toEqual([]);
      expect(Defender.zone("graveyard")).toContain(snatchRed.canonicalId);
      expect(Rhinar.zone("arsenal")).toEqual([wildRideRed.canonicalId]);
      expectFabCard(Rhinar, eraseFaceRed).toBeIn("hand");
      expectFabCard(Rhinar, sendPackingYellow).toBeIn("hand");
      Rhinar.must.endTurn();
      expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("RH-05 [AAA] Tear Limb plus Scabskin and Smashup complete the equipment turn", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          legs: [scabskinLeathers],
          hand: [splatterSkullRed, tearLimbFromLimbBlue, strongestSurviveYellow, eyeOfOphidiaBlue],
          arsenal: [vigorousSmashupRed],
          resourcePoints: 5,
          deck: sixPowerDeck(),
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        { ...manual, seed: "rh-05" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Defender = game.as(dash);
      const legsId = Rhinar.findCardInZone("legs", scabskinLeathers);

      Rhinar.must.activate(scabskinLeathers);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      const roll = game
        .committedEvents()
        .find((event) => event.name === "roll" && "result" in event.data);
      const face = roll?.name === "roll" ? roll.data.result : 0;
      expectFabPlayer(Rhinar).toHaveAP(Math.floor(face / 2));

      Rhinar.must.play(tearLimbFromLimbBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Rhinar, tearLimbFromLimbBlue).toBeIn("graveyard");

      Rhinar.must.playFromArsenal(vigorousSmashupRed);
      toDefend(game);
      Defender.must.defend();
      game.helpers.resolveRestOfCombat();
      expectFabCard(Rhinar, vigorousSmashupRed).toBeIn("graveyard");
      expect(Rhinar.zone("arsenal")).toEqual([]);

      Rhinar.must.endTurn();
      expect(game.objectState(legsId)?.defenseCounterTotal ?? 0).toBe(0);
      expectFabCard(Rhinar, scabskinLeathers).toBeIn("legs");
      expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("RH-H1 [AAA] resolves Bloodrush's seeded 6+ and sub-6 full-turn branches", () => {
      const startBranch = (seed: string) =>
        FabTestEngine.start(
          {
            hero: rhinarRecklessRampage,
            hand: [swingBigRed, bloodrushBellowYellow, eyeOfOphidiaBlue, beastWithinYellow],
            arsenal: [pulpingRed],
            resourcePoints: 3,
            // 6+ on top so Beast Within's GY trigger returns after one mill
            // (CR put-into-graveyard from hand) and Bloodrush can still draw 2.
            deck: [
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
            ],
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          { ...manual, seed },
        );

      const high = startBranch("rh-h1-4");
      const HighRhinar = high.as(rhinarRecklessRampage);
      const HighDefender = high.as(dash);

      HighRhinar.must.play(bloodrushBellowYellow);
      high.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(HighRhinar, beastWithinYellow).toBeIn("graveyard");
      expectFabPlayer(HighRhinar).toHaveHandCount(5).toHaveAP(1).toHaveResourceCount(2);
      expectFabPlayer(HighDefender).toHaveHandCount(3);

      HighRhinar.must.playAttack(swingBigRed);
      high.advanceCombatTo("defend");
      HighDefender.must.defend();
      expect(high.combat()?.activeLink?.attackPower).toBe(10);
      high.helpers.resolveRestOfCombat();
      expectFabPlayer(HighDefender).toHaveLife(10);
      expect(HighRhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
      HighRhinar.must.endTurn();
      expectFabPlayer(HighRhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      expectFabPlayer(HighDefender).toHaveHandCount(4);

      const low = startBranch("rh-h1-7");
      const LowRhinar = low.as(rhinarRecklessRampage);
      const LowDefender = low.as(dash);

      LowRhinar.must.play(bloodrushBellowYellow);
      low.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(LowRhinar, eyeOfOphidiaBlue).toBeIn("graveyard");
      expectFabPlayer(LowRhinar).toHaveHandCount(2).toHaveAP(0).toHaveResourceCount(2);
      expectFabPlayer(LowDefender).toHaveHandCount(4);
      expect(() => LowRhinar.must.playAttack(swingBigRed)).toThrow();
      expect(LowRhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
      LowRhinar.must.endTurn();
      expectFabPlayer(LowRhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("RH-E1 [AAA] Veil and Trackers fire on random 6+ discards", () => {
      const veil = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          head: [monstrousVeil],
          hand: [swingBigRed, beastWithinYellow, wreckerRompBlue, pulpingRed],
          arsenal: [savageFeastRed],
          deck: sixPowerDeck(),
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        { ...manual, seed: "rh-e1-veil" },
      );
      const VeilRhinar = veil.as(rhinarRecklessRampage);
      const VeilDefender = veil.as(dash);
      VeilRhinar.must.activate(monstrousVeil);
      veil.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(VeilRhinar, monstrousVeil).toBeIn("graveyard");
      expect(VeilDefender.zone("banished")).toHaveLength(1);
      expectFabPlayer(VeilRhinar).toHaveAP(1);
      expect(VeilRhinar.zone("arsenal")).toEqual([savageFeastRed.canonicalId]);
      VeilRhinar.must.endTurn();
      expect(VeilDefender.zone("banished")).toEqual([]);
      expectFabPlayer(VeilRhinar).toHaveAP(0).toHaveResourceCount(0);

      const trackers = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          legs: [beatenTrackers],
          hand: [swingBigRed, beastWithinYellow, wreckerRompBlue, pulpingRed],
          arsenal: [savageFeastRed],
          resourcePoints: 2,
          deck: sixPowerDeck(),
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        { ...manual, seed: "rh-e1-trackers" },
      );
      const TrackRhinar = trackers.as(rhinarRecklessRampage);
      TrackRhinar.must.playAttack(wreckerRompBlue);
      trackers.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: true,
        entityTargets: "minimum",
      });
      expectFabCard(TrackRhinar, beatenTrackers).toBeIn("graveyard");
      expectFabPlayer(TrackRhinar).toHaveAP(1);
      expect(trackers.as(dash).zone("banished")).toHaveLength(1);
      TrackRhinar.must.endTurn();
      expectFabPlayer(TrackRhinar).toHaveAP(0).toHaveResourceCount(0);
    });

    it("RH-E2 [AAA] Gauntlets +1 and Sash −1{r} apply independently", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          arms: [gauntletsOfTyrannicalRex],
          chest: [savageSash],
          hand: [swingBigRed, beastWithinYellow, wreckerRompBlue, pulpingRed],
          arsenal: [savageFeastRed],
          resourcePoints: 0,
          actionPoints: 2,
          deck: sixPowerDeck(),
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Defender = game.as(dash);

      Rhinar.must.activate(savageSash);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Rhinar, savageSash).toBeIn("graveyard");
      expectFabPlayer(Rhinar).toHaveAP(2);

      Rhinar.must.pitch(wreckerRompBlue).playAttack(swingBigRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(8);
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(12);
      expect(Rhinar.zone("pitch")).toContain(wreckerRompBlue.canonicalId);

      Rhinar.must.activate(gauntletsOfTyrannicalRex);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Rhinar, gauntletsOfTyrannicalRex).toBeTapped();

      Rhinar.must.playAttack(pulpingRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Rhinar, pulpingRed).toBeIn("graveyard");
      expect(Rhinar.zone("arsenal")).toEqual([savageFeastRed.canonicalId]);
      Rhinar.must.endTurn();
      expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("RH-E2 boundary: Savage Sash cannot be activated during combat Resolution", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          chest: [savageSash],
          legs: [beatenTrackers],
          hand: [pulpingRed, bareFangsRed],
          resourcePoints: 2,
          deck: sixPowerDeck(),
        },
        emptyDash,
        { ...manual, seed: "rh-e2-resolution-timing" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);

      Rhinar.playAttack(pulpingRed, { stopAt: "on-attack" });
      game.advanceUntil({ stopAt: "resolution", optionals: "accept", ordering: "listed" });

      expectCombat(game).toBeAtStep("resolution");
      expectFabCard(Rhinar, beatenTrackers).toBeIn("graveyard");
      expectFabPlayer(Rhinar).toHaveAP(2);
      expect(() => Rhinar.activate(savageSash)).toThrow(/timing|legal|current/i);
      expectFabCard(Rhinar, savageSash).toBeIn("chest");
    });

    it("RH-E3 [AAA] Scabskin AP is floor(roll/2) once per turn, Battleworn does not reroll", () => {
      for (const seed of [
        "rh-e3-1",
        "rh-e3-2",
        "rh-e3-3",
        "rh-e3-4",
        "rh-e3-5",
        "rh-e3-6",
      ] as const) {
        const game = FabTestEngine.start(
          {
            hero: rhinarRecklessRampage,
            legs: [scabskinLeathers],
            hand: [swingBigRed, beastWithinYellow, wreckerRompBlue, pulpingRed],
            arsenal: [savageFeastRed],
            deck: sixPowerDeck(),
          },
          emptyDash,
          { ...manual, seed },
        );
        const Rhinar = game.as(rhinarRecklessRampage);
        Rhinar.must.activate(scabskinLeathers);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        const roll = game.committedEvents().find((event) => event.name === "roll");
        const face = roll?.name === "roll" ? roll.data.result : 0;
        expect(face).toBeGreaterThanOrEqual(1);
        expect(face).toBeLessThanOrEqual(6);
        expectFabPlayer(Rhinar).toHaveAP(Math.floor(face / 2));
        Rhinar.expectActivationRejected(scabskinLeathers);
        expect(Rhinar.zone("arsenal")).toEqual([savageFeastRed.canonicalId]);
        Rhinar.must.endTurn();
        expectFabPlayer(Rhinar).toHaveAP(0).toHaveResourceCount(0);
      }

      const defend = FabTestEngine.start(
        { hero: dash, hand: [snatchRed], deck: 8 },
        {
          hero: rhinarRecklessRampage,
          life: 40,
          legs: [scabskinLeathers],
          hand: [swingBigRed, beastWithinYellow, wreckerRompBlue, pulpingRed],
          arsenal: [savageFeastRed],
          deck: sixPowerDeck(),
        },
        { ...manual, firstPlayer: dash, seed: "rh-e3-def" },
      );
      const Rhinar = defend.as(rhinarRecklessRampage);
      const legsId = Rhinar.findCardInZone("legs", scabskinLeathers);
      defend.as(dash).must.playAttack(snatchRed);
      defend.advanceCombatTo("defend");
      Rhinar.defendWith(scabskinLeathers);
      defend.helpers.resolveRestOfCombat();
      expectFabCard(Rhinar, scabskinLeathers).toBeIn("legs");
      expect(defend.objectState(legsId).defenseCounterTotal).toBe(-1);
      expect(defend.committedEvents().filter((event) => event.name === "roll")).toHaveLength(0);
    });
    it("RH-D1 [AAA] Reckless Swing randomly discards a 6+ card and deals 2 on defense", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          hand: [recklessSwingBlue, beastWithinYellow, wreckerRompBlue, swingBigRed],
          arsenal: [pulpingRed],
          deck: [
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
          ],
        },
        { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
        { ...manual, seed: "rh-d1-5" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Attacker = game.as(dash);

      Rhinar.must.endTurn();
      const rhinarNarrativeStart = game.renderedPlayerNarrative(Rhinar.id).length;
      const attackerNarrativeStart = game.renderedPlayerNarrative(Attacker.id).length;
      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Rhinar.must.defend();
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Rhinar);
      Rhinar.must.playReaction(recklessSwingBlue);
      game.helpers.resolveRestOfCombat();

      expectFabCard(Rhinar, recklessSwingBlue).toBeIn("graveyard");
      expectFabCard(Rhinar, beastWithinYellow).toBeIn("graveyard");
      expectFabPlayer(Rhinar).toHaveLife(39);
      expectFabPlayer(Attacker).toHaveLife(18).toHaveHandCount(3);
      expect(Rhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
      expect(Attacker.zone("banished")).toHaveLength(0);
      const discard = game
        .committedEvents()
        .find((event) => event.name === "discard" && event.data.playerId === Rhinar.id);
      expect(discard?.name === "discard" && discard.data.random).toBe(true);
      expect(discard?.name === "discard" && discard.data.object.canonicalId).toBe(
        beastWithinYellow.canonicalId,
      );
      expect(game.renderedPlayerNarrative(Rhinar.id).slice(rhinarNarrativeStart)).toEqual([
        "Opponent played Snatch.",
        "Opponent attacked You with Snatch.",
        "You discarded Beast Within at random.",
        "You played Reckless Swing.",
        "You banished Wrecker Romp.",
        "You lost 1 life.",
        "You defended with Reckless Swing.",
        "Opponent took 2 generic damage from Reckless Swing.",
        "Snatch was blocked by You.",
      ]);
      expect(game.renderedPlayerNarrative(Attacker.id).slice(attackerNarrativeStart)).toEqual([
        "You played Snatch.",
        "You attacked Opponent with Snatch.",
        "Opponent discarded Beast Within at random.",
        "Opponent played Reckless Swing.",
        "Opponent banished Wrecker Romp.",
        "Opponent lost 1 life.",
        "Opponent defended with Reckless Swing.",
        "You took 2 generic damage from Reckless Swing.",
        "Snatch was blocked by Opponent.",
      ]);

      Attacker.must.endTurn();
      Rhinar.must.endTurn();
      expectFabPlayer(Rhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("RH-D2 [AAA] Thick Hide Hunter triggers Rhinar only during Rhinar's action phase", () => {
      const startBranch = (seed: string) =>
        FabTestEngine.start(
          {
            hero: rhinarRecklessRampage,
            hand: [thickHideHunterYellow, beastWithinYellow, wreckerRompBlue, swingBigRed],
            arsenal: [pulpingRed],
            resourcePoints: 2,
            deck: [
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
              wreckerRompBlue,
            ],
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          { ...manual, seed },
        );

      const defending = startBranch("rh-d1-5");
      const DefendingRhinar = defending.as(rhinarRecklessRampage);
      const Attacker = defending.as(dash);
      DefendingRhinar.must.endTurn();
      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      defending.advanceCombatTo("defend");
      DefendingRhinar.must.defend(thickHideHunterYellow);
      defending.helpers.resolveUntilIdle({ ordering: "listed" });
      defending.helpers.resolveRestOfCombat();
      const defendingDiscard = defending
        .committedEvents()
        .find((event) => event.name === "discard" && event.data.playerId === DefendingRhinar.id);

      expect(defendingDiscard?.name === "discard" && defendingDiscard.data.random).toBe(true);
      expectFabCard(DefendingRhinar, thickHideHunterYellow).toBeIn("graveyard");
      expectFabPlayer(DefendingRhinar).toHaveLife(39);
      expectFabPlayer(Attacker).toHaveHandCount(3);
      expect(Attacker.zone("banished")).toHaveLength(0);
      expect(DefendingRhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);

      const attacking = startBranch("rh-d2-1");
      const AttackingRhinar = attacking.as(rhinarRecklessRampage);
      const Defender = attacking.as(dash);
      AttackingRhinar.must.playAttack(thickHideHunterYellow);
      attacking.passBoth();
      attacking.passBoth();
      attacking.passBoth();
      const attackingDiscard = attacking
        .committedEvents()
        .find((event) => event.name === "discard" && event.data.playerId === AttackingRhinar.id);

      expect(attackingDiscard?.name === "discard" && attackingDiscard.data.random).toBe(true);
      expectFabPlayer(Defender).toHaveHandCount(3);
      expect(Defender.zone("banished")).toHaveLength(1);
      attacking.advanceCombatTo("defend");
      Defender.must.defend();
      attacking.helpers.resolveRestOfCombat();
      expectFabPlayer(Defender).toHaveLife(14);
      expect(AttackingRhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
      AttackingRhinar.must.endTurn();
      expectFabPlayer(AttackingRhinar).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("RH-D3 [AAA] Flesh Bag intimidates once and Smashup Vigor goes to the clash winner", () => {
      const game = FabTestEngine.start(
        {
          hero: rhinarRecklessRampage,
          head: [scowlingFleshBag],
          hand: [vigorousSmashupRed, beastWithinYellow, wreckerRompBlue, swingBigRed],
          arsenal: [pulpingRed],
          deck: [
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
          ],
        },
        {
          hero: dash,
          hand: [snatchRed, snatchRed, swingBigRed],
          resourcePoints: 2,
          actionPoints: 2,
          deck: [
            eyeOfOphidiaBlue,
            eyeOfOphidiaBlue,
            eyeOfOphidiaBlue,
            eyeOfOphidiaBlue,
            eyeOfOphidiaBlue,
            eyeOfOphidiaBlue,
            eyeOfOphidiaBlue,
            eyeOfOphidiaBlue,
          ],
        },
        { ...manual, firstPlayer: dash, seed: "rh-d3" },
      );
      const Rhinar = game.as(rhinarRecklessRampage);
      const Attacker = game.as(dash);

      Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
      game.advanceCombatTo("defend");
      Rhinar.defendWith(scowlingFleshBag);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expect(Attacker.zone("banished")).toHaveLength(1);
      expectFabCard(Rhinar, scowlingFleshBag).toBeIn("graveyard");
      const intimidated = Attacker.zone("banished")[0]!;

      const second = Attacker.cardsIn("hand", snatchRed)[0] ?? swingBigRed;
      Attacker.must.playAttack(second);
      game.advanceCombatTo("defend");
      Rhinar.defendWith(vigorousSmashupRed);
      game.helpers.resolveUntilIdle({ optionalBoolean: false });
      expect(Rhinar.zone("arena")).toContain("token:vigor");
      expect(Attacker.zone("arena")).not.toContain("token:vigor");
      expect(Attacker.zone("banished")).toEqual([intimidated]);
      game.helpers.resolveRestOfCombat();

      Attacker.must.endTurn();
      expect(Attacker.zone("banished")).toEqual([]);
      expect(Rhinar.zone("arsenal")).toEqual([pulpingRed.canonicalId]);
    });
    it("RH-D4 [AAA] Crown cycles arsenal or hand without discarding or triggering Rhinar", () => {
      for (const selected of [recklessSwingBlue, swingBigRed] as const) {
        const game = FabTestEngine.start(
          {
            hero: rhinarRecklessRampage,
            head: [crownOfProvidence],
            hand: [swingBigRed, beastWithinYellow, wreckerRompBlue, pulpingRed],
            arsenal: [recklessSwingBlue],
            deck: 8,
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          manual,
        );
        const Rhinar = game.as(rhinarRecklessRampage);
        const Attacker = game.as(dash);
        Rhinar.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Rhinar.defendWith(crownOfProvidence);
        game.helpers.resolveUntilIdle({
          optionalBoolean: true,
          entityTargetCanonicalId: selected.canonicalId,
        });
        game.helpers.resolveRestOfCombat();

        expectFabCard(Rhinar, crownOfProvidence).toBeIn("graveyard");
        expect(Rhinar.zone("deck")).toContain(selected.canonicalId);
        expect(Rhinar.zone("hand")).toHaveLength(selected === recklessSwingBlue ? 5 : 4);
        expect(Rhinar.zone("arsenal")).toHaveLength(selected === recklessSwingBlue ? 0 : 1);
        expectFabPlayer(Rhinar).toHaveLife(38);
        expect(game.committedEvents().filter((event) => event.name === "discard")).toHaveLength(0);
        // Snatch deals 2 through Crown, so its on-hit replaces the played card.
        expectFabPlayer(Attacker).toHaveHandCount(4);

        Attacker.must.endTurn();
        Rhinar.must.endTurn();
        expectFabPlayer(Rhinar)
          .toHaveHandCount(selected === recklessSwingBlue ? 5 : 4)
          .toHaveAP(0)
          .toHaveResourceCount(0);
      }
    });
  });

  describe("Tuffnut", () => {
    it("TU-01 [AAA] a 6+ hero pitch cheers, then arsenal Jaws keeps going", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [buckwildYellow, hulkUpBlue, toughAsARokBlue, wreckerRompBlue],
          arsenal: [jawsOfVictoryRed],
          resourcePoints: 2,
          deck: [
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            wreckerRompBlue,
          ],
        },
        { hero: dash, hand: [], life: 20, deck: [snatchRed, snatchRed, snatchRed, snatchRed] },
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = game.as(tuffnut);
      const Defender = game.as(dash);

      Tuffnut.activate(tuffnut);
      game.untilIdle({ optionals: "throw" });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
      expectFabCard(Tuffnut, tuffnut).toBeTapped();

      Tuffnut.playAttack(jawsOfVictoryRed, { from: "arsenal" });
      game.advanceUntil({ stopAt: "defend", optionals: "throw" });
      expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 2);
      Defender.defendWith();
      game.closeCombat({ optionals: "throw" });

      expectFabPlayer(Defender).toHaveLife(14);
      expectFabPlayer(Tuffnut).toHaveAP(1).toHaveTokenCount("toughness", 2);
      expectFabCard(Tuffnut, jawsOfVictoryRed).toBeIn("graveyard");
      expectCombat(game).toBeClosed();
      Tuffnut.endTurn();
      expectFabPlayer(Tuffnut).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("TU-H1 [AAA] a 6+ hero pitch cheers once and a sub-6 pitch does not", () => {
      const run = (sixPlus: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: tuffnut,
            life: 19,
            hand: [thickHideHunterYellow, wreckerRompBlue, toughAsARokBlue, jawsOfVictoryRed],
            arsenal: [buckwildYellow],
            resourcePoints: 2,
            deck: sixPlus
              ? sixPowerDeck()
              : [
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
          emptyDash,
          FAB_MANUAL_HARNESS,
        );
        const Tuffnut = game.as(tuffnut);
        Tuffnut.must.activate(tuffnut);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", sixPlus ? 1 : 0);
        expectFabCard(Tuffnut, tuffnut).toBeTapped();
        if (sixPlus) {
          expect(Tuffnut.zone("pitch")).toContain(wreckerRompBlue.canonicalId);
        } else {
          expect(Tuffnut.zone("pitch")).toContain(snatchRed.canonicalId);
        }
        expect(Tuffnut.zone("arsenal")).toEqual([buckwildYellow.canonicalId]);
        Tuffnut.must.endTurn();
        expectFabPlayer(Tuffnut).toHaveAP(0).toHaveResourceCount(0);
      };
      run(true);
      run(false);
    });

    it("TU-H2 [AAA] Comeback Kicks pays an action point only while Tuffnut is behind", () => {
      const behind = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          legs: [comebackKicks],
          hand: [buckwildYellow, crowdGoesWildYellow, rockyardRodeoBlue, wreckerRompBlue],
          arsenal: [jawsOfVictoryRed],
          deck: sixPowerDeck(),
        },
        { hero: dash, hand: [], life: 20, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = behind.as(tuffnut);
      Tuffnut.must.activate(tuffnut);
      behind.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: true });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
      expectFabCard(Tuffnut, comebackKicks).toBeIn("graveyard");
      expectFabPlayer(Tuffnut).toHaveAP(2);

      const even = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 20,
          legs: [comebackKicks],
          hand: [buckwildYellow, crowdGoesWildYellow, rockyardRodeoBlue, wreckerRompBlue],
          arsenal: [jawsOfVictoryRed],
          deck: sixPowerDeck(),
        },
        { hero: dash, hand: [], life: 20, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Even = even.as(tuffnut);
      Even.must.activate(tuffnut);
      even.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Even, comebackKicks).toBeIn("legs");
      expectFabPlayer(Even).toHaveAP(1).toHaveTokenCount("toughness", 1);
    });

    it("TU-02 [AAA] cheered Crowd Goes Wild then arsenal Smashup", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [
            crowdGoesWildYellow,
            goodNaturedBrutalityYellow,
            rockyardRodeoBlue,
            windUpTheCrowdBlue,
          ],
          arsenal: [toughSmashupYellow],
          resourcePoints: 3,
          actionPoints: 2,
          deck: sixPowerDeck(),
        },
        { hero: dash, hand: [snatchRed], life: 20, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = game.as(tuffnut);
      const Defender = game.as(dash);

      Tuffnut.must.activate(tuffnut);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);

      Tuffnut.must.activate(windUpTheCrowdBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 2).toHaveTokenCount("vigor", 1);

      Tuffnut.must.playAttack(crowdGoesWildYellow);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(6);
      Defender.must.defend(snatchRed);
      game.helpers.resolveRestOfCombat();
      expectFabPlayer(Defender).toHaveLife(16);

      Tuffnut.must.playFromArsenal(toughSmashupYellow);
      toDefend(game);
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(10);
      expectFabCard(Tuffnut, toughSmashupYellow).toBeIn("graveyard");
      Tuffnut.must.endTurn();
      expectFabPlayer(Tuffnut).toHaveHandCount(3).toHaveAP(0).toHaveResourceCount(0);
    });

    it("TU-03 [AAA] Buckwild go-again, Pilfer choices, and Send Packing banish", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [buckwildRed, sendPackingYellow, pilferTheTombBlue, battlefrontBastionBlue],
          arsenal: [thickHideHunterYellow],
          resourcePoints: 6,
          actionPoints: 2,
          deck: sixPowerDeck(),
        },
        {
          hero: dash,
          hand: [snatchRed],
          arsenal: [snatchRed],
          graveyard: [sigilOfSolaceRed, crackedBaubleYellow],
          deck: 8,
        },
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = game.as(tuffnut);
      const Defender = game.as(dash);

      Tuffnut.must.activate(tuffnut);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Tuffnut.play(pilferTheTombBlue, { modeIndexes: [0, 1] });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Defender, sigilOfSolaceRed).toBeBanished();
      expectFabCard(Defender, crackedBaubleYellow).toBeBanished();

      Tuffnut.must.playAttack(buckwildRed);
      toDefend(game);
      expectCombat(game).toHaveKeyword("go-again");
      Defender.must.defend();
      game.helpers.resolveRestOfCombat();

      Tuffnut.must.playAttack(sendPackingYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Defender.zone("banished")).toContain(snatchRed.canonicalId);
      expect(game.combat()).toBeNull();
      expect(game.combat()).toBeNull();
      expect(Tuffnut.zone("arsenal")).toEqual([thickHideHunterYellow.canonicalId]);
      Tuffnut.must.endTurn();
      expectFabPlayer(Tuffnut).toHaveAP(0).toHaveResourceCount(0);
    });

    it("TU-04 [AAA] Song of Sinew buffs only when the reveal hits 6+", () => {
      const run = (sixPlus: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: tuffnut,
            life: 19,
            hand: [digInYellow, noHeroStandsAloneYellow, toughAsARokBlue, wreckerRompBlue],
            arsenal: [songOfSinewYellow],
            resourcePoints: 2,
            deck: sixPlus
              ? sixPowerDeck()
              : [
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
          emptyDash,
          FAB_MANUAL_HARNESS,
        );
        const Tuffnut = game.as(tuffnut);
        Tuffnut.must.playFromArsenal(songOfSinewYellow);
        const reorder = game.advanceToDecision(Tuffnut, "partition");
        game.answerDecision(Tuffnut.id, {
          kind: "partition",
          groups: { top: reorder.entries.map((entry) => entry.id) },
        });
        game.helpers.resolveUntilIdle();
        Tuffnut.must.playAttack(wreckerRompBlue);
        toDefend(game);
        expectCombat(game).toHaveAttackPower(sixPlus ? 10 : 6);
        missBlockAndClose(game);
        expectFabPlayer(game.as(dash)).toHaveLife(sixPlus ? 10 : 14);
        Tuffnut.must.endTurn();
        expectFabPlayer(Tuffnut).toHaveAP(0).toHaveResourceCount(0);
      };
      run(true);
      run(false);
    });

    it("TU-05 [AAA] Jaws keeps going, then only an empty-hand Rok is legal", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          weapon1: [rok],
          hand: [jawsOfVictoryRed, hulkUpBlue, rockyardRodeoBlue, vigorousSmashupBlue],
          arsenal: [battlefrontBastionYellow],
          resourcePoints: 10,
          actionPoints: 3,
          deck: sixPowerDeck(),
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = game.as(tuffnut);
      const Defender = game.as(dash);

      Tuffnut.must.activate(tuffnut);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Tuffnut.expectActivationRejected(rok);

      Tuffnut.must.playAttack(jawsOfVictoryRed);
      toDefend(game);
      expectCombat(game).toHaveKeyword("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(14);

      Tuffnut.must.playAttack(hulkUpBlue);
      toDefend(game);
      missBlockAndClose(game);
      Tuffnut.expectActivationRejected(rok);
      expect(Tuffnut.zone("hand")).toContain(rockyardRodeoBlue.canonicalId);
      expect(Tuffnut.zone("arsenal")).toEqual([battlefrontBastionYellow.canonicalId]);
      Tuffnut.must.endTurn();
      expectFabPlayer(Tuffnut).toHaveAP(0).toHaveResourceCount(0);
    });

    it("TU-06 [AAA] clash tokens and Wind Up do not leak into the next turn", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [toughSmashupYellow, unexpectedBackhandYellow, windUpTheCrowdBlue, wreckerRompBlue],
          arsenal: [buckwildRed],
          resourcePoints: 3,
          deck: [
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
          ],
        },
        {
          hero: dash,
          hand: [snatchRed],
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
        { ...manual, firstPlayer: dash },
      );
      const Tuffnut = game.as(tuffnut);
      const Attacker = game.as(dash);

      game.helpers.passPriorityTo(Tuffnut);
      Tuffnut.must.activate(windUpTheCrowdBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1).toHaveTokenCount("vigor", 1);

      Attacker.must.playAttack(snatchRed);
      game.advanceCombatTo("defend");
      Tuffnut.defendWith(toughSmashupYellow);
      game.helpers.resolveUntilIdle({ optionalBoolean: false });
      expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 2);
      expectFabPlayer(Attacker).toHaveLife(19);
      game.helpers.resolveRestOfCombat();

      Attacker.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Tuffnut.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Tuffnut).toHaveAP(0).toHaveResourceCount(0);
      expect(game.combat()).toBeNull();
    });

    it("TU-E1 [AAA] Gauntlets buff the next attack and Rok waits for an empty hand", () => {
      const game = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          arms: [gauntletsOfTyrannicalRex],
          weapon1: [rok],
          hand: [thickHideHunterYellow, wreckerRompBlue, toughAsARokBlue, hulkUpBlue],
          arsenal: [buckwildRed],
          resourcePoints: 8,
          actionPoints: 3,
          deck: sixPowerDeck(),
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Tuffnut = game.as(tuffnut);

      Tuffnut.must.activate(tuffnut);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Tuffnut.must.activate(gauntletsOfTyrannicalRex);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Tuffnut, gauntletsOfTyrannicalRex).toBeTapped();

      Tuffnut.playAttack(thickHideHunterYellow, { stopAt: "on-attack" });
      game.advanceUntil({ stopAt: "defend" });
      expect(game.combat()?.activeLink?.attackPower).toBeGreaterThanOrEqual(7);
      missBlockAndClose(game);

      Tuffnut.expectActivationRejected(rok);
      Tuffnut.must.endTurn();
      expectFabPlayer(Tuffnut).toHaveAP(0).toHaveResourceCount(0);
    });

    it("TU-E2 [AAA] Scabskin AP is floor(roll/2) once per turn, Battleworn does not reroll", () => {
      for (const seed of [
        "tu-e2-1",
        "tu-e2-2",
        "tu-e2-3",
        "tu-e2-4",
        "tu-e2-5",
        "tu-e2-6",
      ] as const) {
        const game = FabTestEngine.start(
          {
            hero: tuffnut,
            life: 19,
            legs: [scabskinLeathers],
            hand: [thickHideHunterYellow, wreckerRompBlue, toughSmashupYellow, buckwildRed],
            arsenal: [jawsOfVictoryRed],
            deck: sixPowerDeck(),
          },
          emptyDash,
          { ...manual, seed },
        );
        const Tuffnut = game.as(tuffnut);
        Tuffnut.must.activate(scabskinLeathers);
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        const roll = game.committedEvents().find((event) => event.name === "roll");
        const face = roll?.name === "roll" ? roll.data.result : 0;
        expectFabPlayer(Tuffnut).toHaveAP(Math.floor(face / 2));
        Tuffnut.expectActivationRejected(scabskinLeathers);
        Tuffnut.must.endTurn();
        expectFabPlayer(Tuffnut).toHaveAP(0).toHaveResourceCount(0);
      }

      const defend = FabTestEngine.start(
        { hero: dash, hand: [snatchRed], deck: 8 },
        {
          hero: tuffnut,
          life: 19,
          legs: [scabskinLeathers],
          hand: [thickHideHunterYellow, wreckerRompBlue, toughSmashupYellow, buckwildRed],
          arsenal: [jawsOfVictoryRed],
          deck: sixPowerDeck(),
        },
        { ...manual, firstPlayer: dash, seed: "tu-e2-def" },
      );
      const Tuffnut = defend.as(tuffnut);
      const legsId = Tuffnut.findCardInZone("legs", scabskinLeathers);
      defend.as(dash).must.playAttack(snatchRed);
      defend.advanceCombatTo("defend");
      Tuffnut.defendWith(scabskinLeathers);
      defend.helpers.resolveRestOfCombat();
      expectFabCard(Tuffnut, scabskinLeathers).toBeIn("legs");
      expect(defend.objectState(legsId).defenseCounterTotal).toBe(-1);
    });

    it("TU-D1 [AAA] Good Natured cheers only as the last hand card", () => {
      const last = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [goodNaturedBrutalityYellow, digInYellow, toughSmashupYellow, vigorousSmashupBlue],
          arsenal: [noHeroStandsAloneYellow],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, swingBigRed], actionPoints: 2, resourcePoints: 2, deck: 8 },
        { ...manual, firstPlayer: dash },
      );
      const LastTuff = last.as(tuffnut);
      const LastDash = last.as(dash);
      LastDash.must.playAttack(swingBigRed);
      last.advanceCombatTo("defend");
      LastTuff.defendWith(digInYellow, toughSmashupYellow, vigorousSmashupBlue);
      last.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      last.helpers.resolveRestOfCombat();
      LastDash.must.playAttack(snatchRed);
      last.advanceCombatTo("defend");
      LastTuff.defendWith(goodNaturedBrutalityYellow);
      last.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(LastTuff).toHaveTokenCount("toughness", 1);
      last.helpers.resolveRestOfCombat();
      expectFabPlayer(LastTuff).toHaveLife(19);

      const leftover = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [goodNaturedBrutalityYellow, digInYellow, toughSmashupYellow, vigorousSmashupBlue],
          arsenal: [noHeroStandsAloneYellow],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8 },
        { ...manual, firstPlayer: dash },
      );
      leftover.as(dash).must.playAttack(snatchRed);
      leftover.advanceCombatTo("defend");
      leftover.as(tuffnut).defendWith(goodNaturedBrutalityYellow);
      leftover.helpers.resolveRestOfCombat();
      expectFabPlayer(leftover.as(tuffnut)).toHaveTokenCount("toughness", 0);
      expectFabPlayer(leftover.as(tuffnut)).toHaveLife(15);
    });

    it("TU-D2 [AAA] Dig In pays 0 or 3 Toughness and then No Hero gains ambush", () => {
      const paid = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [digInYellow, wreckerRompBlue, toughSmashupYellow, vigorousSmashupBlue],
          arsenal: [noHeroStandsAloneYellow],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8 },
        { ...manual, firstPlayer: dash },
      );
      const PaidTuff = paid.as(tuffnut);
      paid.as(dash).must.playAttack(snatchRed);
      paid.advanceCombatTo("defend");
      PaidTuff.defendWith(digInYellow);
      paid.advanceToDecision(PaidTuff, "boolean");
      PaidTuff.chooseBoolean(true);
      expect(PaidTuff.expectDecision("numeric")).toMatchObject({ min: 0, max: 3 });
      paid.answerDecision(PaidTuff.id, { kind: "numeric", value: 3 });
      paid.helpers.resolveUntilIdle();
      expect(PaidTuff.zone("arena").filter((id) => id === "token:toughness")).toHaveLength(3);
      expectFabCard(PaidTuff, noHeroStandsAloneYellow).toHaveKeyword("ambush");
      expectFabCard(PaidTuff, noHeroStandsAloneYellow).toHaveDefense(3);

      const zeroPaid = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [digInYellow, wreckerRompBlue, toughSmashupYellow, vigorousSmashupBlue],
          arsenal: [noHeroStandsAloneYellow],
          resourcePoints: 3,
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8 },
        { ...manual, firstPlayer: dash },
      );
      const ZeroTuff = zeroPaid.as(tuffnut);
      zeroPaid.as(dash).must.playAttack(snatchRed);
      zeroPaid.advanceCombatTo("defend");
      ZeroTuff.defendWith(digInYellow);
      zeroPaid.advanceToDecision(ZeroTuff, "boolean");
      ZeroTuff.chooseBoolean(true);
      expect(ZeroTuff.expectDecision("numeric")).toMatchObject({ min: 0, max: 3 });
      zeroPaid.answerDecision(ZeroTuff.id, { kind: "numeric", value: 0 });
      zeroPaid.helpers.resolveUntilIdle();
      expect(ZeroTuff.zone("arena")).not.toContain("token:toughness");
      expectFabCard(ZeroTuff, noHeroStandsAloneYellow).notToHaveKeyword("ambush");
    });

    it("TU-D3 [AAA] Smashup clash creates Toughness or Vigor and Backhand pings only on its reveal", () => {
      const toughness = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [
            toughSmashupYellow,
            vigorousSmashupBlue,
            unexpectedBackhandYellow,
            wreckerRompBlue,
          ],
          arsenal: [noHeroStandsAloneYellow],
          deck: [
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
            unexpectedBackhandYellow,
          ],
        },
        {
          hero: dash,
          hand: [snatchRed],
          life: 20,
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
        { ...manual, firstPlayer: dash },
      );
      toughness.as(dash).must.playAttack(snatchRed);
      toughness.advanceCombatTo("defend");
      toughness.as(tuffnut).defendWith(toughSmashupYellow);
      toughness.helpers.resolveUntilIdle({ optionalBoolean: false });
      expectFabPlayer(toughness.as(tuffnut)).toHaveTokenCount("toughness", 1);
      expectFabPlayer(toughness.as(dash)).toHaveLife(19);
      expect(toughness.renderedPlayerNarrative(toughness.as(tuffnut).id)).toEqual([
        "Opponent played Snatch.",
        "Opponent attacked You with Snatch.",
        "You defended with Tough Smashup.",
        "You revealed Unexpected Backhand (6 power); Opponent revealed Snatch (4 power).",
        "You won the clash, 6 power to 4 power.",
        "You created Toughness.",
        "Tough Smashup created Toughness for You.",
        "Opponent took 1 generic damage from Unexpected Backhand.",
        "Snatch hit You for 1.",
        "Opponent drew a card.",
      ]);
      expect(toughness.renderedPlayerNarrative(toughness.as(dash).id)).toEqual([
        "You played Snatch.",
        "You attacked Opponent with Snatch.",
        "Opponent defended with Tough Smashup.",
        "Opponent revealed Unexpected Backhand (6 power); You revealed Snatch (4 power).",
        "Opponent won the clash, 6 power to 4 power.",
        "Opponent created Toughness.",
        "Tough Smashup created Toughness for Opponent.",
        "You took 1 generic damage from Unexpected Backhand.",
        "Snatch hit Opponent for 1.",
        "You drew: Snatch.",
      ]);

      const vigor = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [
            toughSmashupYellow,
            vigorousSmashupBlue,
            unexpectedBackhandYellow,
            wreckerRompBlue,
          ],
          arsenal: [noHeroStandsAloneYellow],
          deck: [
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
            wreckerRompBlue,
          ],
        },
        {
          hero: dash,
          hand: [snatchRed],
          life: 20,
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
        { ...manual, firstPlayer: dash },
      );
      vigor.as(dash).must.playAttack(snatchRed);
      vigor.advanceCombatTo("defend");
      vigor.as(tuffnut).defendWith(vigorousSmashupBlue);
      vigor.helpers.resolveUntilIdle({ optionalBoolean: false });
      expectFabPlayer(vigor.as(tuffnut)).toHaveTokenCount("vigor", 1);
      expectFabPlayer(vigor.as(dash)).toHaveLife(20);
      expect(vigor.renderedPlayerNarrative(vigor.as(tuffnut).id)).toEqual([
        "Opponent played Snatch.",
        "Opponent attacked You with Snatch.",
        "You defended with Vigorous Smashup.",
        "You revealed Wrecker Romp (6 power); Opponent revealed Snatch (4 power).",
        "You won the clash, 6 power to 4 power.",
        "You created Vigor.",
        "Vigorous Smashup created Vigor for You.",
        "Snatch hit You for 1.",
        "Opponent drew a card.",
      ]);
      expect(vigor.renderedPlayerNarrative(vigor.as(dash).id)).toEqual([
        "You played Snatch.",
        "You attacked Opponent with Snatch.",
        "Opponent defended with Vigorous Smashup.",
        "Opponent revealed Wrecker Romp (6 power); You revealed Snatch (4 power).",
        "Opponent won the clash, 6 power to 4 power.",
        "Opponent created Vigor.",
        "Vigorous Smashup created Vigor for Opponent.",
        "Snatch hit Opponent for 1.",
        "You drew: Snatch.",
      ]);
    });

    it("TU-D4 [AAA] Flesh Bag intimidates once and Bastion prevents only alone", () => {
      const bag = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          head: [scowlingFleshBag],
          hand: [thickHideHunterYellow, wreckerRompBlue, hulkUpBlue, buckwildRed],
          arsenal: [battlefrontBastionYellow],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed, commandAndConquerRed], deck: 8 },
        { ...manual, firstPlayer: dash, seed: "tu-d4-bag" },
      );
      bag.as(dash).must.playAttack(snatchRed);
      bag.advanceCombatTo("defend");
      bag.as(tuffnut).defendWith(scowlingFleshBag);
      bag.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(bag.as(dash).zone("banished")).toHaveLength(1);
      expectFabCard(bag.as(tuffnut), scowlingFleshBag).toBeIn("graveyard");

      const alone = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [battlefrontBastionYellow, wreckerRompBlue, hulkUpBlue, buckwildRed],
          arsenal: [thickHideHunterYellow],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8 },
        { ...manual, firstPlayer: dash },
      );
      alone.as(dash).must.playAttack(snatchRed);
      alone.advanceCombatTo("defend");
      alone.as(tuffnut).defendWith(battlefrontBastionYellow);
      alone.helpers.resolveRestOfCombat();
      expectFabPlayer(alone.as(tuffnut)).toHaveLife(18);

      const together = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          hand: [battlefrontBastionYellow, wreckerRompBlue, hulkUpBlue, buckwildRed],
          arsenal: [thickHideHunterYellow],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], deck: 8 },
        { ...manual, firstPlayer: dash },
      );
      together.as(dash).must.playAttack(snatchRed);
      together.advanceCombatTo("defend");
      together.as(tuffnut).defendWith(battlefrontBastionYellow, wreckerRompBlue);
      together.helpers.resolveRestOfCombat();
      expectFabPlayer(together.as(tuffnut)).toHaveLife(19);
    });

    it("TU-D5 [AAA] Skera Spellvoid 3 and Skullhorn Arcane Barrier 2 prevent arcane", () => {
      const skera = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          arms: [skeraStrapping],
          hand: [thickHideHunterYellow, wreckerRompBlue, toughAsARokBlue, hulkUpBlue],
          arsenal: [jawsOfVictoryRed],
          deck: sixPowerDeck(),
        },
        { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, deck: 8 },
        { ...manual, firstPlayer: blazeFiremind },
      );
      const SkeraTuff = skera.as(tuffnut);
      skera.helpers.passPriorityTo(SkeraTuff);
      SkeraTuff.must.activate(tuffnut);
      skera.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(SkeraTuff, skeraStrapping).toHaveKeyword("spellvoid");
      skera.as(blazeFiremind).must.play(volticBoltRed, { target: SkeraTuff.id });
      skera.passBoth();
      const spellvoid = SkeraTuff.expectDecision("option");
      SkeraTuff.chooseOptions(spellvoid.options[0]!.id);
      expectFabPlayer(SkeraTuff).toHaveLife(17);
      expectFabCard(SkeraTuff, skeraStrapping).toBeIn("graveyard");

      const horn = FabTestEngine.start(
        {
          hero: tuffnut,
          life: 19,
          head: [skullhorn],
          hand: [thickHideHunterYellow, wreckerRompBlue, toughAsARokBlue, hulkUpBlue],
          arsenal: [jawsOfVictoryRed],
          resourcePoints: 2,
          deck: sixPowerDeck(),
        },
        { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, deck: 8 },
        { ...manual, firstPlayer: blazeFiremind },
      );
      const HornTuff = horn.as(tuffnut);
      horn.as(blazeFiremind).must.play(volticBoltRed, { target: HornTuff.id });
      horn.passBoth();
      const barrier = HornTuff.expectDecision("option");
      HornTuff.chooseOptions(barrier.options[0]!.id);
      expectFabPlayer(HornTuff).toHaveLife(16);
      expectFabCard(HornTuff, skullhorn).toBeIn("head");
      expect(horn.committedEvents().filter((event) => event.name === "discard")).toHaveLength(0);
    });
  });
});
