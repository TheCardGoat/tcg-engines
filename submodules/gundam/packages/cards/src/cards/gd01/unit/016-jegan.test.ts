import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  restedResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01Jegan016 } from "./016-jegan.ts";

describe("Jegan (GD01-016)", () => {
  describe("While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.", () => {
    it("deploys at the reduced cost of 1 when 2+ Earth Federation units are in play", () => {
      // 2 EF units satisfy the condition; level requires 3 total resources,
      // but only 1 should need to be active (cost -1 = 1).
      const efA = createMockUnit({ traits: ["earth federation"] });
      const efB = createMockUnit({ traits: ["earth federation"] });

      const engine = GundamTestEngine.create({
        hand: [gd01Jegan016],
        play: [efA, efB],
        // 2 rested + 1 active = level 3 with only 1 affordable resource.
        resourceArea: [...restedResources(2), ...activeResources(1)],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      const gBefore = engine.getG();
      expect(gBefore.exhausted[resourcesBefore[0]!]).toBe(true);
      expect(gBefore.exhausted[resourcesBefore[1]!]).toBe(true);
      expect(gBefore.exhausted[resourcesBefore[2]!] ?? false).toBe(false);

      expectSuccess(p1.deployUnit(gd01Jegan016));

      // Jegan joins the battle area; the last active resource is now exhausted.
      expect(p1.getCardsInZone("battleArea").length).toBe(3);
      expect(engine.getG().exhausted[resourcesBefore[2]!]).toBe(true);
    });

    it("requires the full printed cost of 2 when the condition is NOT met", () => {
      // Only 1 EF unit in play → condition unmet → printed cost (2) applies.
      const efSolo = createMockUnit({ traits: ["earth federation"] });

      const engine = GundamTestEngine.create({
        hand: [gd01Jegan016],
        play: [efSolo],
        // 2 rested + 1 active = level 3, only 1 affordable → can't pay 2.
        resourceArea: [...restedResources(2), ...activeResources(1)],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      const result = p1.deployUnit(gd01Jegan016);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("INSUFFICIENT_RESOURCES");
      }
    });
  });
});
