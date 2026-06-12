import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardPlayable,
  expectPendingChoice,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaCorporateSurveillance,
  alphaKiroshiOptics,
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  spoilerMamanBrigitte,
} from "@tcg/cyberpunk-cards";

const maman = spoilerMamanBrigitte;
const firstProgram = alphaRebootOptics;
const secondProgram = alphaCorporateSurveillance;
const unequippedRivalUnit = alphaRuthlessLowlife;
const equippedRivalUnit = alphaSwordwiseHuscle;
const rivalGear = alphaKiroshiOptics;

describe("Maman Brigitte", () => {
  describe("UI prompt", () => {
    it("shows the unit as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [maman],
        eddies: maman.cost,
      });

      expectCardPlayable(engine, maman);
    });

    it("presents exactly two friendly Program discard targets after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maman, firstProgram, secondProgram, rivalGear],
          eddies: maman.cost,
        },
        {
          field: [{ card: unequippedRivalUnit, spent: false }],
        },
      );

      engine.playCard(maman);

      const choice = expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "discardFromHand", amount: 2 });
      expect(choice.payload.type).toBe("discardFromHand");
      expect(choice.payload.canDecline).toBe(true);
      if (choice.payload.type !== "discardFromHand") return;
      const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
        (id) => engine.getState().G.cardIndex[id]!.definitionId,
      );

      expect(eligibleDefinitions.sort((a, b) => a.localeCompare(b))).toEqual(
        [firstProgram.id, secondProgram.id].sort((a, b) => a.localeCompare(b)),
      );
    });
  });

  describe("PLAY You may discard 2 Programs. If you do, bottom-deck a rival unequipped Unit.", () => {
    it("discards two Programs and bottom-decks the chosen unequipped rival Unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maman, firstProgram, secondProgram],
          eddies: maman.cost,
        },
        {
          field: [
            { card: unequippedRivalUnit, spent: false },
            { card: equippedRivalUnit, spent: false, attachedGears: [rivalGear] },
          ],
          deck: 3,
        },
      );

      const rivalDeckSizeBefore = engine.getCardsInZone("deck", P2).length;

      engine.playCard(maman);
      engine.resolveDiscardFromHand([firstProgram, secondProgram]);

      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });

      engine.resolveEffectTarget(unequippedRivalUnit);

      expect(engine.getCard(firstProgram, "trash", P1).zone).toBe("trash");
      expect(engine.getCard(secondProgram, "trash", P1).zone).toBe("trash");
      expect(engine.getCard(unequippedRivalUnit, "deck", P2).zone).toBe("deck");
      expect(engine.getCard(equippedRivalUnit, "field", P2).zone).toBe("field");

      const rivalDeck = engine.getCardsInZone("deck", P2);
      expect(rivalDeck).toHaveLength(rivalDeckSizeBefore + 1);
      expect(rivalDeck[rivalDeck.length - 1]!.definitionId).toBe(unequippedRivalUnit.id);
    });

    it("allows the player to decline the Program discard", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maman, firstProgram, secondProgram],
          eddies: maman.cost,
        },
        {
          field: [{ card: unequippedRivalUnit, spent: false }],
        },
      );

      engine.playCard(maman);

      const result = engine.executeMove("resolveDiscardFromHand", { args: { pass: true } }, P1);

      expect(result.success).toBe(true);
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCard(firstProgram, "hand", P1).zone).toBe("hand");
      expect(engine.getCard(secondProgram, "hand", P1).zone).toBe("hand");
      expect(engine.getCard(unequippedRivalUnit, "field", P2).zone).toBe("field");
    });

    it("rejects an in-hand non-Program submitted for the discard cost", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maman, firstProgram, secondProgram, rivalGear],
          eddies: maman.cost,
        },
        {
          field: [{ card: unequippedRivalUnit, spent: false }],
        },
      );

      engine.playCard(maman);

      const programId = engine.getCard(firstProgram, "hand", P1).instanceId as string;
      const gearId = engine.getCard(rivalGear, "hand", P1).instanceId as string;
      const result = engine.executeMove("resolveDiscardFromHand", {
        args: { cardIds: [programId, gearId] },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("INVALID_CHOICE");
      }
      expect(engine.getCard(firstProgram, "hand", P1).zone).toBe("hand");
      expect(engine.getCard(rivalGear, "hand", P1).zone).toBe("hand");
      expectPendingChoice(engine, "chooseTarget");
    });

    it("does not offer equipped rival Units as bottom-deck targets", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maman, firstProgram, secondProgram],
          eddies: maman.cost,
        },
        {
          field: [
            { card: unequippedRivalUnit, spent: false },
            { card: equippedRivalUnit, spent: false, attachedGears: [rivalGear] },
          ],
        },
      );

      engine.playCard(maman);
      engine.resolveDiscardFromHand([firstProgram, secondProgram]);

      const choice = expectPendingChoice(engine, "chooseTarget");
      expect(choice.payload.type).toBe("effectTarget");
      if (choice.payload.type !== "effectTarget") return;
      const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
        (id) => engine.getState().G.cardIndex[id]!.definitionId,
      );

      expect(eligibleDefinitions).toEqual([unequippedRivalUnit.id]);
    });

    it("skips the follow-up when fewer than two Programs are available to discard", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maman, firstProgram, rivalGear],
          eddies: maman.cost,
        },
        {
          field: [{ card: unequippedRivalUnit, spent: false }],
        },
      );

      engine.playCard(maman);

      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
      expect(engine.getCard(firstProgram, "hand", P1).zone).toBe("hand");
      expect(engine.getCard(unequippedRivalUnit, "field", P2).zone).toBe("field");
    });
  });
});
