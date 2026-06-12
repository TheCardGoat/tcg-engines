import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  restedResources,
  createMockCommand,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GundamAerial070 } from "./070-gundam-aerial.ts";

describe("Gundam Aerial (GD01-070)", () => {
  describe("While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.", () => {
    it("deploys at the reduced cost of 1 when 4+ Command cards are in the trash", () => {
      // Printed cost 3, reduction -2 → effective cost 1.
      const engine = GundamTestEngine.create({
        hand: [gd01GundamAerial070],
        trash: [createMockCommand(), createMockCommand(), createMockCommand(), createMockCommand()],
        // Level 5 required; 4 rested + 1 active = 5 total, 1 active = reduced cost.
        resourceArea: [...restedResources(4), ...activeResources(1)],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const resources = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(gd01GundamAerial070));

      expect(p1.getCardsInZone("battleArea").length).toBe(1);
      // The lone active resource should now be exhausted.
      expect(engine.getG().exhausted[resources[4]!]).toBe(true);
    });

    it("requires the full printed cost of 3 when fewer than 4 Command cards are in the trash", () => {
      // Only 3 commands in trash → condition unmet → printed cost (3) applies.
      const engine = GundamTestEngine.create({
        hand: [gd01GundamAerial070],
        trash: [createMockCommand(), createMockCommand(), createMockCommand()],
        // Level 5 met, but only 1 active → can't pay printed cost 3.
        resourceArea: [...restedResources(4), ...activeResources(1)],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      const result = p1.deployUnit(gd01GundamAerial070);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("INSUFFICIENT_RESOURCES");
      }
    });
  });
});
