import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { betaGundamSandrock028 } from "./028-gundam-sandrock.ts";

describe("Gundam Sandrock (GD01-028)", () => {
  describe("【Deploy】You may deploy 1 (Maganac Corps) Unit card from your hand.", () => {
    it("publishes only the matching hand Unit and deploys the chosen physical card", () => {
      const maganac = createMockUnit({ traits: ["maganac corps"], level: 7, cost: 7 });
      const wrongTrait = createMockUnit({ traits: ["earth federation"] });
      const engine = GundamTestEngine.create({
        hand: [betaGundamSandrock028, maganac, wrongTrait],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [sandrockId, maganacId, wrongTraitId] = p1.getHand();

      expectSuccess(p1.deployUnit(sandrockId!));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        controllerId: PLAYER_ONE,
        directiveIndex: 0,
      });
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        legalTargetIds: [maganacId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [maganacId!] }));

      expect(p1.getCardZone(sandrockId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(maganacId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(wrongTraitId!)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("allows the controller to decline and leaves the eligible Unit in hand", () => {
      const maganac = createMockUnit({ traits: ["maganac corps"] });
      const engine = GundamTestEngine.create({
        hand: [betaGundamSandrock028, maganac],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const maganacId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(betaGundamSandrock028));
      expect(p1.getBoardView().pendingChoice).toMatchObject({ kind: "optional" });
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.getCardZone(maganacId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not publish an unusable choice when no Maganac Corps Unit is in hand", () => {
      const engine = GundamTestEngine.create({
        hand: [betaGundamSandrock028, createMockUnit({ traits: ["earth federation"] })],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(betaGundamSandrock028));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });
});
