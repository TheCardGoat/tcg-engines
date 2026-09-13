/**
 * Pirate play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { ankaDragUnderYellow } from "../../../../cards/src/cards/actions/anka-drag-under.ts";
import { riggermortisYellow } from "../../../../cards/src/cards/actions/riggermortis.ts";
import { sawbonesDockHandYellow } from "../../../../cards/src/cards/actions/sawbones-dock-hand.ts";
import { goldenTippleBlue } from "../../../../cards/src/cards/actions/golden-tipple.ts";
import { jitteryBonesBlue } from "../../../../cards/src/cards/actions/jittery-bones.ts";
import { murderousRabbleBlue } from "../../../../cards/src/cards/actions/murderous-rabble.ts";
import { avastYeBlue } from "../../../../cards/src/cards/actions/avast-ye.ts";
import { lootTheHoldBlue } from "../../../../cards/src/cards/actions/loot-the-hold.ts";
import { portsideExchangeBlue } from "../../../../cards/src/cards/actions/portside-exchange.ts";
import { fiddlerSGreenRed } from "../../../../cards/src/cards/blocks/fiddler-s-green.ts";
import { compassOfSunkenDepths } from "../../../../cards/src/cards/equipment/compass-of-sunken-depths.ts";
import { gravyBones } from "../../../../cards/src/cards/heroes/gravy-bones.ts";
import { backAlleyBreaklineBlue } from "../../../../cards/src/cards/actions/back-alley-breakline.ts";
import { volticBoltRed } from "../../../../cards/src/cards/actions/voltic-bolt.ts";
import { commandAndConquerRed } from "../../../../cards/src/cards/actions/command-and-conquer.ts";
import { nullruneHood } from "../../../../cards/src/cards/equipment/nullrune-hood.ts";
import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { eyeOfOphidiaBlue } from "../../../../cards/src/cards/resources/eye-of-ophidia.ts";
import { bravo } from "../../../../cards/src/cards/heroes/bravo.ts";
import { mangleRed } from "../../../../cards/src/cards/actions/mangle.ts";
import { gold } from "../../../../cards/src/cards/tokens/gold.ts";
import { blazeFiremind } from "../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { quickdodgeFlexors } from "../../../../cards/src/cards/equipment/quickdodge-flexors.ts";
import { fearlessConfrontationBlue } from "../../../../cards/src/cards/actions/fearless-confrontation.ts";
import { cheatingScoundrelRed } from "../../../../cards/src/cards/actions/cheating-scoundrel.ts";
import { callToTheGraveBlue } from "../../../../cards/src/cards/actions/call-to-the-grave.ts";
import { chumFriendlyFirstMateYellow } from "../../../../cards/src/cards/actions/chum-friendly-first-mate.ts";
import { wailerHumperdinckYellow } from "../../../../cards/src/cards/actions/wailer-humperdinck.ts";
import { scoobaSaltySeaDogYellow } from "../../../../cards/src/cards/actions/scooba-salty-sea-dog.ts";
import { conquerorOfTheHighSeasRed } from "../../../../cards/src/cards/actions/conqueror-of-the-high-seas.ts";
import { loanSharkYellow } from "../../../../cards/src/cards/actions/loan-shark.ts";
import { tipTheBarkeepBlue } from "../../../../cards/src/cards/actions/tip-the-barkeep.ts";
import { saltwaterSwellRed } from "../../../../cards/src/cards/actions/saltwater-swell.ts";
import { saltwaterSwellBlue } from "../../../../cards/src/cards/actions/saltwater-swell.ts";
import { swiftwaterSloopRed } from "../../../../cards/src/cards/actions/swiftwater-sloop.ts";
import { sunkenTreasureBlue } from "../../../../cards/src/cards/blocks/sunken-treasure.ts";
import { bloodInTheWaterRed } from "../../../../cards/src/cards/defense-reactions/blood-in-the-water.ts";
import { deadThreads } from "../../../../cards/src/cards/equipment/dead-threads.ts";
import { goldBaitedHook } from "../../../../cards/src/cards/equipment/gold-baited-hook.ts";
import { lastDitchEffortBlue } from "../../../../cards/src/cards/actions/last-ditch-effort.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";

import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "../../testing/index.ts";
import { emptyDash, toDefend, missBlockAndClose, manual } from "./helpers.ts";

describe("Pirate play lines", () => {
  describe("Gravy Bones", () => {
    it("GB-01 [AAA] two blues in pitch give arsenal Sloop High Tide go again", () => {
      const game = FabTestEngine.start(
        {
          hero: gravyBones,
          hand: [avastYeBlue, lootTheHoldBlue, bloodInTheWaterRed, jitteryBonesBlue],
          arsenal: [swiftwaterSloopRed],
          pitch: [lootTheHoldBlue, jitteryBonesBlue],
          resourcePoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Gravy = game.as(gravyBones);
      const Defender = game.as(dash);

      Gravy.must.play(avastYeBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Gravy, avastYeBlue).toBeIn("graveyard");
      expectFabPlayer(Gravy).toHaveAP(1);

      Gravy.must.playFromArsenal(swiftwaterSloopRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(6).toHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(14);
      expectFabPlayer(Gravy).toHaveAP(1);
      expectFabCard(Gravy, bloodInTheWaterRed).toBeIn("hand");
      expectFabCard(Gravy, swiftwaterSloopRed).toBeIn("graveyard");
      Gravy.endTurnWithArsenal(bloodInTheWaterRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Gravy, bloodInTheWaterRed).toBeIn("arsenal");
      expectFabPlayer(Gravy).toHaveAP(0).toHaveResourceCount(0);
    });

    it("GB-H1 [AAA] Hook Gold plus a blue discard lets Compass refund one GY ally", () => {
      const game = FabTestEngine.start(
        {
          hero: gravyBones,
          arms: [goldBaitedHook],
          weapon2: [compassOfSunkenDepths],
          hand: [
            jitteryBonesBlue,
            sawbonesDockHandYellow,
            lootTheHoldBlue,
            conquerorOfTheHighSeasRed,
          ],
          arsenal: [sunkenTreasureBlue],
          graveyard: [riggermortisYellow],
          actionPoints: 2,
          deck: [
            jitteryBonesBlue,
            jitteryBonesBlue,
            jitteryBonesBlue,
            jitteryBonesBlue,
            jitteryBonesBlue,
            jitteryBonesBlue,
            jitteryBonesBlue,
            jitteryBonesBlue,
          ],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Gravy = game.as(gravyBones);
      const Defender = game.as(dash);

      Gravy.must.activate(goldBaitedHook);
      game.passBoth();
      expectFabPlayer(Gravy).toHaveAP(2);

      Gravy.must.playAttack(conquerorOfTheHighSeasRed, {
        pitch: [lootTheHoldBlue, sawbonesDockHandYellow],
      });
      toDefend(game);
      Defender.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });

      expectFabPlayer(Defender).toHaveLife(13);
      expect(Gravy.zone("arena")).toContain("token:gold");

      Gravy.activate(gravyBones);
      game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
      expect(Gravy.zone("graveyard")).toContain(jitteryBonesBlue.canonicalId);

      Gravy.play(riggermortisYellow, { from: "graveyard" });
      game.passBoth();
      expectFabCard(Gravy, riggermortisYellow).toBeIn("arena");
      expectFabPlayer(Gravy).toHaveAP(1);
      expect(Gravy.zone("arsenal")).toEqual([sunkenTreasureBlue.canonicalId]);
      Gravy.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveAP(0).toHaveResourceCount(0);
    });

    it("GB-H2 [AAA] only a blue discard opens watery-grave play from the graveyard", () => {
      const start = (_discardBlue: boolean) =>
        FabTestEngine.start(
          {
            hero: gravyBones,
            arena: [gold],
            hand: [
              chumFriendlyFirstMateYellow,
              jitteryBonesBlue,
              goldenTippleBlue,
              saltwaterSwellRed,
            ],
            arsenal: [riggermortisYellow],
            graveyard: [sawbonesDockHandYellow],
            resourcePoints: 2,
            deck: 8,
          },
          emptyDash,
          FAB_MANUAL_HARNESS,
        );

      const enabled = start(true);
      const Gravy = enabled.as(gravyBones);
      const [blue] = Gravy.cardsIn("hand", jitteryBonesBlue);
      Gravy.activate(gravyBones);
      enabled.advanceToDecision(Gravy, "entity-target");
      Gravy.chooseTargets(blue!);
      enabled.helpers.passPriorityTo(Gravy);
      Gravy.play(sawbonesDockHandYellow, { from: "graveyard" });
      enabled.passBoth();
      expectFabCard(Gravy, sawbonesDockHandYellow).toBeIn("arena");

      const blocked = start(false);
      const Blocked = blocked.as(gravyBones);
      const [yellow] = Blocked.cardsIn("hand", chumFriendlyFirstMateYellow);
      Blocked.activate(gravyBones);
      blocked.advanceToDecision(Blocked, "entity-target");
      Blocked.chooseTargets(yellow!);
      blocked.helpers.passPriorityTo(Blocked);
      expect(() => Blocked.play(sawbonesDockHandYellow, { from: "graveyard" })).toThrow();
      expectFabCard(Blocked, sawbonesDockHandYellow).toBeIn("graveyard");
    });

    it("GB-02 [AAA] Chum and Sawbones persist, then Conqueror hits for printed 7", () => {
      const game = FabTestEngine.start(
        {
          hero: gravyBones,
          hand: [
            chumFriendlyFirstMateYellow,
            sawbonesDockHandYellow,
            conquerorOfTheHighSeasRed,
            callToTheGraveBlue,
          ],
          arsenal: [sunkenTreasureBlue],
          resourcePoints: 6,
          actionPoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Gravy = game.as(gravyBones);
      const Defender = game.as(dash);

      expect(() => Gravy.must.playFromArsenal(sunkenTreasureBlue)).toThrow();
      expectFabCard(Gravy, sunkenTreasureBlue).toBeIn("arsenal");

      Gravy.must.play(sawbonesDockHandYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Gravy, sawbonesDockHandYellow).toBeIn("arena");
      expectFabPlayer(Gravy).toHaveAP(1).toHaveResourceCount(4);

      Gravy.must.playAttack(conquerorOfTheHighSeasRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(7).notToHaveKeyword("go-again");
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(13);
      expectFabCard(Gravy, sawbonesDockHandYellow).toBeIn("arena");
      expectFabCard(Gravy, chumFriendlyFirstMateYellow).toBeIn("hand");
      expect(Gravy.zone("arsenal")).toEqual([sunkenTreasureBlue.canonicalId]);
      Gravy.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Gravy, sawbonesDockHandYellow).toBeIn("arena");
      expect(Gravy.zone("arsenal")).toEqual([sunkenTreasureBlue.canonicalId]);
      expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("GB-03 [AAA] Portside Gold only if the discarded card is yellow", () => {
      for (const discardYellow of [true, false]) {
        const game = FabTestEngine.start(
          {
            hero: gravyBones,
            hand: [cheatingScoundrelRed, loanSharkYellow, goldenTippleBlue, portsideExchangeBlue],
            arsenal: [fiddlerSGreenRed],
            deck: 8,
          },
          emptyDash,
          FAB_MANUAL_HARNESS,
        );
        const Gravy = game.as(gravyBones);

        expect(() => Gravy.must.playFromArsenal(fiddlerSGreenRed)).toThrow();
        expectFabCard(Gravy, fiddlerSGreenRed).toBeIn("arsenal");

        Gravy.must.play(portsideExchangeBlue);
        game.helpers.resolveUntilIdle({
          entityTargetCanonicalId: discardYellow
            ? loanSharkYellow.canonicalId
            : cheatingScoundrelRed.canonicalId,
        });

        expectFabCard(Gravy, discardYellow ? loanSharkYellow : cheatingScoundrelRed).toBeIn(
          "graveyard",
        );
        expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(
          discardYellow ? 1 : 0,
        );
        expectFabPlayer(Gravy).toHaveHandCount(3).toHaveAP(1);
        expect(Gravy.zone("arsenal")).toEqual([fiddlerSGreenRed.canonicalId]);
        Gravy.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      }
    });

    it("GB-04 [AAA] Swell and Rabble hit, then arsenal Anka enters and persists", () => {
      const game = FabTestEngine.start(
        {
          hero: gravyBones,
          hand: [bloodInTheWaterRed, saltwaterSwellBlue, murderousRabbleBlue, tipTheBarkeepBlue],
          arsenal: [ankaDragUnderYellow],
          resourcePoints: 3,
          deck: [
            lootTheHoldBlue,
            lootTheHoldBlue,
            lootTheHoldBlue,
            lootTheHoldBlue,
            lootTheHoldBlue,
            lootTheHoldBlue,
            lootTheHoldBlue,
            lootTheHoldBlue,
          ],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Gravy = game.as(gravyBones);
      const Defender = game.as(dash);

      expect(() => Gravy.must.play(bloodInTheWaterRed)).toThrow();
      expectFabCard(Gravy, bloodInTheWaterRed).toBeIn("hand");

      Gravy.must.play(tipTheBarkeepBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expect(Gravy.zone("arena")).toContain("token:goldkiss-rum");
      expectFabPlayer(Gravy).toHaveAP(1);

      Gravy.must.playAttack(saltwaterSwellBlue);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(1).toHaveKeyword("go-again");
      expectFabCard(Gravy, lootTheHoldBlue).toBeIn("pitch");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(19);
      expectFabPlayer(Gravy).toHaveAP(1);

      Gravy.must.playAttack(murderousRabbleBlue);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(16);
      expectFabCard(Gravy, saltwaterSwellBlue).toBeIn("graveyard");
      expectFabCard(Gravy, murderousRabbleBlue).toBeIn("graveyard");

      Gravy.must.playFromArsenal(ankaDragUnderYellow);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Gravy, ankaDragUnderYellow).toBeIn("arena");
      expectFabCard(Gravy, bloodInTheWaterRed).toBeIn("hand");
      Gravy.endTurnWithArsenal(bloodInTheWaterRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Gravy, ankaDragUnderYellow).toBeIn("arena");
      expectFabCard(Gravy, bloodInTheWaterRed).toBeIn("arsenal");
      expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("GB-05 [AAA] leftover blue pitch plays arsenal Scooba only while AP remains", () => {
      const paid = FabTestEngine.start(
        {
          hero: gravyBones,
          hand: [
            backAlleyBreaklineBlue,
            fearlessConfrontationBlue,
            eyeOfOphidiaBlue,
            riggermortisYellow,
          ],
          arsenal: [scoobaSaltySeaDogYellow],
          resourcePoints: 0,
          actionPoints: 2,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Gravy = paid.as(gravyBones);
      const Defender = paid.as(dash);

      Gravy.must.pitch(eyeOfOphidiaBlue).play(riggermortisYellow);
      paid.helpers.resolveUntilIdle({ ordering: "listed", entityTargets: "minimum" });
      expectFabCard(Gravy, riggermortisYellow).toBeIn("arena");
      expectFabPlayer(Gravy).toHaveAP(1).toHaveResourceCount(2);

      Gravy.must.playFromArsenal(scoobaSaltySeaDogYellow);
      paid.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Gravy, scoobaSaltySeaDogYellow).toBeIn("arena");
      expectFabPlayer(Gravy).toHaveAP(0).toHaveResourceCount(2);
      expectFabPlayer(Defender).toHaveLife(20);
      Gravy.must.endTurn();
      paid.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const blocked = FabTestEngine.start(
        {
          hero: gravyBones,
          hand: [
            backAlleyBreaklineBlue,
            fearlessConfrontationBlue,
            eyeOfOphidiaBlue,
            riggermortisYellow,
          ],
          arsenal: [scoobaSaltySeaDogYellow],
          resourcePoints: 0,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Blocked = blocked.as(gravyBones);
      Blocked.must.pitch(eyeOfOphidiaBlue).play(riggermortisYellow);
      blocked.helpers.resolveUntilIdle({ ordering: "listed", entityTargets: "minimum" });
      expectFabPlayer(Blocked).toHaveAP(0);
      expect(() => Blocked.must.playFromArsenal(scoobaSaltySeaDogYellow)).toThrow();
      expectFabCard(Blocked, scoobaSaltySeaDogYellow).toBeIn("arsenal");
    });

    it("GB-06 [AAA] empty-deck Last Ditch refunds AP so arsenal Swell can follow", () => {
      const empty = FabTestEngine.start(
        {
          hero: gravyBones,
          hand: [
            conquerorOfTheHighSeasRed,
            wailerHumperdinckYellow,
            lastDitchEffortBlue,
            lootTheHoldBlue,
          ],
          arsenal: [saltwaterSwellRed],
          resourcePoints: 4,
          deck: [],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Gravy = empty.as(gravyBones);
      const Defender = empty.as(dash);

      Gravy.must.play(lootTheHoldBlue);
      empty.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveAP(1);

      Gravy.must.pitch(wailerHumperdinckYellow).playAttack(lastDitchEffortBlue);
      toDefend(empty);
      expectCombat(empty).toHaveAttackPower(8).toHaveKeyword("go-again");
      missBlockAndClose(empty);
      expectFabPlayer(Defender).toHaveLife(12);
      expectFabPlayer(Gravy).toHaveAP(1);

      Gravy.must.playFromArsenal(saltwaterSwellRed);
      toDefend(empty);
      expectCombat(empty).toHaveAttackPower(3).toHaveKeyword("go-again");
      missBlockAndClose(empty);
      expectFabPlayer(Defender).toHaveLife(9);
      expectFabCard(Gravy, lastDitchEffortBlue).toBeIn("graveyard");
      expectFabCard(Gravy, saltwaterSwellRed).toBeIn("graveyard");
      expectFabCard(Gravy, conquerorOfTheHighSeasRed).toBeIn("hand");
      Gravy.must.endTurn();
      empty.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveAP(0).toHaveResourceCount(0);

      const stocked = FabTestEngine.start(
        {
          hero: gravyBones,
          hand: [
            conquerorOfTheHighSeasRed,
            wailerHumperdinckYellow,
            lastDitchEffortBlue,
            lootTheHoldBlue,
          ],
          arsenal: [saltwaterSwellRed],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Stocked = stocked.as(gravyBones);
      Stocked.must.play(lootTheHoldBlue);
      stocked.helpers.resolveUntilIdle({ ordering: "listed" });
      Stocked.must.pitch(wailerHumperdinckYellow).playAttack(lastDitchEffortBlue);
      toDefend(stocked);
      expectCombat(stocked).toHaveAttackPower(4).notToHaveKeyword("go-again");
      missBlockAndClose(stocked);
      expectFabPlayer(Stocked).toHaveAP(0);
      expect(() => Stocked.must.playFromArsenal(saltwaterSwellRed)).toThrow();
      expectFabCard(Stocked, saltwaterSwellRed).toBeIn("arsenal");
    });

    it("GB-E1 [AAA] Dead Threads pays only after an ally hits the graveyard this turn", () => {
      const game = FabTestEngine.start(
        {
          hero: gravyBones,
          chest: [deadThreads],
          weapon2: [compassOfSunkenDepths],
          hand: [
            sawbonesDockHandYellow,
            scoobaSaltySeaDogYellow,
            lootTheHoldBlue,
            callToTheGraveBlue,
          ],
          arsenal: [conquerorOfTheHighSeasRed],
          resourcePoints: 1,
          deck: [
            ankaDragUnderYellow,
            ankaDragUnderYellow,
            ankaDragUnderYellow,
            ankaDragUnderYellow,
            ankaDragUnderYellow,
            ankaDragUnderYellow,
            ankaDragUnderYellow,
            ankaDragUnderYellow,
          ],
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Gravy = game.as(gravyBones);

      expect(() => Gravy.must.activate(deadThreads)).toThrow();
      expectFabCard(Gravy, deadThreads).toBeIn("chest");

      Gravy.must.play(callToTheGraveBlue);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        entityTargetCanonicalId: ankaDragUnderYellow.canonicalId,
      });
      expectFabCard(Gravy, ankaDragUnderYellow).toBeIn("graveyard");
      expectFabCard(Gravy, callToTheGraveBlue).toBeIn("graveyard");
      expectFabPlayer(Gravy).toHaveAP(1).toHaveResourceCount(1);

      Gravy.must.activate(deadThreads);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveResourceCount(2);
      expectFabCard(Gravy, deadThreads).toBeTapped();

      Gravy.play(ankaDragUnderYellow, { from: "graveyard" });
      game.passBoth();
      expectFabCard(Gravy, ankaDragUnderYellow).toBeIn("arena");
      expectFabPlayer(Gravy).toHaveAP(1).toHaveResourceCount(0);
      expect(Gravy.zone("arsenal")).toEqual([conquerorOfTheHighSeasRed.canonicalId]);
      Gravy.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("GB-E2 [AAA] creates Gold only when the Hook-enhanced Pirate hits", () => {
      for (const hits of [true, false]) {
        const game = FabTestEngine.start(
          {
            hero: gravyBones,
            arms: [goldBaitedHook],
            hand: [saltwaterSwellRed, avastYeBlue, jitteryBonesBlue, chumFriendlyFirstMateYellow],
            arsenal: [bloodInTheWaterRed],
            deck: 8,
          },
          {
            hero: dash,
            hand: hits ? [] : [commandAndConquerRed],
            life: 20,
            deck: 8,
          },
          manual,
        );
        const Gravy = game.as(gravyBones);
        const Defender = game.as(dash);

        Gravy.must.activate(goldBaitedHook);
        game.passBoth();
        Gravy.must.playAttack(saltwaterSwellRed, { pitch: [avastYeBlue] });
        game.advanceCombatTo("defend");
        if (hits) Defender.must.defend();
        else Defender.must.defend(commandAndConquerRed);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Defender).toHaveLife(hits ? 17 : 20);
        if (hits) expect(Gravy.zone("arena")).toContain("token:gold");
        else expect(Gravy.zone("arena")).not.toContain("token:gold");
        Gravy.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        if (hits) expectFabCard(Gravy, goldBaitedHook).toBeIn("arms");
        else expectFabCard(Gravy, goldBaitedHook).toBeIn("graveyard");
        expect(Gravy.zone("arsenal")).toEqual([bloodInTheWaterRed.canonicalId]);
      }
    });
    it("GB-D1 [AAA] Blood is 6 defense only when the paid card has watery grave", () => {
      const run = (payWatery: boolean) => {
        const game = FabTestEngine.start(
          {
            hero: bravo,
            hand: [mangleRed],
            resourcePoints: 4,
            deck: 8,
          },
          {
            hero: gravyBones,
            hand: [bloodInTheWaterRed, sawbonesDockHandYellow, jitteryBonesBlue, lootTheHoldBlue],
            arsenal: [sunkenTreasureBlue],
            deck: 8,
          },
          manual,
        );
        const Attacker = game.as(bravo);
        const Gravy = game.as(gravyBones);

        Attacker.must.playAttack(mangleRed);
        game.advanceCombatTo("defend");
        Gravy.must.defend();
        game.toReaction("defender");
        Gravy.must.playReaction(bloodInTheWaterRed);
        game.advanceToDecision(Gravy, "boolean");
        Gravy.chooseBoolean(true);
        const choice = Gravy.expectDecision("effect-resolution");
        const discardOption =
          choice.options.find((option) => option.id.toLowerCase().includes("discard")) ??
          choice.options[0]!;
        game.answerDecision(Gravy.id, { kind: "effect-resolution", optionId: discardOption.id });
        Gravy.chooseTargets(payWatery ? sawbonesDockHandYellow : lootTheHoldBlue);
        expectFabCard(Gravy, bloodInTheWaterRed).toHaveDefense(payWatery ? 6 : 4);
        game.helpers.resolveUntilIdle({ ordering: "listed" });

        expectFabPlayer(Gravy).toHaveLife(payWatery ? 18 : 16);
        expectFabCard(Gravy, payWatery ? sawbonesDockHandYellow : lootTheHoldBlue).toBeIn(
          "graveyard",
        );
        expect(Gravy.zone("arsenal")).toEqual([sunkenTreasureBlue.canonicalId]);
        Attacker.must.endTurn();
        Gravy.must.endTurn();
        game.helpers.resolveUntilIdle({ ordering: "listed" });
        expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
      };

      run(true);
      run(false);
    });

    it("GB-D3 [AAA] Sawbones prevents the first packet and Flexors is a Reaction-only 2{d}", () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [snatchRed, snatchRed],
          actionPoints: 2,
          deck: 8,
        },
        {
          hero: gravyBones,
          legs: [quickdodgeFlexors],
          arena: [sawbonesDockHandYellow],
          hand: [lootTheHoldBlue, jitteryBonesBlue, conquerorOfTheHighSeasRed, sunkenTreasureBlue],
          arsenal: [bloodInTheWaterRed],
          resourcePoints: 1,
          deck: 8,
        },
        manual,
      );
      const Attacker = game.as(dash);
      const Gravy = game.as(gravyBones);
      const firstSnatch = Attacker.cardsIn("hand", snatchRed)[0]!;
      const secondSnatch = Attacker.cardsIn("hand", snatchRed)[1]!;

      game.helpers.passPriorityTo(Gravy);
      expect(() => Gravy.must.activate(quickdodgeFlexors)).toThrow();
      expectFabCard(Gravy, quickdodgeFlexors).toBeIn("legs");
      Gravy.activate(sawbonesDockHandYellow, {
        abilityId: `${sawbonesDockHandYellow.canonicalId}:instantTNextTimePirateControlWouldDealtDamageTurnPreventNumber1`,
      });
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      game.helpers.passPriorityTo(Attacker);

      Attacker.must.playAttack(firstSnatch);
      game.advanceCombatTo("defend");
      Gravy.must.defend();
      game.toReaction("defender");
      Gravy.must.activate(quickdodgeFlexors);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveLife(19);

      Attacker.must.playAttack(secondSnatch);
      game.advanceCombatTo("defend");
      Gravy.must.defend();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveLife(15);
      expectFabCard(Gravy, quickdodgeFlexors).toBeIn("legs");

      Attacker.must.endTurn();
      game.helpers.resolveUntilIdle();
      Gravy.must.endTurn();
      game.helpers.resolveUntilIdle();
      expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("GB-D4 [AAA] Nullrune stops 1 arcane, then Sunken Treasure turns yellow Sawbones into Gold", () => {
      const game = FabTestEngine.start(
        {
          hero: blazeFiremind,
          hand: [volticBoltRed, snatchRed],
          actionPoints: 2,
          resourcePoints: 2,
          deck: 8,
        },
        {
          hero: gravyBones,
          head: [nullruneHood],
          hand: [
            sunkenTreasureBlue,
            sawbonesDockHandYellow,
            jitteryBonesBlue,
            conquerorOfTheHighSeasRed,
          ],
          arsenal: [bloodInTheWaterRed],
          graveyard: [sawbonesDockHandYellow],
          resourcePoints: 1,
          deck: 8,
        },
        manual,
      );
      const Blaze = game.as(blazeFiremind);
      const Gravy = game.as(gravyBones);
      const [gySawbones] = Gravy.cardsIn("graveyard", sawbonesDockHandYellow);

      Blaze.must.play(volticBoltRed, { target: Gravy.id });
      game.passBoth();
      const barrier = Gravy.expectDecision("option");
      Gravy.chooseOptions(barrier.options[0]!.id);
      expectFabPlayer(Gravy).toHaveLife(16).toHaveResourceCount(0);

      Blaze.must.playAttack(snatchRed);
      game.advanceCombatTo("defend");
      Gravy.must.defend(sunkenTreasureBlue);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: true,
        entityTargets: "minimum",
      });

      expectFabCard(Gravy, gySawbones!).toBeFaceDown();
      expect(Gravy.zone("arena")).toContain("token:gold");
      expect(Gravy.zone("arena").filter((id) => id === "token:gold")).toHaveLength(1);
      expect(Gravy.cardsIn("hand", sawbonesDockHandYellow)).toHaveLength(1);
      expect(Gravy.zone("arsenal")).toEqual([bloodInTheWaterRed.canonicalId]);
      Blaze.must.endTurn();
      Gravy.must.endTurn();
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Gravy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
  });
});
