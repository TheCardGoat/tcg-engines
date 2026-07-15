import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04UnicornGundam02BansheeNornUnicornMode072 } from "./072-unicorn-gundam-02-banshee-norn-unicorn-mode.ts";

describe("Unicorn Gundam 02 Banshee Norn (Unicorn Mode) (GD04-072)", () => {
  describe("【When Linked】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.", () => {
    it("rejects the high-HP choice, then returns the eligible Unit to its owner's hand", () => {
      const riddhe = createMockPilot({ name: "Riddhe Marcenas", level: 5, cost: 1 });
      const fragile = createMockUnit({ ap: 2, hp: 3 });
      const otherFragile = createMockUnit({ ap: 3, hp: 3 });
      const heavy = createMockUnit({ ap: 4, hp: 6 });

      const engine = GundamTestEngine.create(
        {
          hand: [riddhe],
          play: [gd04UnicornGundam02BansheeNornUnicornMode072],
          resourceArea: activeResources(5),
        },
        { play: [fragile, otherFragile, heavy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const bansheeId = p1.getCardsInZone("battleArea")[0]!;
      const [fragileId, otherFragileId, heavyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(riddhe, bansheeId));
      expectFailure(p1.resolveEffect({ targets: [heavyId!] }), "ILLEGAL_TARGET");
      expectSuccess(p1.resolveEffect({ targets: [fragileId!] }));

      expect(p1.getPilotId(bansheeId)).toBeDefined();
      expect(p2.getCardZone(fragileId!)).toBe(`hand:${PLAYER_TWO}`);
      expect(p2.getHand()).toContain(fragileId!);
      expect(p2.getCardZone(otherFragileId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getCardZone(heavyId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });
  });
});
