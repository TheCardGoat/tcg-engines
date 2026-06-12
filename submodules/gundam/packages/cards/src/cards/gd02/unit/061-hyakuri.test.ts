import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02Hyakuri061 } from "./061-hyakuri.ts";

describe("Hyakuri (GD02-061)", () => {
  describe("【When Paired·Purple Pilot】If there are 3 or more (Teiwaz)/(Tekkadan) cards in your trash, choose 1 enemy Unit with 3 or less AP. Rest it.", () => {
    const purplePilot = () => createMockPilot({ color: "purple" });

    it("rests a 3-or-less-AP enemy when trash has 3+ (Teiwaz)/(Tekkadan) cards (trait-OR)", () => {
      const trashMix = [
        createMockUnit({ traits: ["teiwaz"] }),
        createMockUnit({ traits: ["tekkadan"] }),
        createMockUnit({ traits: ["tekkadan"] }),
        createMockUnit({ traits: ["gjallarhorn"] }), // non-matching
      ];
      const pilot = purplePilot();
      const enemy = createMockUnit({ ap: 3, hp: 5 });

      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02Hyakuri061],
          trash: trashMix,
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hyakuriId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, hyakuriId));

      if (engine.getPendingChoice()) {
        expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      }

      expect(engine.getG().exhausted[enemyId]).toBe(true);
    });

    it("does NOT fire when fewer than 3 matching trash cards are present", () => {
      const trashMix = [
        createMockUnit({ traits: ["teiwaz"] }),
        createMockUnit({ traits: ["tekkadan"] }),
        createMockUnit({ traits: ["gjallarhorn"] }),
      ];
      const pilot = purplePilot();
      const enemy = createMockUnit({ ap: 3, hp: 5 });

      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd02Hyakuri061],
          trash: trashMix,
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hyakuriId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, hyakuriId));

      // No pending choice, and the enemy stays active.
      expect(engine.getPendingChoice()).toBeFalsy();
      expect(engine.getG().exhausted[enemyId] ?? false).toBe(false);
    });
  });
});
