/**
 * Mechanologist play lines from the tournament-deck QA inventory.
 *
 * Executable full-turn scenarios live together so each class can be read
 * and validated in one file.
 */
import { describe, expect, it } from "vitest";

import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { maximumVelocityRed } from "../../../../cards/src/cards/actions/maximum-velocity.ts";
import { zeroToSixtyRed } from "../../../../cards/src/cards/actions/zero-to-sixty.ts";
import { zipperHitRed } from "../../../../cards/src/cards/actions/zipper-hit.ts";
import { volticBoltRed } from "../../../../cards/src/cards/actions/voltic-bolt.ts";
import { pulsewaveHarpoonRed } from "../../../../cards/src/cards/actions/pulsewave-harpoon.ts";
import { singularityRed } from "../../../../cards/src/cards/actions/singularity.ts";
import { terminatorTankRed } from "../../../../cards/src/cards/actions/terminator-tank.ts";
import { warMachineRed } from "../../../../cards/src/cards/actions/war-machine.ts";
import { grindingGearsBlue } from "../../../../cards/src/cards/actions/grinding-gears.ts";
import { twinDriveRed } from "../../../../cards/src/cards/actions/twin-drive.ts";
import { steelStreetEnforcementBlue } from "../../../../cards/src/cards/blocks/steel-street-enforcement.ts";
import { cogwerxBaseHead } from "../../../../cards/src/cards/equipment/cogwerx-base-head.ts";
import { cogwerxBaseChest } from "../../../../cards/src/cards/equipment/cogwerx-base-chest.ts";
import { cogwerxBaseArms } from "../../../../cards/src/cards/equipment/cogwerx-base-arms.ts";
import { cogwerxBaseLegs } from "../../../../cards/src/cards/equipment/cogwerx-base-legs.ts";
import { evoSteelSoulMemoryBlue } from "../../../../cards/src/cards/actions/evo-steel-soul-memory.ts";
import { evoSteelSoulProcessorBlue } from "../../../../cards/src/cards/actions/evo-steel-soul-processor.ts";
import { evoSteelSoulControllerBlue } from "../../../../cards/src/cards/actions/evo-steel-soul-controller.ts";
import { evoSteelSoulTowerBlue } from "../../../../cards/src/cards/actions/evo-steel-soul-tower.ts";
import { teklovossenEsteemedMagnate } from "../../../../cards/src/cards/heroes/teklovossen-esteemed-magnate.ts";
import { teklovossenTheMechropotent } from "../../../../cards/src/cards/demi-heroes/teklovossen-the-mechropotent.ts";
import { fabricateRed } from "../../../../cards/src/cards/instants/fabricate.ts";
import { tekloLeveler } from "../../../../cards/src/cards/weapons/teklo-leveler.ts";
import { tBoneRed } from "../../../../cards/src/cards/actions/t-bone.ts";
import { evoRecallBlue } from "../../../../cards/src/cards/instants/evo-recall.ts";
import { evoSpeedslipBlue } from "../../../../cards/src/cards/instants/evo-speedslip.ts";
import { arcbaneGraspBlue } from "../../../../cards/src/cards/instants/arcbane-grasp.ts";
import { ghostProtocolArchitectRed } from "../../../../cards/src/cards/actions/ghost-protocol-architect.ts";
import { ghostProtocolMainframeBlue } from "../../../../cards/src/cards/actions/ghost-protocol-mainframe.ts";
import { blastRigRed } from "../../../../cards/src/cards/actions/blast-rig.ts";
import { tekloTrebuchet2000Blue } from "../../../../cards/src/cards/actions/teklo-trebuchet-2000.ts";
import { heavyMetalHardcoreRed } from "../../../../cards/src/cards/actions/heavy-metal-hardcore.ts";
import { evoBetaBaseHeadBlue } from "../../../../cards/src/cards/actions/evo-beta-base-head.ts";
import { evoBetaBaseChestBlue } from "../../../../cards/src/cards/actions/evo-beta-base-chest.ts";
import { evoBetaBaseArmsBlue } from "../../../../cards/src/cards/actions/evo-beta-base-arms.ts";
import { evoBetaBaseLegsBlue } from "../../../../cards/src/cards/actions/evo-beta-base-legs.ts";
import { ironrotGauntlet } from "../../../../cards/src/cards/equipment/ironrot-gauntlet.ts";
import { protoBaseHead } from "../../../../cards/src/cards/equipment/proto-base-head.ts";
import { firewallRed } from "../../../../cards/src/cards/blocks/firewall.ts";
import { snatchRed } from "../../../../cards/src/cards/actions/snatch.ts";

