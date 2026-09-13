/**
 * Illusionist play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { ebbingArcstrideRed } from "../../../../cards/src/cards/actions/ebbing-arcstride.ts";
import { cosmicDualityBlue } from "../../../../cards/src/cards/actions/cosmic-duality.ts";
import { zyggyStarlight } from "../../../../cards/src/cards/heroes/zyggy-starlight.ts";
import { fleeingStarbreezeBlue } from "../../../../cards/src/cards/instants/fleeing-starbreeze.ts";
import { hitAndRunBlue } from "../../../../cards/src/cards/actions/hit-and-run.ts";
import { warmongerSDiplomacyBlue } from "../../../../cards/src/cards/actions/warmonger-s-diplomacy.ts";
import { flickerTrickRed } from "../../../../cards/src/cards/defense-reactions/flicker-trick.ts";
import { vengefulApparitionBlue } from "../../../../cards/src/cards/actions/vengeful-apparition.ts";
import { swingBigRed } from "../../../../cards/src/cards/actions/swing-big.ts";
import { miragingMetamorphRed } from "../../../../cards/src/cards/actions/miraging-metamorph.ts";
import { shimmersOfSilverBlue } from "../../../../cards/src/cards/actions/shimmers-of-silver.ts";
import { hazeBendingBlue } from "../../../../cards/src/cards/actions/haze-bending.ts";
import { pierceRealityBlue } from "../../../../cards/src/cards/actions/pierce-reality.ts";
import { phantasmaclasmRed } from "../../../../cards/src/cards/actions/phantasmaclasm.ts";
import { spearsOfSurrealityRed } from "../../../../cards/src/cards/actions/spears-of-surreality.ts";
import { dreamWeavers } from "../../../../cards/src/cards/equipment/dream-weavers.ts";
import { irisOfReality } from "../../../../cards/src/cards/weapons/iris-of-reality.ts";
import { fractalCreationBlue } from "../../../../cards/src/cards/actions/fractal-creation.ts";
import { nourishingGlowBlue } from "../../../../cards/src/cards/instants/nourishing-glow.ts";
import { lunarMirageRed } from "../../../../cards/src/cards/actions/lunar-mirage.ts";
import { ironrotGauntlet } from "../../../../cards/src/cards/equipment/ironrot-gauntlet.ts";
import { crownOfProvidence } from "../../../../cards/src/cards/equipment/crown-of-providence.ts";
import { enlightenedStrikeRed } from "../../../../cards/src/cards/actions/enlightened-strike.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";
import { regurgitatingSlogRed } from "../../../../cards/src/cards/actions/regurgitating-slog.ts";
import { nimblismRed } from "../../../../cards/src/cards/actions/nimblism.ts";
import { nimblismBlue } from "../../../../cards/src/cards/actions/nimblism.ts";
import { glintTheQuicksilverBlue } from "../../../../cards/src/cards/attack-reactions/glint-the-quicksilver.ts";
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
} from "../../testing/index.ts";
import { emptyDash, toDefend, missBlockAndClose, manual } from "./helpers.ts";

describe("Illusionist play lines", () => {
  describe("Zyggy Starlight", () => {
    it("ZY-01 [AAA] Lunar and Spears chain into arsenal Phantasmaclasm", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [lunarMirageRed, spearsOfSurrealityRed, fractalCreationBlue, shimmersOfSilverBlue],
          arsenal: [phantasmaclasmRed],
          deck: 8,
        },
        { hero: dash, hand: [snatchRed], life: 20, deck: 8 },
        FAB_MANUAL_HARNESS,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Defender = game.as(dash);
      const bottomed = Defender.cardIn("hand", snatchRed);

      Zyggy.must.playAttack(lunarMirageRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(3).toHaveKeyword("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(17);
      expectFabPlayer(Zyggy).toHaveAP(1);

      Zyggy.must.playAttack(spearsOfSurrealityRed, { pitch: [shimmersOfSilverBlue] });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(12);
      expectFabPlayer(Zyggy).toHaveAP(1);

      Zyggy.must.playFromArsenal(phantasmaclasmRed, { pitch: [fractalCreationBlue] });
      for (let safety = 0; !game.getState().decision && safety < 8; safety += 1) {
        const priorityPlayerId = game.getPriorityPlayerId();
        if (!priorityPlayerId) break;
        game.pass(priorityPlayerId);
      }
      const phantasmChoice = game.getState().decision;
      if (phantasmChoice?.kind === "entity-target") {
        game.answerDecision(Zyggy.id, {
          kind: "entity-target",
          instanceIds: [bottomed.instanceId],
        });
      }
      expect(Defender.zone("deck")).toContain(snatchRed.canonicalId);
      toDefend(game);
      missBlockAndClose(game);

      expectFabPlayer(Defender).toHaveLife(3);
      expectFabCard(Zyggy, phantasmaclasmRed).toBeIn("graveyard");
      Zyggy.must.endTurn();
      expectFabPlayer(Zyggy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("ZY-H1 [AAA] Cosmic Duality Flow plus Fleeing lets Zyggy blink the aura once", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [cosmicDualityBlue, fleeingStarbreezeBlue, hazeBendingBlue, pierceRealityBlue],
          arsenal: [ebbingArcstrideRed],
          resourcePoints: 3,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Defender = game.as(dash);
      Zyggy.must.activate(cosmicDualityBlue);
      Zyggy.chooseTargetPlayers(Defender);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(19);
      expect(Zyggy.zone("arena")).toContain("token:lightning-flow");

      Zyggy.must.play(fleeingStarbreezeBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabCard(Zyggy, fleeingStarbreezeBlue).toBeIn("arena");

      Zyggy.must.activate(zyggyStarlight);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Zyggy.zone("arena")).not.toContain("token:lightning-flow");
      expectFabCard(Zyggy, fleeingStarbreezeBlue).toBeIn("arena");
      expectFabCard(Zyggy, fleeingStarbreezeBlue).toHaveCounters(1, "holo");
      expectFabCard(Zyggy, zyggyStarlight).toBeTapped();
      expect(Zyggy.zone("arsenal")).toEqual([ebbingArcstrideRed.canonicalId]);
    });

    it("ZY-H2 [AAA] Nourishing Glow gains life on enter and again after the blink", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [cosmicDualityBlue, nourishingGlowBlue, hazeBendingBlue, pierceRealityBlue],
          arsenal: [ebbingArcstrideRed],
          resourcePoints: 3,
          life: 40,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Zyggy = game.as(zyggyStarlight);
      Zyggy.must.activate(cosmicDualityBlue);
      Zyggy.chooseTargetPlayers(game.as(dash));
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      Zyggy.must.play(nourishingGlowBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Zyggy).toHaveLife(41);

      Zyggy.must.activate(zyggyStarlight);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Zyggy).toHaveLife(42);
      expectFabCard(Zyggy, nourishingGlowBlue).toHaveCounters(1, "holo");
    });

    it("ZY-H2 [AAA] a holo Lightning aura is not a legal blink target", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [cosmicDualityBlue],
          arena: [{ card: nourishingGlowBlue, state: { holoCounters: 1 } }],
          resourcePoints: 2,
          life: 40,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Zyggy = game.as(zyggyStarlight);
      Zyggy.must.activate(cosmicDualityBlue);
      Zyggy.chooseTargetPlayers(game.as(dash));
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(() => Zyggy.must.activate(zyggyStarlight)).toThrow();
      expectFabCard(Zyggy, nourishingGlowBlue).toHaveCounters(1, "holo");
      expectFabCard(Zyggy, zyggyStarlight).toBeReady();
    });

    it("ZY-H2 [AAA] a non-Lightning aura is not a legal blink target", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [cosmicDualityBlue, hazeBendingBlue],
          resourcePoints: 2,
          life: 40,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Zyggy = game.as(zyggyStarlight);
      Zyggy.must.activate(cosmicDualityBlue);
      Zyggy.chooseTargetPlayers(game.as(dash));
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Zyggy.must.play(hazeBendingBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(() => Zyggy.must.activate(zyggyStarlight)).toThrow();
      expectFabCard(Zyggy, hazeBendingBlue).toBeIn("arena");
      expectFabCard(Zyggy, zyggyStarlight).toBeReady();
    });

    it("ZY-02 [AAA] Phantasmaclasm is destroyed by a non-Illusionist power-6 defender", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [phantasmaclasmRed, cosmicDualityBlue, fleeingStarbreezeBlue, pierceRealityBlue],
          arsenal: [miragingMetamorphRed],
          deck: 8,
        },
        {
          hero: dash,
          hand: [snatchRed, regurgitatingSlogRed, hitAndRunBlue, glintTheQuicksilverBlue],
          deck: 8,
        },
        manual,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Defender = game.as(dash);
      const bottomed = Defender.cardIn("hand", snatchRed);

      Zyggy.must.playAttack(phantasmaclasmRed, { pitch: [cosmicDualityBlue] });
      for (let safety = 0; !game.getState().decision && safety < 8; safety += 1) {
        const priorityPlayerId = game.getPriorityPlayerId();
        if (!priorityPlayerId) break;
        game.pass(priorityPlayerId);
      }
      const handChoice = Zyggy.expectDecision("entity-target");
      expect(handChoice.candidates.map((candidate) => candidate.instanceId)).toContain(
        bottomed.instanceId,
      );
      game.answerDecision(Zyggy.id, {
        kind: "entity-target",
        instanceIds: [bottomed.instanceId],
      });
      expectFabPlayer(Defender).toHaveHandCount(4);
      expect(Defender.zone("hand")).toContain(regurgitatingSlogRed.canonicalId);
      expect(Defender.zone("deck")).toContain(snatchRed.canonicalId);

      for (let safety = 0; game.combat()?.step !== "defend" && safety < 8; safety += 1) {
        const priorityPlayerId = game.getPriorityPlayerId();
        if (!priorityPlayerId) break;
        game.pass(priorityPlayerId);
      }
      expectCombat(game).toBeAtStep("defend");
      Defender.defendWith(regurgitatingSlogRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expect(game.combat()).toBeNull();
      expectFabPlayer(Defender).toHaveLife(20);
      expectFabCard(Zyggy, phantasmaclasmRed).toBeIn("graveyard");
      expectFabCard(Defender, regurgitatingSlogRed).toBeIn("graveyard");
      expect(Zyggy.zone("arsenal")).toEqual([miragingMetamorphRed.canonicalId]);
      Zyggy.must.endTurn();
      expectFabPlayer(Zyggy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("ZY-03 [AAA] spectra and phantasm stay on the cards that print them", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [ebbingArcstrideRed, flickerTrickRed, hazeBendingBlue, nourishingGlowBlue],
          arsenal: [spearsOfSurrealityRed],
          resourcePoints: 1,
          deck: 8,
        },
        {
          hero: dash,
          hand: [regurgitatingSlogRed, glintTheQuicksilverBlue, hitAndRunBlue, snatchRed],
          deck: 8,
        },
        manual,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Attacker = game.as(dash);

      Zyggy.must.play(hazeBendingBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Zyggy.must.play(nourishingGlowBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Zyggy, hazeBendingBlue).toBeIn("arena").toHaveKeyword("spectra");
      expectFabCard(Zyggy, nourishingGlowBlue).toBeIn("arena").notToHaveKeyword("spectra");
      expectFabCard(Zyggy, nourishingGlowBlue).notToHaveKeyword("phantasm");
      expectFabCard(Zyggy, ebbingArcstrideRed).notToHaveKeyword("phantasm");
      expectFabPlayer(Zyggy).toHaveLife(41);

      Zyggy.must.endTurn();
      Attacker.must.pitch(glintTheQuicksilverBlue).playAttack(regurgitatingSlogRed);
      game.advanceCombatTo("defend");
      Zyggy.must.defend();
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Zyggy);
      Zyggy.must.playReaction(flickerTrickRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Zyggy, flickerTrickRed).toBeIn("graveyard").toHaveKeyword("mirage");
      expect(game.combat()).toBeNull();
      Attacker.must.endTurn();

      Zyggy.must.playAttack(ebbingArcstrideRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(5).notToHaveKeyword("phantasm");
      missBlockAndClose(game);
      expectFabPlayer(Attacker).toHaveLife(15);
      expectFabPlayer(Zyggy).toHaveAP(0);
      Zyggy.must.endTurn();
      expectFabPlayer(Zyggy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("ZY-04 [AAA] Enlightened Strike modes only grant their chosen effect", () => {
      const startMode = (_modeIndex: 0 | 1 | 2) =>
        FabTestEngine.start(
          {
            hero: zyggyStarlight,
            hand: [
              enlightenedStrikeRed,
              cosmicDualityBlue,
              vengefulApparitionBlue,
              warmongerSDiplomacyBlue,
            ],
            arsenal: [lunarMirageRed],
            resourcePoints: 1,
            deck: 8,
          },
          emptyDash,
          manual,
        );

      const plusPower = startMode(1);
      const PlusZyggy = plusPower.as(zyggyStarlight);
      PlusZyggy.must.activate(cosmicDualityBlue);
      PlusZyggy.chooseTargetPlayers(plusPower.as(dash));
      plusPower.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(PlusZyggy.zone("arena")).toContain("token:lightning-flow");
      PlusZyggy.play(enlightenedStrikeRed, { modeIndexes: [1] });
      if (plusPower.getState().decision?.kind === "entity-target") {
        PlusZyggy.chooseTargets(PlusZyggy.cardIn("hand", warmongerSDiplomacyBlue));
      }
      plusPower.passBoth();
      toDefend(plusPower);
      expectCombat(plusPower).toHaveAttackPower(7).notToHaveKeyword("go-again");
      missBlockAndClose(plusPower);
      expectFabPlayer(plusPower.as(dash)).toHaveLife(12);
      expectFabPlayer(PlusZyggy).toHaveAP(0);
      expect(PlusZyggy.zone("hand")).not.toContain(vengefulApparitionBlue.canonicalId);
      PlusZyggy.must.endTurn();
      expectFabPlayer(PlusZyggy).toHaveAP(0).toHaveResourceCount(0);

      const draw = startMode(0);
      const DrawZyggy = draw.as(zyggyStarlight);
      DrawZyggy.must.activate(cosmicDualityBlue);
      DrawZyggy.chooseTargetPlayers(draw.as(dash));
      draw.helpers.resolveUntilIdle({ ordering: "listed" });
      const handBefore = DrawZyggy.zone("hand").length;
      DrawZyggy.play(enlightenedStrikeRed, { modeIndexes: [0] });
      if (draw.getState().decision?.kind === "entity-target") {
        DrawZyggy.chooseTargets(DrawZyggy.cardIn("hand", warmongerSDiplomacyBlue));
      }
      draw.passBoth();
      toDefend(draw);
      expectCombat(draw).toHaveAttackPower(5).notToHaveKeyword("go-again");
      missBlockAndClose(draw);
      expect(DrawZyggy.zone("hand").length).toBeGreaterThan(handBefore - 2);
      expectFabPlayer(DrawZyggy).toHaveAP(0);
      DrawZyggy.must.endTurn();

      const goAgain = startMode(2);
      const GoZyggy = goAgain.as(zyggyStarlight);
      const GoDefender = goAgain.as(dash);
      GoZyggy.must.activate(cosmicDualityBlue);
      GoZyggy.chooseTargetPlayers(GoDefender);
      goAgain.helpers.resolveUntilIdle({ ordering: "listed" });
      GoZyggy.play(enlightenedStrikeRed, { modeIndexes: [2] });
      if (goAgain.getState().decision?.kind === "entity-target") {
        GoZyggy.chooseTargets(GoZyggy.cardIn("hand", warmongerSDiplomacyBlue));
      }
      goAgain.passBoth();
      toDefend(goAgain);
      expectCombat(goAgain).toHaveAttackPower(5).toHaveKeyword("go-again");
      missBlockAndClose(goAgain);
      expectFabPlayer(GoZyggy).toHaveAP(1);
      GoZyggy.must.playFromArsenal(lunarMirageRed);
      toDefend(goAgain);
      expectCombat(goAgain).toHaveAttackPower(3);
      missBlockAndClose(goAgain);
      expectFabPlayer(GoDefender).toHaveLife(11);
      GoZyggy.must.endTurn();
      expectFabPlayer(GoZyggy).toHaveAP(0).toHaveResourceCount(0);
    });

    it("ZY-05 [AAA] Flicker Trick closes the chain then Zyggy takes a normal turn", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [flickerTrickRed, fractalCreationBlue, hazeBendingBlue, nourishingGlowBlue],
          arsenal: [ebbingArcstrideRed],
          deck: 8,
        },
        {
          hero: dash,
          hand: [regurgitatingSlogRed, glintTheQuicksilverBlue, hitAndRunBlue, snatchRed],
          deck: 8,
        },
        manual,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Attacker = game.as(dash);
      Zyggy.must.endTurn();
      Attacker.must.pitch(glintTheQuicksilverBlue).playAttack(regurgitatingSlogRed);
      game.advanceCombatTo("defend");
      Zyggy.must.defend();
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Zyggy);
      Zyggy.must.playReaction(flickerTrickRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(game.combat()).toBeNull();
      expectFabCard(Zyggy, flickerTrickRed).toBeIn("graveyard");
      expectFabPlayer(Zyggy).toHaveLife(39);
      Attacker.must.endTurn();

      Zyggy.must.play(hazeBendingBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Zyggy.must.play(nourishingGlowBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Zyggy, hazeBendingBlue).toBeIn("arena");
      expectFabCard(Zyggy, nourishingGlowBlue).toBeIn("arena");
      expectFabPlayer(Zyggy).toHaveLife(40);
      expect(game.combat()).toBeNull();
      Zyggy.must.endTurn();
      expectFabPlayer(Zyggy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });

    it("ZY-06 [AAA] Metamorph copies only the chosen aura after phantasm destroy", () => {
      const happy = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [
            miragingMetamorphRed,
            fleeingStarbreezeBlue,
            pierceRealityBlue,
            shimmersOfSilverBlue,
          ],
          arsenal: [spearsOfSurrealityRed],
          resourcePoints: 1,
          deck: 8,
        },
        {
          hero: dash,
          hand: [regurgitatingSlogRed, snatchRed, hitAndRunBlue, glintTheQuicksilverBlue],
          deck: 8,
        },
        manual,
      );
      const Zyggy = happy.as(zyggyStarlight);
      const Defender = happy.as(dash);
      Zyggy.must.play(fleeingStarbreezeBlue);
      happy.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabCard(Zyggy, fleeingStarbreezeBlue).toBeIn("arena");
      Zyggy.must.playAttack(miragingMetamorphRed, { pitch: [pierceRealityBlue] });
      toDefend(happy);
      expectCombat(happy).toHaveKeyword("phantasm");
      Defender.defendWith(regurgitatingSlogRed);
      happy.helpers.resolveUntilIdle({ ordering: "listed", entityTargets: "minimum" });
      expect(happy.combat()).toBeNull();
      expectFabPlayer(Defender).toHaveLife(20);
      expectFabCard(Zyggy, miragingMetamorphRed).toBeIn("graveyard");
      expect(
        Zyggy.zone("arena").filter((id) => id === fleeingStarbreezeBlue.canonicalId).length,
      ).toBeGreaterThan(1);
      expect(Zyggy.zone("arena")).not.toContain(pierceRealityBlue.canonicalId);
      Zyggy.must.endTurn();
      expectFabPlayer(Zyggy).toHaveAP(0).toHaveResourceCount(0);

      const boundary = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [
            miragingMetamorphRed,
            fleeingStarbreezeBlue,
            pierceRealityBlue,
            shimmersOfSilverBlue,
          ],
          arsenal: [spearsOfSurrealityRed],
          resourcePoints: 1,
          deck: 8,
        },
        { hero: dash, hand: [nimblismBlue], deck: 8 },
        manual,
      );
      const Boundary = boundary.as(zyggyStarlight);
      Boundary.must.play(fleeingStarbreezeBlue);
      boundary.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      Boundary.must.playAttack(miragingMetamorphRed, { pitch: [pierceRealityBlue] });
      toDefend(boundary);
      boundary.as(dash).defendWith(nimblismBlue);
      boundary.helpers.resolveRestOfCombat();
      expectFabPlayer(boundary.as(dash)).toHaveLife(15);
      expect(
        Boundary.zone("arena").filter((id) => id === fleeingStarbreezeBlue.canonicalId),
      ).toHaveLength(1);
    });

    it("ZY-E1 [AAA] Iris attacks the aura as a 4-power weapon once per action phase", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          weapon1: [irisOfReality],
          hand: [hazeBendingBlue, shimmersOfSilverBlue, pierceRealityBlue, cosmicDualityBlue],
          arsenal: [ebbingArcstrideRed],
          resourcePoints: 3,
          actionPoints: 2,
          deck: 8,
        },
        emptyDash,
        manual,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Defender = game.as(dash);
      Zyggy.must.play(shimmersOfSilverBlue);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Zyggy, shimmersOfSilverBlue).toBeIn("arena");
      Zyggy.must.activate(shimmersOfSilverBlue);
      game.passBoth();
      game.passBoth();
      expectCombat(game).toHaveAttackPower(5).toHaveKeyword("go-again");
      expectFabCard(Zyggy, shimmersOfSilverBlue).toHaveCounters(1);
      toDefend(game);
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(15);
      expectFabPlayer(Zyggy).toHaveAP(1);
      expect(() => Zyggy.must.activate(shimmersOfSilverBlue)).toThrow();

      Zyggy.must.endTurn();
      expect(() => Zyggy.must.activate(shimmersOfSilverBlue)).toThrow();
      expectFabCard(Zyggy, irisOfReality).toBeIn("weapon1");
    });

    it("ZY-E2 [AAA] Dream Weavers strips phantasm for one attack then it returns next turn", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          arms: [dreamWeavers],
          hand: [phantasmaclasmRed, miragingMetamorphRed, cosmicDualityBlue, hazeBendingBlue],
          arsenal: [spearsOfSurrealityRed],
          resourcePoints: 3,
          deck: 8,
        },
        {
          hero: dash,
          hand: [regurgitatingSlogRed, swingBigRed, snatchRed, hitAndRunBlue],
          deck: 8,
        },
        manual,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Defender = game.as(dash);
      Zyggy.must.activate(dreamWeavers);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Zyggy, dreamWeavers).toBeIn("graveyard");
      expectFabPlayer(Zyggy).toHaveAP(1);

      Zyggy.must.playAttack(phantasmaclasmRed, { pitch: [cosmicDualityBlue] });
      for (let safety = 0; !game.getState().decision && safety < 8; safety += 1) {
        const priorityPlayerId = game.getPriorityPlayerId();
        if (!priorityPlayerId) break;
        game.pass(priorityPlayerId);
      }
      const bottomed = Defender.cardIn("hand", snatchRed);
      game.answerDecision(Zyggy.id, {
        kind: "entity-target",
        instanceIds: [bottomed.instanceId],
      });
      toDefend(game);
      expectCombat(game).notToHaveKeyword("phantasm");
      Defender.defendWith(regurgitatingSlogRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabPlayer(Defender).toHaveLife(13);
      expectFabCard(Zyggy, phantasmaclasmRed).toBeIn("graveyard");
      expect(() => Zyggy.must.playAttack(miragingMetamorphRed)).toThrow();
      Zyggy.must.endTurn();
      Defender.must.endTurn();

      Zyggy.must.playFromArsenal(spearsOfSurrealityRed, { pitch: [hazeBendingBlue] });
      toDefend(game);
      expectCombat(game).toHaveKeyword("phantasm");
      Defender.defendWith(swingBigRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(game.combat()).toBeNull();
      expectFabPlayer(Defender).toHaveLife(13);
      expectFabCard(Zyggy, spearsOfSurrealityRed).toBeIn("graveyard");
    });
    it("ZY-D1 [AAA] plays Flicker Trick only as an arsenal reaction and resolves Mirage", () => {
      const game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [phantasmaclasmRed, fleeingStarbreezeBlue, nourishingGlowBlue, cosmicDualityBlue],
          arsenal: [flickerTrickRed],
          deck: 8,
        },
        {
          hero: dash,
          hand: [regurgitatingSlogRed, glintTheQuicksilverBlue, hitAndRunBlue, snatchRed],
          deck: 8,
        },
        manual,
      );
      const Zyggy = game.as(zyggyStarlight);
      const Attacker = game.as(dash);
      Zyggy.must.endTurn();
      Attacker.must.pitch(glintTheQuicksilverBlue).playAttack(regurgitatingSlogRed);
      game.advanceCombatTo("defend");
      const rejectedDefend = Zyggy.expectFailure({
        move: "defend",
        payload: { instanceIds: [Zyggy.cardIn("arsenal", flickerTrickRed).instanceId] },
      });
      expect(rejectedDefend.accepted).toBe(false);
      Zyggy.must.defend();
      game.advanceCombatTo("reaction");
      game.helpers.passPriorityTo(Zyggy);
      Zyggy.must.playFromArsenal(flickerTrickRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expectFabCard(Zyggy, flickerTrickRed).toBeIn("graveyard");
      expectFabPlayer(Zyggy).toHaveLife(39);
      expect(Zyggy.zone("arsenal")).toHaveLength(0);
      Attacker.must.endTurn();
      expectFabPlayer(Attacker).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("ZY-D2 [AAA] ordered Ward destruction triggers Haze once and re-evaluates the next packet", () => {
      let game = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          arena: [hazeBendingBlue, fleeingStarbreezeBlue, fleeingStarbreezeBlue],
          hand: [fleeingStarbreezeBlue, nourishingGlowBlue, hazeBendingBlue, cosmicDualityBlue],
          arsenal: [flickerTrickRed],
          deck: 8,
          life: 40,
        },
        {
          hero: dash,
          hand: [cosmicDualityBlue, cosmicDualityBlue, snatchRed, hitAndRunBlue],
          resourcePoints: 2,
          deck: 8,
        },
        manual,
      );
      let Zyggy = game.as(zyggyStarlight);
      let Attacker = game.as(dash);
      const fleeingWards = Zyggy.cardsIn("arena", fleeingStarbreezeBlue);
      expect(fleeingWards).toHaveLength(2);
      const fleeing = fleeingWards[0]!;

      game.helpers.resolveUntilIdle({ ordering: "listed" });
      Zyggy.must.endTurn();
      const armedWards = game.getState();
      game = FabTestEngine.fromState(
        restoreFabMatchSnapshot(
          serializeFabMatchSnapshot(armedWards),
          createFabMatchContext(armedWards.cardDefinitions, armedWards.publicCardIdentities),
        ),
      );
      Zyggy = game.as(zyggyStarlight);
      Attacker = game.as(dash);
      const lifeBeforeDamage = Zyggy.life();
      game.exec({
        move: "activate",
        actorId: Attacker.id,
        payload: { instanceId: Attacker.cardsIn("hand", cosmicDualityBlue)[0]!.instanceId },
      });
      const firstTarget = Attacker.expectDecision("entity-target");
      expect(firstTarget.candidates).not.toHaveLength(0);
      game.answerDecision(Attacker.id, {
        kind: "entity-target",
        instanceIds: [firstTarget.candidates[0]!.instanceId],
      });
      game.answerDecision(Attacker.id, {
        kind: "payment",
        instanceIds: [Attacker.cardIn("hand", hitAndRunBlue).instanceId],
      });
      game.advanceToDecision(Zyggy, "ordering");
      const ordering = Zyggy.expectDecision("ordering");
      const fleeingEntry = ordering.entries.find((entry) => entry.id.includes(fleeing.instanceId));
      expect(fleeingEntry).toBeDefined();

      game.answerDecision(Zyggy.id, {
        kind: "ordering",
        orderedIds: [
          fleeingEntry!.id,
          ...ordering.entries
            .filter((entry) => entry.id !== fleeingEntry!.id)
            .map((entry) => entry.id),
        ],
      });
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expect(Zyggy.zone("graveyard")).toContain(fleeingStarbreezeBlue.canonicalId);
      expect(Zyggy.zone("arena")).toContain(hazeBendingBlue.canonicalId);
      expect(Zyggy.cardsIn("arena", fleeingStarbreezeBlue)).toHaveLength(1);
      expect(Zyggy.zone("arena")).toContain("token:spectral-shield");
      expectFabPlayer(Zyggy).toHaveLife(lifeBeforeDamage);

      const stale = Zyggy.expectFailure({
        move: "answer-decision",
        payload: {
          decisionId: ordering.decisionId,
          stateVersion: ordering.stateVersion,
          answer: { kind: "ordering", orderedIds: ordering.entries.map((entry) => entry.id) },
        },
      });
      expect(stale.accepted).toBe(false);

      game.exec({
        move: "activate",
        actorId: Attacker.id,
        payload: { instanceId: Attacker.cardIn("hand", cosmicDualityBlue).instanceId },
      });
      const secondTarget = Attacker.expectDecision("entity-target");
      expect(secondTarget.candidates).not.toHaveLength(0);
      game.answerDecision(Attacker.id, {
        kind: "entity-target",
        instanceIds: [secondTarget.candidates[0]!.instanceId],
      });
      game.advanceToDecision(Zyggy, "ordering");
      const secondOrdering = Zyggy.expectDecision("ordering");
      const remainingFleeing = Zyggy.cardIn("arena", fleeingStarbreezeBlue);
      const remainingFleeingEntry = secondOrdering.entries.find((entry) =>
        entry.id.includes(remainingFleeing.instanceId),
      );
      expect(remainingFleeingEntry).toBeDefined();
      game.answerDecision(Zyggy.id, {
        kind: "ordering",
        orderedIds: [
          remainingFleeingEntry!.id,
          ...secondOrdering.entries
            .filter((entry) => entry.id !== remainingFleeingEntry!.id)
            .map((entry) => entry.id),
        ],
      });
      game.helpers.resolveUntilIdle({ ordering: "listed" });

      expect(Zyggy.cardsIn("graveyard", fleeingStarbreezeBlue)).toHaveLength(2);
      expect(Zyggy.zone("arena").filter((id) => id === "token:spectral-shield")).toHaveLength(1);
      expectFabPlayer(Zyggy).toHaveLife(lifeBeforeDamage);
    });
    it("ZY-D3 [AAA] Crown bottoms a chosen hand or arsenal card and refills normally", () => {
      for (const selected of [phantasmaclasmRed, sinkBelowRed] as const) {
        const game = FabTestEngine.start(
          {
            hero: zyggyStarlight,
            head: [crownOfProvidence],
            hand: [phantasmaclasmRed, cosmicDualityBlue, hazeBendingBlue, pierceRealityBlue],
            arsenal: [sinkBelowRed],
            deck: 8,
          },
          { hero: dash, hand: [snatchRed, snatchRed, snatchRed, snatchRed], deck: 8 },
          manual,
        );
        const Zyggy = game.as(zyggyStarlight);
        const Attacker = game.as(dash);
        Zyggy.must.endTurn();
        Attacker.must.playAttack(Attacker.cardsIn("hand", snatchRed)[0]!);
        game.advanceCombatTo("defend");
        Zyggy.defendWith(crownOfProvidence);
        game.helpers.resolveUntilIdle({
          optionalBoolean: true,
          entityTargetCanonicalId: selected.canonicalId,
        });
        game.helpers.resolveRestOfCombat();

        expectFabCard(Zyggy, crownOfProvidence).toBeIn("graveyard");
        expect(Zyggy.zone("deck")).toContain(selected.canonicalId);
        expect(Zyggy.zone("hand")).toHaveLength(selected === sinkBelowRed ? 5 : 4);
        expect(Zyggy.zone("arsenal")).toHaveLength(selected === sinkBelowRed ? 0 : 1);
        expectFabPlayer(Zyggy).toHaveLife(38);
        Attacker.must.endTurn();
        Zyggy.must.endTurn();
        expectFabPlayer(Zyggy)
          .toHaveHandCount(selected === sinkBelowRed ? 5 : 4)
          .toHaveAP(0)
          .toHaveResourceCount(0);
      }
    });
    it("ZY-C1 [AAA] fragments once per qualifying defender and ignores defense 1", () => {
      const startBranch = (defenseOne: boolean) =>
        FabTestEngine.start(
          {
            hero: zyggyStarlight,
            hand: [ebbingArcstrideRed, fractalCreationBlue, cosmicDualityBlue, hazeBendingBlue],
            arsenal: [spearsOfSurrealityRed],
            deck: 8,
          },
          {
            hero: dash,
            arms: defenseOne ? [ironrotGauntlet] : undefined,
            hand: [snatchRed, nimblismRed, regurgitatingSlogRed, glintTheQuicksilverBlue],
            deck: 8,
          },
          manual,
        );

      const qualifying = startBranch(false);
      const Zyggy = qualifying.as(zyggyStarlight);
      const Defender = qualifying.as(dash);
      Zyggy.must.playAttack(ebbingArcstrideRed);
      qualifying.advanceCombatTo("defend");
      Defender.must.defend(snatchRed, nimblismRed);
      expect(qualifying.combat()?.activeLink?.attackPower).toBe(1);
      expect(
        qualifying.committedEvents().filter((event) => event.name === "fragment"),
      ).toHaveLength(2);
      // Each fragment event triggers "Whenever this fragments" simultaneously;
      // CR 6.6.6b lets Zyggy order the identical go-again layers.
      qualifying.advanceToDecision(Zyggy, "ordering");
      const fragmentOrder = Zyggy.expectDecision("ordering");
      expect(fragmentOrder.entries).toHaveLength(2);
      qualifying.answerDecision(Zyggy.id, {
        kind: "ordering",
        orderedIds: fragmentOrder.entries.map((entry) => entry.id),
      });
      qualifying.helpers.resolveRestOfCombat();
      expectFabPlayer(Defender).toHaveLife(20);
      expect(Zyggy.zone("arsenal")).toEqual([spearsOfSurrealityRed.canonicalId]);
      Zyggy.must.endTurn();
      expectFabPlayer(Zyggy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);

      const boundary = startBranch(true);
      const BoundaryZyggy = boundary.as(zyggyStarlight);
      const BoundaryDefender = boundary.as(dash);
      BoundaryZyggy.must.playAttack(ebbingArcstrideRed);
      boundary.advanceCombatTo("defend");
      BoundaryDefender.defendWith(ironrotGauntlet);
      expect(boundary.combat()?.activeLink?.attackPower).toBe(5);
      expect(boundary.committedEvents().filter((event) => event.name === "fragment")).toHaveLength(
        0,
      );
      boundary.helpers.resolveRestOfCombat();
      expectFabPlayer(BoundaryDefender).toHaveLife(16);
      expectFabCard(BoundaryDefender, ironrotGauntlet).toBeIn("graveyard");
      expect(BoundaryZyggy.zone("arsenal")).toEqual([spearsOfSurrealityRed.canonicalId]);
      BoundaryZyggy.must.endTurn();
      expectFabPlayer(BoundaryZyggy).toHaveHandCount(4).toHaveAP(0).toHaveResourceCount(0);
    });
    it("ZY-C2 [AAA] Lunar copies a 6+ defender; Spears is destroyed instead", () => {
      const copy = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [lunarMirageRed, fractalCreationBlue, cosmicDualityBlue, hazeBendingBlue],
          arsenal: [spearsOfSurrealityRed],
          deck: 8,
        },
        {
          hero: dash,
          hand: [swingBigRed, regurgitatingSlogRed, snatchRed, hitAndRunBlue],
          deck: 8,
        },
        manual,
      );
      const Zyggy = copy.as(zyggyStarlight);
      const Defender = copy.as(dash);
      Zyggy.must.playAttack(lunarMirageRed);
      toDefend(copy);
      expectCombat(copy).toHaveAttackPower(3);
      Defender.defendWith(swingBigRed);
      copy.passBoth();
      expectCombat(copy).toHaveAttackPower(8);
      expectCombat(copy).notToHaveKeyword("phantasm");
      copy.helpers.resolveRestOfCombat();
      expectFabPlayer(Defender).toHaveLife(15);
      expectFabCard(Zyggy, lunarMirageRed).toBeIn("graveyard");
      Zyggy.must.endTurn();
      expectFabPlayer(Zyggy).toHaveAP(0).toHaveResourceCount(0);

      const phantasm = FabTestEngine.start(
        {
          hero: zyggyStarlight,
          hand: [lunarMirageRed, fractalCreationBlue, cosmicDualityBlue, hazeBendingBlue],
          arsenal: [spearsOfSurrealityRed],
          resourcePoints: 1,
          deck: 8,
        },
        {
          hero: dash,
          hand: [regurgitatingSlogRed, snatchRed, hitAndRunBlue, glintTheQuicksilverBlue],
          deck: 8,
        },
        manual,
      );
      const SpearsZyggy = phantasm.as(zyggyStarlight);
      const SpearsDefender = phantasm.as(dash);
      SpearsZyggy.must.playFromArsenal(spearsOfSurrealityRed, { pitch: [hazeBendingBlue] });
      toDefend(phantasm);
      expectCombat(phantasm).toHaveKeyword("phantasm").toHaveAttackPower(5);
      SpearsDefender.defendWith(regurgitatingSlogRed);
      phantasm.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(phantasm.combat()).toBeNull();
      expectFabPlayer(SpearsDefender).toHaveLife(20);
      expectFabCard(SpearsZyggy, spearsOfSurrealityRed).toBeIn("graveyard");
    });
  });
});
