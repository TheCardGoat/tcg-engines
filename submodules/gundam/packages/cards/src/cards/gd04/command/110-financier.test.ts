import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Financier110 } from "./110-financier.ts";

describe("Financier (GD04-110)", () => {
  describe("【Main】/【Action】Deploy 1 EX Base.", () => {
    it("deploys a Base into the player's empty Base Section during Main timing", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04Financier110],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expect(p1.getCardsInZone("baseSection")).toHaveLength(0);
      expectSuccess(p1.playCommand(commandId));

      const [baseId] = p1.getCardsInZone("baseSection");
      expect(baseId).toBeDefined();
      expect(p1.getCardZone(baseId!)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("deploys a Base through the public end-phase Action window", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04Financier110],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId));

      const [baseId] = p1.getCardsInZone("baseSection");
      expect(baseId).toBeDefined();
      expect(p1.getCardZone(baseId!)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("deploys into an occupied section and lets the player choose which Base remains", () => {
      const existingBase = createMockBase({ name: "Existing Base" });
      const engine = GundamTestEngine.create({
        hand: [gd04Financier110],
        baseSection: [existingBase],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;
      const existingBaseId = p1.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.playCommand(commandId));

      const visibleBases = p1.getCardsInZone("baseSection");
      const exBaseId = visibleBases.find((cardId) => cardId !== existingBaseId)!;
      expect(visibleBases).toHaveLength(2);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([existingBaseId, exBaseId]),
      });

      expectSuccess(p1.resolveEffect({ targets: [existingBaseId] }));

      expect(p1.getCardsInZone("baseSection")).toEqual([exBaseId]);
      expect(p1.getCardZone(existingBaseId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });
  });
});
