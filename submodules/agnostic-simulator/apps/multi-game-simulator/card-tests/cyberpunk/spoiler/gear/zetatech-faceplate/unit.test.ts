import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  expectAdjustGigChoice,
  expectAttachTarget,
  expectCardPlayable,
  expectEligibleGigs,
  expectPendingChoice,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaRebootOptics,
  alphaGoroTakemuraHandsUnclean,
  alphaSwordwiseHuscle,
  alphaVCorporateExile,
  promoLucynaKushinada,
  spoilerKerryEurodyneTheLastRockerboy,
  spoilerZetatechFaceplate,
} from "@tcg/cyberpunk-cards";

const faceplate = spoilerZetatechFaceplate;
const hostUnit = alphaSwordwiseHuscle;
const faceUpLegend = alphaVCorporateExile;
const faceDownLegend = promoLucynaKushinada;
const goSoloLegend = alphaGoroTakemuraHandsUnclean;
const kerry = spoilerKerryEurodyneTheLastRockerboy;
const program = alphaRebootOptics;

describe("Zetatech Faceplate", () => {
  describe("UI prompt", () => {
    it("shows the Gear as playable with a friendly Unit attach target", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [faceplate],
        eddies: faceplate.cost,
        field: [{ card: hostUnit, spent: false }],
      });

      expectCardPlayable(engine, faceplate);
      expectAttachTarget(engine, faceplate, hostUnit);
    });

    it("can attach to a friendly face-up Legend", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [faceplate],
        eddies: faceplate.cost,
        legendArea: [{ card: faceUpLegend, faceDown: false }],
      });

      expectCardPlayable(engine, faceplate);
      const faceplateCard = engine.getCard(faceplate, "hand", P1);
      const legendCard = engine.getCard(faceUpLegend, "legendArea", P1);
      const prompt = engine.getPrompt(P1);
      const playCardMove = prompt.availableMoves.find((move) => move.moveId === "playCard");
      expect(playCardMove?.inputSpec.type).toBe("playCard");
      if (playCardMove?.inputSpec.type !== "playCard") return;
      const candidate = playCardMove.inputSpec.candidates.find(
        (entry) => entry.cardId === (faceplateCard.instanceId as string),
      );
      expect(candidate?.attachTargets).toContain(legendCard.instanceId as string);
    });
  });

  describe("When this Unit or Legend is spent, adjust a Gig by up to 1. Then, if you control 3 or more Gigs with different values, draw 1.", () => {
    it("triggers when the attached Unit is spent to attack, adjusts a chosen Gig, then draws for three distinct Gig values", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [faceplate],
          eddies: faceplate.cost,
          field: [{ card: hostUnit, spent: false }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
          ],
          deck: 5,
        },
        {
          gigArea: [{ dieType: "d10", faceValue: 4 }],
        },
      );

      engine.attachGear(faceplate, hostUnit);
      const handBeforeAttack = engine.getHandCount(P1);

      engine.attackRival(hostUnit);

      const choice = expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "gig", min: 0, max: 1 });
      expect(choice.payload.canDecline).toBe(true);
      expectEligibleGigs(engine, [{ dieType: "d4" }, { dieType: "d6" }, { dieType: "d8" }]);

      const d8Id = engine.findGigIdByType(P1, "d8");
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d8Id] } }, P1);

      expectPendingChoice(engine, "chooseTarget");
      expectAdjustGigChoice(engine, { direction: "either", maxAmount: 1 });

      engine.executeMove("resolveAdjustGig", { args: { value: 4 } }, P1);

      expect(engine.getState().G.gigDice[d8Id]!.faceValue).toBe(4);
      expect(engine.getHandCount(P1)).toBe(handBeforeAttack + 1);
    });

    it("allows choosing zero Gigs for the up to 1 adjustment", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [faceplate],
          eddies: faceplate.cost,
          field: [{ card: hostUnit, spent: false }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
          ],
          deck: 5,
        },
        {
          gigArea: [{ dieType: "d10", faceValue: 4 }],
        },
      );

      engine.attachGear(faceplate, hostUnit);
      const handBeforeAttack = engine.getHandCount(P1);

      engine.attackRival(hostUnit);

      expectTargetChoice(engine, { type: "effectTarget", targetKind: "gig", min: 0, max: 1 });

      const result = engine.executeMove("resolveEffectTarget", { args: { targetIds: [] } }, P1);

      expect(result.success).toBe(true);
      expect(engine.getHandCount(P1)).toBe(handBeforeAttack + 1);
    });

    it("does not draw when the friendly Gigs do not have three distinct values after the adjustment", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [faceplate],
          eddies: faceplate.cost,
          field: [{ card: hostUnit, spent: false }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 1 },
            { dieType: "d8", faceValue: 2 },
          ],
          deck: 5,
        },
        {
          gigArea: [{ dieType: "d10", faceValue: 4 }],
        },
      );

      engine.attachGear(faceplate, hostUnit);
      const handBeforeAttack = engine.getHandCount(P1);

      engine.attackRival(hostUnit);

      const d6Id = engine.findGigIdByType(P1, "d6");
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d6Id] } }, P1);
      engine.executeMove("resolveAdjustGig", { args: { value: 1 } }, P1);

      expect(engine.getHandCount(P1)).toBe(handBeforeAttack);
    });

    it("triggers when the attached Legend is spent to pay for a card", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [faceplate, program],
          eddies: faceplate.cost + 1,
          legendArea: [{ card: faceUpLegend, faceDown: false }],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
          ],
          deck: 5,
        },
        {
          gigArea: [{ dieType: "d10", faceValue: 4 }],
        },
      );

      engine.attachGear(faceplate, faceUpLegend);
      const handBeforeProgram = engine.getHandCount(P1);

      engine.playCard(program);

      expect(engine.getCard(faceUpLegend, "legendArea", P1).meta.spent).toBe(true);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "gig", min: 0, max: 1 });

      const d8Id = engine.findGigIdByType(P1, "d8");
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d8Id] } }, P1);
      engine.executeMove("resolveAdjustGig", { args: { value: 4 } }, P1);

      expect(engine.getState().G.gigDice[d8Id]!.faceValue).toBe(4);
      expect(engine.getCard(program, "trash", P1).zone).toBe("trash");
      expect(engine.getHandCount(P1)).toBe(handBeforeProgram);
    });

    it("does not trigger when calling a legend because legends are not spent", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [faceplate],
          eddies: faceplate.cost + 1,
          legendArea: [
            { card: faceUpLegend, faceDown: false },
            { card: faceDownLegend, faceDown: true },
          ],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
          ],
          deck: 5,
        },
        {
          gigArea: [{ dieType: "d10", faceValue: 4 }],
        },
      );

      engine.attachGear(faceplate, faceUpLegend);

      engine.callLegend(faceDownLegend);

      expect(engine.getCard(faceUpLegend, "legendArea", P1).meta.spent).toBe(false);
      expect(engine.getCard(faceDownLegend, "legendArea", P1).meta.faceDown).toBe(false);
      expect(engine.getPrompt(P1).choice).toBeNull();
    });

    it("triggers when the attached Legend is spent to Go Solo another Legend", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [faceplate],
          eddies: faceplate.cost + 4,
          legendArea: [
            { card: faceUpLegend, faceDown: false },
            { card: goSoloLegend, faceDown: false },
          ],
          gigArea: [
            { dieType: "d4", faceValue: 1 },
            { dieType: "d6", faceValue: 2 },
            { dieType: "d8", faceValue: 3 },
          ],
          deck: 5,
        },
        {
          gigArea: [{ dieType: "d10", faceValue: 4 }],
        },
      );

      engine.attachGear(faceplate, faceUpLegend);
      const handBeforeGoSolo = engine.getHandCount(P1);

      engine.executeMove(
        "goSolo",
        { args: { cardId: engine.getCard(goSoloLegend, "legendArea", P1).instanceId as string } },
        P1,
      );

      expect(engine.getCard(faceUpLegend, "legendArea", P1).meta.spent).toBe(true);
      expect(engine.getCard(goSoloLegend, "field", P1).zone).toBe("field");
      expectPendingChoice(engine, "chooseTarget");

      const d8Id = engine.findGigIdByType(P1, "d8");
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d8Id] } }, P1);
      engine.executeMove("resolveAdjustGig", { args: { value: 4 } }, P1);

      expect(engine.getState().G.gigDice[d8Id]!.faceValue).toBe(4);
      expect(engine.getHandCount(P1)).toBe(handBeforeGoSolo + 1);
    });

    it("triggers when the attached Unit is spent for an activated ability cost", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [faceplate],
        eddies: faceplate.cost,
        field: [{ card: kerry, spent: false }],
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 6 },
          { dieType: "d8", faceValue: 3 },
        ],
        deck: 5,
      });

      engine.attachGear(faceplate, kerry);
      const handBeforeAbility = engine.getHandCount(P1);

      engine.activateAbility(kerry, 0);

      expect(engine.getCard(kerry, "field", P1).meta.spent).toBe(true);
      expectPendingChoice(engine, "chooseTarget");

      const d8Id = engine.findGigIdByType(P1, "d8");
      engine.executeMove("resolveEffectTarget", { args: { targetIds: [d8Id] } }, P1);
      engine.executeMove("resolveAdjustGig", { args: { value: 4 } }, P1);

      expect(engine.getState().G.gigDice[d8Id]!.faceValue).toBe(4);
      expect(engine.getHandCount(P1)).toBe(handBeforeAbility + 3);
    });
  });
});