import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "../../testing/index.ts";
import { emptyDash, toDefend, missBlockAndClose, manual } from "./helpers.ts";

describe("Mechanologist play lines", () => {
  describe("Teklovossen, Esteemed Magnate", () => {
    it("TE-H1 [AAA] a face-down banished Evo is playable; a non-Evo is not", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          arms: [cogwerxBaseArms],
          hand: [evoBetaBaseChestBlue, evoBetaBaseHeadBlue, evoBetaBaseLegsBlue, zeroToSixtyRed],
          arsenal: [zeroToSixtyRed],
          banished: [evoBetaBaseArmsBlue],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      Teklo.play(evoBetaBaseArmsBlue, { from: "banished" });
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabCard(Teklo, evoBetaBaseArmsBlue).toBeIn("arms");

      const faceDown = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          arms: [cogwerxBaseArms],
          hand: [evoBetaBaseChestBlue, evoBetaBaseLegsBlue, zeroToSixtyRed],
          arsenal: [zeroToSixtyRed],
          banished: [{ card: evoBetaBaseArmsBlue, state: { faceDown: true } }],
          resourcePoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const FaceDown = faceDown.as(teklovossenEsteemedMagnate);
      FaceDown.play(evoBetaBaseArmsBlue, { from: "banished" });
      faceDown.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      expectFabCard(FaceDown, evoBetaBaseArmsBlue).toBeIn("arms");

      const nonEvo = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [
            evoBetaBaseChestBlue,
            evoBetaBaseHeadBlue,
            evoBetaBaseLegsBlue,
            evoBetaBaseArmsBlue,
          ],
          arsenal: [zeroToSixtyRed],
          banished: [snatchRed],
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      expect(() =>
        nonEvo.as(teklovossenEsteemedMagnate).play(snatchRed, { from: "banished" }),
      ).toThrow();
    });

    it("TE-H2 [AAA] the hero instant makes the next Evo instant-speed and draws once", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          head: [cogwerxBaseHead],
          chest: [cogwerxBaseChest],
          arms: [cogwerxBaseArms],
          legs: [cogwerxBaseLegs],
          hand: [snatchRed, evoBetaBaseHeadBlue, evoSteelSoulMemoryBlue, evoSteelSoulProcessorBlue],
          arsenal: [zeroToSixtyRed],
          resourcePoints: 3,
          actionPoints: 1,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
      Teklo.playAttack(snatchRed);
      game.toReaction("attacker");
      Teklo.must.activate(teklovossenEsteemedMagnate);
      game.passBoth();
      expect(game.combat()?.open).toBe(true);
      const handBefore = Teklo.zone("hand").length;
      Teklo.play(evoBetaBaseHeadBlue);
      expect(game.combat()?.open).toBe(true);
      expect(() => Teklo.play(evoSteelSoulMemoryBlue)).toThrow();
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, evoBetaBaseHeadBlue).toBeIn("head");
      expect(Teklo.zone("hand").length).toBeGreaterThanOrEqual(handBefore);
      expectFabCard(Teklo, evoSteelSoulMemoryBlue).toBeIn("hand");
    });

    it("TE-01 [AAA] two Mechanologist boosts refund AP; Maximum Velocity needs three", () => {
      const mechDeck = [
        grindingGearsBlue,
        grindingGearsBlue,
        grindingGearsBlue,
        grindingGearsBlue,
        grindingGearsBlue,
        grindingGearsBlue,
        grindingGearsBlue,
        grindingGearsBlue,
      ] as const;
      const twoBoosts = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [zeroToSixtyRed, zipperHitRed, evoBetaBaseArmsBlue, evoSteelSoulControllerBlue],
          arsenal: [maximumVelocityRed],
          deck: [...mechDeck],
          resourcePoints: 1,
        },
        emptyDash,
        manual,
      );
      const Teklo = twoBoosts.as(teklovossenEsteemedMagnate);
      const Defender = twoBoosts.as(dash);
      Teklo.must.playAttack(zeroToSixtyRed, { boost: true });
      toDefend(twoBoosts);
      expectCombat(twoBoosts).toHaveAttackPower(4).toHaveKeyword("go-again");
      expect(Teklo.zone("banished")).toContain(grindingGearsBlue.canonicalId);
      missBlockAndClose(twoBoosts);
      expectFabPlayer(Teklo).toHaveAP(1);
      Teklo.must.playAttack(zipperHitRed, { boost: true });
      toDefend(twoBoosts);
      expectCombat(twoBoosts).toHaveAttackPower(5).toHaveKeyword("go-again");
      missBlockAndClose(twoBoosts);
      expectFabPlayer(Defender).toHaveLife(11);
      expect(Teklo.cardsIn("banished", grindingGearsBlue).length).toBeGreaterThanOrEqual(2);
      expect(() => Teklo.must.playFromArsenal(maximumVelocityRed)).toThrow();
      expectFabCard(Teklo, maximumVelocityRed).toBeIn("arsenal");
      expect(twoBoosts.renderedPlayerNarrative(Teklo.id)).toEqual([
        "You played Zero To Sixty.",
        "You boosted with Zero To Sixty, banishing Grinding Gears.",
        "You attacked Opponent with Zero To Sixty.",
        "Zero To Sixty hit Opponent for 4.",
        "You played Zipper Hit.",
        "You boosted with Zipper Hit, banishing Grinding Gears.",
        "You attacked Opponent with Zipper Hit.",
        "Zipper Hit hit Opponent for 5.",
      ]);
      expect(twoBoosts.renderedPlayerNarrative(Defender.id)).toEqual([
        "Opponent played Zero To Sixty.",
        "Opponent boosted with Zero To Sixty, banishing Grinding Gears.",
        "Opponent attacked You with Zero To Sixty.",
        "Zero To Sixty hit You for 4.",
        "Opponent played Zipper Hit.",
        "Opponent boosted with Zipper Hit, banishing Grinding Gears.",
        "Opponent attacked You with Zipper Hit.",
        "Zipper Hit hit You for 5.",
      ]);
      Teklo.must.endTurn();
      expectFabPlayer(Teklo).toHaveAP(0).toHaveResourceCount(0);

      const threeBoosts = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [zeroToSixtyRed, zeroToSixtyRed, zeroToSixtyRed, zipperHitRed],
          arsenal: [maximumVelocityRed],
          deck: [...mechDeck],
          resourcePoints: 2,
        },
        emptyDash,
        manual,
      );
      const Fast = threeBoosts.as(teklovossenEsteemedMagnate);
      const zeros = Fast.cardsIn("hand", zeroToSixtyRed);
      Fast.must.playAttack(zeros[0]!, { boost: true });
      threeBoosts.advanceCombatTo("resolution");
      Fast.must.playAttack(zeros[1]!, { boost: true });
      threeBoosts.advanceCombatTo("resolution");
      Fast.must.playAttack(zeros[2]!, { boost: true });
      threeBoosts.advanceCombatTo("resolution");
      Fast.play(maximumVelocityRed, { from: "arsenal" });
      threeBoosts.passBoth();
      expectCombat(threeBoosts).toHaveAttackPower(10);
      expect(Fast.zone("arsenal")).not.toContain(maximumVelocityRed.canonicalId);
      threeBoosts.helpers.resolveRestOfCombat();
      if (!threeBoosts.hasGameEnded()) Fast.must.endTurn();
    });

    it("TE-02 [AAA] Fabricate and Evos transform permitted bases and reject a duplicate slot", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          head: [cogwerxBaseHead],
          chest: [cogwerxBaseChest],
          hand: [fabricateRed, evoBetaBaseChestBlue, evoSteelSoulMemoryBlue, evoRecallBlue],
          arsenal: [ghostProtocolArchitectRed],
          inventory: [protoBaseHead],
          resourcePoints: 4,
          actionPoints: 2,
          deck: 8,
        },
        emptyDash,
        manual,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      Teklo.must.play(evoBetaBaseChestBlue);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, evoBetaBaseChestBlue).toBeIn("chest");
      Teklo.must.play(evoSteelSoulMemoryBlue);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, evoSteelSoulMemoryBlue).toBeIn("head");
      // Release Notes — Bright Lights & Round the Table: Steel Souls only
      // trigger when they transform from/into an Evo. Cogwerx Base Head is
      // Base-only (no Evo subtype), so Memory's transform trigger does not
      // fire here and intellect stays at the hero's printed value.
      expect(Teklo.intellect()).toBe(4);
      Teklo.must.play(evoRecallBlue);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, evoRecallBlue).toBeIn("head");
      expect(Teklo.zone("head")).not.toContain(evoSteelSoulMemoryBlue.canonicalId);
      Teklo.play(fabricateRed, { modeIndexes: [1, 3] });
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, fabricateRed).toBeIn("graveyard");
      expectFabCard(Teklo, evoBetaBaseChestBlue).toBeIn("chest");
      Teklo.must.endTurn();
      expectFabPlayer(Teklo).toHaveAP(0).toHaveResourceCount(0);
    });

    it("TE-03 [AAA] Trebuchet then boosted T-Bone convert and leave no residue", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [blastRigRed, tBoneRed, tekloTrebuchet2000Blue, steelStreetEnforcementBlue],
          arsenal: [twinDriveRed],
          deck: [
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
          ],
        },
        emptyDash,
        manual,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      const Defender = game.as(dash);
      Teklo.must.playAttack(tekloTrebuchet2000Blue, { boost: true });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(1).toHaveKeyword("go-again");
      // Trebuchet's boost bonus lasts only for this combat chain. Keep the
      // chain open through the first attack's Resolution Step.
      game.advanceCombatTo("resolution");
      expectFabPlayer(Defender).toHaveLife(19);
      Teklo.must.playAttack(tBoneRed, { boost: true });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(5);
      missBlockAndClose(game);
      expectFabPlayer(Defender).toHaveLife(14);
      expectFabCard(Teklo, tBoneRed).toBeIn("graveyard");
      Teklo.must.endTurn();
      expectFabPlayer(Teklo).toHaveAP(0).toHaveResourceCount(0);
    });

    it("TE-04 [AAA] Firewall defends, then Pulsewave and Tank spend distinct resources", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          head: [evoBetaBaseHeadBlue],
          chest: [evoBetaBaseChestBlue],
          hand: [firewallRed, pulsewaveHarpoonRed, arcbaneGraspBlue, evoSpeedslipBlue],
          arsenal: [terminatorTankRed],
          resourcePoints: 3,
          deck: [
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
          ],
        },
        {
          hero: dash,
          hand: [snatchRed],
          deck: 8,
        },
        manual,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      const Attacker = game.as(dash);
      Teklo.must.endTurn();
      Attacker.must.playAttack(snatchRed);
      game.advanceCombatTo("defend");
      Teklo.defendWith(firewallRed);
      game.helpers.resolveUntilIdle({ ordering: "listed" });
      expectFabCard(Teklo, firewallRed).toBeIn("graveyard");
      expectFabPlayer(Teklo).toHaveLife(40);
      Attacker.must.endTurn();

      Teklo.play(pulsewaveHarpoonRed, { pitch: [arcbaneGraspBlue], boost: true });
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, pulsewaveHarpoonRed).toBeIn("graveyard");
      Teklo.must.pitch(evoSpeedslipBlue).playFromArsenal(terminatorTankRed);
      toDefend(game);
      expectCombat(game).toHaveAttackPower(6);
      expect(Teklo.zone("hand")).not.toContain(arcbaneGraspBlue.canonicalId);
      expect(Teklo.zone("hand")).not.toContain(evoSpeedslipBlue.canonicalId);
    });

    it("TE-05 [AAA] high-cost line declines optionals and leaves no residue", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          chest: [cogwerxBaseChest],
          hand: [
            heavyMetalHardcoreRed,
            warMachineRed,
            evoSteelSoulProcessorBlue,
            ghostProtocolMainframeBlue,
          ],
          arsenal: [singularityRed],
          resourcePoints: 4,
          actionPoints: 2,
          deck: [
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
          ],
        },
        emptyDash,
        manual,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      Teklo.must.play(evoSteelSoulProcessorBlue);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, evoSteelSoulProcessorBlue).toBeIn("chest");
      Teklo.must.playAttack(heavyMetalHardcoreRed, { boost: true });
      toDefend(game);
      expectCombat(game).toHaveAttackPower(3);
      missBlockAndClose(game);
      expectFabCard(Teklo, singularityRed).toBeIn("arsenal");
      expectFabCard(Teklo, warMachineRed).toBeIn("hand");
      Teklo.must.endTurn();
      expect(game.getState().decision).toBeFalsy();
      expectFabPlayer(Teklo).toHaveAP(0);
    });

    it("TE-E1 [AAA] Teklo Leveler thresholds 0/1/2/3/4 recompute without stale modifiers", () => {
      const levelerAt = (evoCount: 0 | 1 | 2 | 3 | 4, resourcePoints: number) =>
        FabTestEngine.start(
          {
            hero: teklovossenEsteemedMagnate,
            weapon1: [tekloLeveler],
            head: evoCount >= 1 ? [evoBetaBaseHeadBlue] : undefined,
            chest: evoCount >= 2 ? [evoBetaBaseChestBlue] : undefined,
            arms: evoCount >= 3 ? [evoBetaBaseArmsBlue] : undefined,
            legs: evoCount >= 4 ? [evoBetaBaseLegsBlue] : undefined,
            hand: [
              evoBetaBaseArmsBlue,
              evoBetaBaseChestBlue,
              evoBetaBaseHeadBlue,
              evoBetaBaseLegsBlue,
            ],
            arsenal: [zeroToSixtyRed],
            resourcePoints,
            deck: 8,
          },
          emptyDash,
          manual,
        );

      const zero = levelerAt(0, 3);
      zero.as(teklovossenEsteemedMagnate).expectActivationRejected(tekloLeveler);

      const one = levelerAt(1, 3);
      const One = one.as(teklovossenEsteemedMagnate);
      One.must.activate(tekloLeveler);
      one.passBoth();
      expectCombat(one).toHaveAttackPower(2).notToHaveKeyword("go-again");
      one.helpers.resolveRestOfCombat();
      expectFabPlayer(One).toHaveAP(0).toHaveResourceCount(0);

      const two = levelerAt(2, 1);
      const Two = two.as(teklovossenEsteemedMagnate);
      Two.must.activate(tekloLeveler);
      two.passBoth();
      expectCombat(two).toHaveAttackPower(2).notToHaveKeyword("go-again");
      two.helpers.resolveRestOfCombat();
      expectFabPlayer(Two).toHaveAP(0).toHaveResourceCount(0);

      const four = levelerAt(4, 1);
      const Four = four.as(teklovossenEsteemedMagnate);
      Four.must.activate(tekloLeveler);
      four.passBoth();
      expectCombat(four).toHaveAttackPower(3).toHaveKeyword("go-again");
      four.helpers.resolveRestOfCombat();
      expectFabPlayer(four.as(dash)).toHaveLife(17);
      expectFabPlayer(Four).toHaveAP(1);

      const three = levelerAt(3, 1);
      const Three = three.as(teklovossenEsteemedMagnate);
      Three.must.activate(tekloLeveler);
      three.passBoth();
      expectCombat(three).toHaveAttackPower(2).toHaveKeyword("go-again");
      three.helpers.resolveRestOfCombat();
      expectFabPlayer(Three).toHaveAP(1);
    });

    it("TE-E2 [AAA] Steel Souls transform over Base-only bases without triggering; no base means no transform", () => {
      const memory = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          head: [cogwerxBaseHead],
          hand: [
            evoSteelSoulControllerBlue,
            evoSteelSoulMemoryBlue,
            evoSteelSoulProcessorBlue,
            evoSteelSoulTowerBlue,
          ],
          arsenal: [zeroToSixtyRed],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        manual,
      );
      const Memory = memory.as(teklovossenEsteemedMagnate);
      const intellectBefore = Memory.intellect();
      Memory.must.play(evoSteelSoulMemoryBlue);
      memory.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Memory, evoSteelSoulMemoryBlue).toBeIn("head");
      // Release Notes — Bright Lights & Round the Table: transforming from a
      // Base-only equipment (Cogwerx Base Head has no Evo subtype) does not
      // trigger Steel Soul. Intellect is unchanged.
      expect(Memory.intellect()).toBe(intellectBefore);

      const processor = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          chest: [cogwerxBaseChest],
          hand: [
            evoSteelSoulControllerBlue,
            evoSteelSoulMemoryBlue,
            evoSteelSoulProcessorBlue,
            evoSteelSoulTowerBlue,
          ],
          arsenal: [zeroToSixtyRed],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        manual,
      );
      const Processor = processor.as(teklovossenEsteemedMagnate);
      Processor.must.play(evoSteelSoulProcessorBlue);
      processor.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Processor, evoSteelSoulProcessorBlue).toBeIn("chest");
      // Release Notes — Bright Lights & Round the Table: transforming from a
      // Base-only equipment (Cogwerx Base Chest has no Evo subtype) does not
      // trigger Steel Soul, so no resources are gained (4 - 4 cost = 0).
      expectFabPlayer(Processor).toHaveResourceCount(0);

      const tower = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          legs: [cogwerxBaseLegs],
          hand: [
            evoSteelSoulControllerBlue,
            evoSteelSoulMemoryBlue,
            evoSteelSoulProcessorBlue,
            evoSteelSoulTowerBlue,
          ],
          arsenal: [zeroToSixtyRed],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        manual,
      );
      const Tower = tower.as(teklovossenEsteemedMagnate);
      Tower.must.play(evoSteelSoulTowerBlue);
      tower.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: true,
        entityTargets: "minimum",
      });
      expectFabCard(Tower, evoSteelSoulTowerBlue).toBeIn("legs");
      // Same ruling: no trigger from a Base-only base, so the AP spent to
      // play Tower is not refunded (1 start - 1 play = 0).
      expectFabPlayer(Tower).toHaveAP(0);

      const controller = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          arms: [cogwerxBaseArms],
          hand: [
            evoSteelSoulControllerBlue,
            evoSteelSoulMemoryBlue,
            evoSteelSoulProcessorBlue,
            evoSteelSoulTowerBlue,
          ],
          arsenal: [zeroToSixtyRed],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        manual,
      );
      const Controller = controller.as(teklovossenEsteemedMagnate);
      Controller.must.play(evoSteelSoulControllerBlue);
      controller.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Controller, evoSteelSoulControllerBlue).toBeIn("arms");

      const noBase = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [
            evoSteelSoulControllerBlue,
            evoSteelSoulMemoryBlue,
            evoSteelSoulProcessorBlue,
            evoSteelSoulTowerBlue,
          ],
          arsenal: [zeroToSixtyRed],
          resourcePoints: 4,
          deck: 8,
        },
        emptyDash,
        manual,
      );
      const Bare = noBase.as(teklovossenEsteemedMagnate);
      Bare.must.play(evoSteelSoulMemoryBlue);
      noBase.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expect(Bare.zone("head")).not.toContain(evoSteelSoulMemoryBlue.canonicalId);
    });

    it("TE-E3 [AAA] Cogwerx Chest and Legs spend steam only after a boost", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          chest: [cogwerxBaseChest],
          legs: [cogwerxBaseLegs],
          hand: [zeroToSixtyRed, tBoneRed, ghostProtocolMainframeBlue, evoSpeedslipBlue],
          arsenal: [twinDriveRed],
          resourcePoints: 3,
          deck: [
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
          ],
        },
        emptyDash,
        manual,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, cogwerxBaseChest).toHaveCounters(1, "steam");
      expectFabCard(Teklo, cogwerxBaseLegs).toHaveCounters(1, "steam");
      Teklo.expectActivationRejected(cogwerxBaseChest);
      Teklo.expectActivationRejected(cogwerxBaseLegs);

      Teklo.must.playAttack(zeroToSixtyRed, { boost: true });
      game.helpers.resolveRestOfCombat();
      Teklo.must.activate(cogwerxBaseChest);
      game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
      expectFabCard(Teklo, cogwerxBaseChest).toHaveCounters(0, "steam");
      expectFabPlayer(Teklo).toHaveResourceCount(4);
      Teklo.must.activate(cogwerxBaseLegs);
      game.helpers.resolveUntilIdle({ optionalBoolean: false, entityTargets: "minimum" });
      expectFabCard(Teklo, cogwerxBaseLegs).toHaveCounters(0, "steam");
      expectFabPlayer(Teklo).toHaveAP(2);
      Teklo.expectActivationRejected(cogwerxBaseChest);
      Teklo.must.endTurn();
    });

    it("TE-E4 [AAA] Singularity merges the full suit and preserves Teklovossen's life", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          weapon1: [tekloLeveler],
          head: [evoSteelSoulMemoryBlue],
          chest: [evoSteelSoulProcessorBlue],
          arms: [evoSteelSoulControllerBlue],
          legs: [evoSteelSoulTowerBlue],
          hand: [
            maximumVelocityRed,
            zeroToSixtyRed,
            evoSteelSoulControllerBlue,
            evoSteelSoulMemoryBlue,
          ],
          arsenal: [singularityRed],
          resourcePoints: 6,
          actionPoints: 1,
          life: 27,
          deck: 8,
        },
        emptyDash,
        FAB_MANUAL_HARNESS,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);

      Teklo.play(singularityRed, { from: "arsenal" });
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });

      expect(Teklo.hero()).toBe(teklovossenTheMechropotent.canonicalId);
      expectFabPlayer(Teklo).toHaveLife(27).toHaveAP(2);
      expect(Teklo.zone("weapon1")).toEqual([]);
      expect(Teklo.zone("head")).toEqual([]);
      expect(Teklo.zone("chest")).toEqual([]);
      expect(Teklo.zone("arms")).toEqual([]);
      expect(Teklo.zone("legs")).toEqual([]);
      expect(Teklo.zone("soul")).toHaveLength(5);
      expect(Teklo.zone("soul")).toEqual(
        expect.arrayContaining([
          tekloLeveler.canonicalId,
          evoSteelSoulMemoryBlue.canonicalId,
          evoSteelSoulProcessorBlue.canonicalId,
          evoSteelSoulControllerBlue.canonicalId,
          evoSteelSoulTowerBlue.canonicalId,
        ]),
      );
      expectFabCard(Teklo, singularityRed).toBeIn("arena");
    });

    it("TE-D1 [AAA] Fabricate +1{d} and Enforcement count equipped Evos this turn", () => {
      const game = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          arms: [evoBetaBaseArmsBlue],
          chest: [evoBetaBaseChestBlue],
          hand: [
            firewallRed,
            evoBetaBaseArmsBlue,
            evoBetaBaseChestBlue,
            steelStreetEnforcementBlue,
          ],
          arsenal: [fabricateRed],
          deck: 8,
          life: 40,
        },
        {
          hero: dash,
          hand: [snatchRed],
          deck: 8,
        },
        manual,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      const Attacker = game.as(dash);
      Teklo.must.endTurn();
      game.helpers.passPriorityTo(Teklo);
      Teklo.play(fabricateRed, { from: "arsenal", modeIndexes: [1, 3] });
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      expectFabCard(Teklo, fabricateRed).toBeIn("graveyard");
      Attacker.must.playAttack(snatchRed);
      toDefend(game);
      const defendingArms = Teklo.cardIn("arms", evoBetaBaseArmsBlue);
      expectFabCard(Teklo, defendingArms).toHaveDefense(2);
      Teklo.defendWith([defendingArms, steelStreetEnforcementBlue]);
      expect(game.combat()?.activeLink?.attackPower).toBeDefined();
      game.helpers.resolveRestOfCombat();
      expectFabCard(Teklo, steelStreetEnforcementBlue).toBeIn("graveyard");
      // CR 8.4.11 Evo Upgrade counts every card equipped with the Evo subtype
      // at damage time: the arms evo defending on the chain remains an equipped
      // Equipment and the chest evo is still in its slot, so the 1{d} block
      // defends at 1+2=3 alongside the arms evo's 2 (Fabricate +1{d}) — Snatch's
      // 4{p} is fully soaked and life stays 40. (The pre-8.4.11-runtime-count
      // expectation of 39 was stale once evos-equipped resolved at runtime.)
      expectFabPlayer(Teklo).toHaveLife(40);
      Attacker.must.endTurn();
    });

    it("TE-D2 [AAA] Firewall keeps an Evo on top and bottoms a non-Evo", () => {
      const evoTop = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [
            firewallRed,
            evoBetaBaseArmsBlue,
            evoBetaBaseChestBlue,
            steelStreetEnforcementBlue,
          ],
          arsenal: [fabricateRed],
          deck: [
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            evoSteelSoulMemoryBlue,
          ],
          life: 40,
        },
        { hero: dash, hand: [snatchRed], deck: 8 },
        manual,
      );
      const Teklo = evoTop.as(teklovossenEsteemedMagnate);
      const Attacker = evoTop.as(dash);
      Teklo.must.endTurn();
      Attacker.must.playAttack(snatchRed);
      evoTop.advanceCombatTo("defend");
      Teklo.defendWith(firewallRed);
      evoTop.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Teklo.zone("deck").at(-1)).toBe(evoSteelSoulMemoryBlue.canonicalId);
      expectFabCard(Teklo, firewallRed).toBeIn("graveyard");
      expectFabPlayer(Teklo).toHaveLife(40);

      const nonEvo = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [
            firewallRed,
            evoBetaBaseArmsBlue,
            evoBetaBaseChestBlue,
            steelStreetEnforcementBlue,
          ],
          arsenal: [fabricateRed],
          deck: [
            evoSteelSoulMemoryBlue,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            snatchRed,
            grindingGearsBlue,
          ],
          life: 40,
        },
        { hero: dash, hand: [snatchRed], deck: 8 },
        manual,
      );
      const Bottom = nonEvo.as(teklovossenEsteemedMagnate);
      nonEvo.as(teklovossenEsteemedMagnate).must.endTurn();
      nonEvo.as(dash).must.playAttack(snatchRed);
      nonEvo.advanceCombatTo("defend");
      Bottom.defendWith(firewallRed);
      nonEvo.helpers.resolveUntilIdle({ ordering: "listed" });
      expect(Bottom.zone("deck")[0]).toBe(grindingGearsBlue.canonicalId);
      expect(Bottom.zone("deck").at(-1)).not.toBe(grindingGearsBlue.canonicalId);
    });

    it("TE-D3 [AAA] boosted T-Bone forces equipment defense only when able", () => {
      const forced = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [tBoneRed, zeroToSixtyRed, evoBetaBaseArmsBlue, evoBetaBaseChestBlue],
          arsenal: [twinDriveRed],
          deck: [
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
          ],
        },
        {
          hero: dash,
          arms: [ironrotGauntlet],
          hand: [],
          deck: 8,
        },
        manual,
      );
      const Teklo = forced.as(teklovossenEsteemedMagnate);
      const Defender = forced.as(dash);
      Teklo.must.playAttack(zeroToSixtyRed, { boost: true });
      forced.advanceCombatTo("resolution");
      Teklo.must.playAttack(tBoneRed);
      toDefend(forced);
      Defender.defendWith(ironrotGauntlet);
      forced.helpers.resolveRestOfCombat();
      expectFabCard(Defender, ironrotGauntlet).toBeIn("graveyard");

      const free = FabTestEngine.start(
        {
          hero: teklovossenEsteemedMagnate,
          hand: [tBoneRed, zeroToSixtyRed, evoBetaBaseArmsBlue, evoBetaBaseChestBlue],
          arsenal: [twinDriveRed],
          deck: [
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
            grindingGearsBlue,
          ],
        },
        emptyDash,
        manual,
      );
      const FreeTeklo = free.as(teklovossenEsteemedMagnate);
      FreeTeklo.must.playAttack(zeroToSixtyRed, { boost: true });
      free.advanceCombatTo("resolution");
      FreeTeklo.must.playAttack(tBoneRed);
      toDefend(free);
      free.as(dash).must.defend();
      free.helpers.resolveRestOfCombat();
      expectFabPlayer(free.as(dash)).toHaveLife(13);
    });

    it("TE-D4 [AAA] instant Evos transform in the arcane window and reject a missing base", () => {
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [volticBoltRed],
          resourcePoints: 2,
          deck: 8,
        },
        {
          hero: teklovossenEsteemedMagnate,
          head: [cogwerxBaseHead],
          legs: [cogwerxBaseLegs],
          arms: [cogwerxBaseArms],
          hand: [arcbaneGraspBlue, evoRecallBlue, evoSpeedslipBlue, evoBetaBaseChestBlue],
          arsenal: [fabricateRed],
          resourcePoints: 1,
          deck: 8,
          life: 40,
        },
        manual,
      );
      const Teklo = game.as(teklovossenEsteemedMagnate);
      const Attacker = game.as(dash);
      game.helpers.resolveUntilIdle({
        ordering: "listed",
        optionalBoolean: false,
        entityTargets: "minimum",
      });
      Attacker.play(volticBoltRed, { target: Teklo.id });
      game.helpers.passPriorityTo(Teklo);
      const drainPlay = (card: typeof evoRecallBlue) => {
        for (let safety = 0; safety < 16; safety += 1) {
          if (
            Teklo.zone("head").includes(card.canonicalId) ||
            Teklo.zone("legs").includes(card.canonicalId) ||
            Teklo.zone("arms").includes(card.canonicalId)
          ) {
            return;
          }
          const decision = game.getState().decision;
          if (decision?.kind === "option" || decision?.kind === "effect-resolution") {
            const pay =
              decision.options.find((option) =>
                /pay|prevent|barrier|1/i.test(option.label ?? option.id),
              ) ?? decision.options[0];
            if (pay) Teklo.choose(pay.id);
            continue;
          }
          if (decision?.kind === "entity-target") {
            game.answerDecision(Teklo.id, {
              kind: "entity-target",
              instanceIds: [decision.candidates[0]!.instanceId],
            });
            continue;
          }
          if (decision?.kind === "boolean") {
            game.answerDecision(Teklo.id, { kind: "boolean", value: true });
            continue;
          }
          const priorityPlayerId = game.getPriorityPlayerId();
          if (priorityPlayerId) {
            game.pass(priorityPlayerId);
            continue;
          }
          break;
        }
      };
      Teklo.must.play(evoRecallBlue);
      drainPlay(evoRecallBlue);
      expectFabCard(Teklo, evoRecallBlue).toBeIn("head");
      game.helpers.passPriorityTo(Teklo);
      Teklo.must.play(evoSpeedslipBlue);
      drainPlay(evoSpeedslipBlue);
      expectFabCard(Teklo, evoSpeedslipBlue).toBeIn("legs");
      game.helpers.passPriorityTo(Teklo);
      Teklo.must.play(arcbaneGraspBlue);
      drainPlay(arcbaneGraspBlue);
      expectFabCard(Teklo, arcbaneGraspBlue).toBeIn("arms");
      expect(Teklo.zone("chest")).not.toContain(evoBetaBaseChestBlue.canonicalId);
    });
  });
});
