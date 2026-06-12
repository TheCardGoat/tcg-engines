import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardPlayable,
  expectCardsToMove,
  expectPendingChoice,
  expectTargetChoice,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaEmergencyAtlus,
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  spoilerGildedMaton,
} from "@tcg/cyberpunk-cards";

const maton = spoilerGildedMaton;
const friendlyGear = alphaKiroshiOptics;
const unattachedFriendlyGear = alphaMantisBlades;
const cheapRivalUnit = alphaRuthlessLowlife;
const otherCheapRivalUnit = alphaSwordwiseHuscle;
const expensiveRivalUnit = alphaEmergencyAtlus;

describe("Gilded Matón", () => {
  describe("UI prompt", () => {
    it("shows the unit as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [maton],
        eddies: maton.cost,
      });

      expectCardPlayable(engine, maton);
    });

    it("presents only attached friendly Gear as the optional defeat choice after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maton],
          eddies: maton.cost,
          field: [
            { card: cheapRivalUnit, spent: false, attachedGears: [friendlyGear] },
            { card: unattachedFriendlyGear, spent: false },
          ],
        },
        {
          field: [{ card: otherCheapRivalUnit, spent: false }],
        },
      );

      engine.playCard(maton);

      expectPendingChoice(engine, "chooseCardToMove");
      expectCardsToMove(engine, [friendlyGear], { zone: "field" });
    });
  });

  describe("PLAY You may defeat a friendly Gear. If you do, defeat a rival Unit with cost 3 or less.", () => {
    it("defeats the chosen friendly Gear, then defeats a chosen cheap rival Unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maton],
          eddies: maton.cost,
          field: [{ card: cheapRivalUnit, spent: false, attachedGears: [friendlyGear] }],
        },
        {
          field: [
            { card: cheapRivalUnit, spent: false },
            { card: otherCheapRivalUnit, spent: false },
          ],
        },
      );

      engine.playCard(maton);
      engine.resolveCardToMove(friendlyGear);

      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "card", min: 1, max: 1 });

      engine.resolveEffectTarget(otherCheapRivalUnit);

      expect(engine.getCard(friendlyGear, "trash", P1).zone).toBe("trash");
      expect(engine.getCard(otherCheapRivalUnit, "trash", P2).zone).toBe("trash");
      expect(engine.getCard(cheapRivalUnit, "field", P2).zone).toBe("field");
    });

    it("does not offer rival Units with cost greater than 3", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maton],
          eddies: maton.cost,
          field: [{ card: cheapRivalUnit, spent: false, attachedGears: [friendlyGear] }],
        },
        {
          field: [
            { card: cheapRivalUnit, spent: false },
            { card: expensiveRivalUnit, spent: false },
          ],
        },
      );

      engine.playCard(maton);
      engine.resolveCardToMove(friendlyGear);

      const choice = expectPendingChoice(engine, "chooseTarget");
      expect(choice.payload.type).toBe("effectTarget");
      if (choice.payload.type !== "effectTarget") return;
      const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
        (id) => engine.getState().G.cardIndex[id]!.definitionId,
      );

      expect(eligibleDefinitions).toEqual([cheapRivalUnit.id]);
    });

    it("can decline defeating friendly Gear and leaves rival Units alone", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [maton],
          eddies: maton.cost,
          field: [{ card: cheapRivalUnit, spent: false, attachedGears: [friendlyGear] }],
        },
        {
          field: [{ card: cheapRivalUnit, spent: false }],
        },
      );

      engine.playCard(maton);
      engine.resolveCardToMove(undefined, { pass: true });

      expect(engine.getCard(friendlyGear, "field", P1).zone).toBe("field");
      expect(engine.getCard(cheapRivalUnit, "field", P2).zone).toBe("field");
      expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    });
  });
});
