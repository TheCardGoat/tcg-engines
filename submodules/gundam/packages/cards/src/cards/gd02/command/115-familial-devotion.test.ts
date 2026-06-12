import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  findStatModifier,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd02FamilialDevotion115 } from "./115-familial-devotion.ts";

describe("Familial Devotion (GD02-115)", () => {
  describe("【Main】/【Action】Choose 1 friendly (Vulture) Unit. It gets AP+2 during this turn.", () => {
    it("applies AP+2 modifier to a friendly (Vulture) unit", () => {
      const vultureUnit = createMockUnit({ traits: ["vulture"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02FamilialDevotion115],
        play: [vultureUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02FamilialDevotion115, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target a non-(Vulture) unit", () => {
      const nonVultureUnit = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02FamilialDevotion115],
        play: [nonVultureUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd02FamilialDevotion115, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
