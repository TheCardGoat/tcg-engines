import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd05MutualAttraction106 } from "./106-mutual-attraction.ts";

const PLACE_RESOURCE_OPTION = 0;
const RECOVER_PILOT_OPTION = 1;

describe("Mutual Attraction (GD05-106)", () => {
  describe("【Main】Choose 1: place 1 rested Resource; or add a Lv.5 or higher Pilot from your trash to your hand.", () => {
    it("asks for a visible option and places exactly 1 rested Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05MutualAttraction106],
        resourceArea: activeResources(3),
        resourceDeck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "chooseOne",
        controllerId: PLAYER_ONE,
        options: [{ index: PLACE_RESOURCE_OPTION, label: "Place 1 rested Resource." }],
      });
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: PLACE_RESOURCE_OPTION } }));

      expect(p1.getResourceCount()).toBe(4);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
      expect(p1.getBoardView().players[PLAYER_ONE]?.resourceDeckCount).toBe(1);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("stages a second visible choice and adds only the chosen eligible Pilot from trash", () => {
      const lowLevelPilot = createMockPilot({ name: "Low-Level Pilot", level: 4 });
      const eligiblePilot = createMockPilot({ name: "Eligible Pilot", level: 5 });
      const engine = GundamTestEngine.create({
        hand: [gd05MutualAttraction106],
        trash: [lowLevelPilot, eligiblePilot],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const [lowLevelPilotId, eligiblePilotId] = p1.getCardsInZone("trash");

      expectSuccess(p1.playCommand(commandId));
      expectSuccess(p1.resolveEffect({ chooseOneAnswers: { 0: RECOVER_PILOT_OPTION } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [eligiblePilotId],
        minTargets: 1,
        maxTargets: 1,
      });
      expect(p1.getCardZone(commandId)).not.toBe(`trash:${PLAYER_ONE}`);
      expectSuccess(p1.resolveEffect({ targets: [eligiblePilotId!] }));

      expect(p1.getCardZone(eligiblePilotId!)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardZone(lowLevelPilotId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("requires an explicit modal choice", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05MutualAttraction106],
        resourceArea: activeResources(3),
        resourceDeck: 1,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.playCommand(gd05MutualAttraction106));
      expectFailure(p1.resolveEffect({}), "MISSING_CHOOSE_ONE_ANSWER");
      expect(p1.getResourceCount()).toBe(3);
    });

    it("cannot be played below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05MutualAttraction106],
        resourceArea: activeResources(2),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(gd05MutualAttraction106),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot pay its printed cost without 3 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05MutualAttraction106],
        resourceArea: restedResources(3),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(gd05MutualAttraction106),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });
});
