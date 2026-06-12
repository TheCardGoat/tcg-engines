import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockBase,
  expectCardInTrash,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Financier110 } from "./110-financier.ts";

describe("Financier (GD04-110)", () => {
  describe("【Main】/【Action】Deploy 1 EX Base.", () => {
    it("deploys an EX Base token during main timing", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04Financier110],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd04Financier110));

      const [baseId] = p1.getCardsInZone("baseSection");
      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(baseId).toBeDefined();
      expect(framework.cards.getDefinition(baseId!)?.name).toBe("EX Base");
      expectCardInTrash(engine, commandId, PLAYER_ONE);
    });

    it("deploys an EX Base token during action timing", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04Financier110],
        resourceArea: activeResources(6),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.playCommand(gd04Financier110));

      const [baseId] = p1.getCardsInZone("baseSection");
      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(baseId).toBeDefined();
      expect(framework.cards.getDefinition(baseId!)?.name).toBe("EX Base");
    });

    it("does not deploy a second EX Base if your base section is occupied", () => {
      const existingBase = createMockBase({ name: "Existing Base" });
      const engine = GundamTestEngine.create({
        hand: [gd04Financier110],
        baseSection: [existingBase],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const basesBefore = p1.getCardsInZone("baseSection");

      expectSuccess(p1.playCommand(gd04Financier110));

      expect(p1.getCardsInZone("baseSection")).toEqual(basesBefore);
    });
  });
});
