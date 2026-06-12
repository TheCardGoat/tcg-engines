import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08JeganGroundTypeAManHunter009 } from "./009-jegan-ground-type-a-man-hunter.ts";

describe("Jegan Ground Type-A (Man Hunter) (ST08-009)", () => {
  describe("【Deploy】Choose 1 rested enemy Unit that is Lv.2 or lower. It won't be set as active during the start phase of your opponent's next turn.", () => {
    it("data encodes rested enemy Lv.2-or-lower prevent-active", () => {
      const effect = st08JeganGroundTypeAManHunter009.effects?.[0];

      expect(effect?.type).toBe("triggered");
      expect(effect?.activation.timing).toEqual(["deploy"]);
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "preventActive",
            target: {
              owner: "opponent",
              cardType: "unit",
              count: 1,
              state: "rested",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 2 }],
            },
          },
        },
      ]);
    });

    it("prevents the chosen rested enemy Lv.2 Unit from becoming active next start phase", () => {
      const enemy = createMockUnit({ ap: 2, hp: 3, level: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st08JeganGroundTypeAManHunter009], resourceArea: activeResources(3), deck: 5 },
        { play: [enemy], deck: 5, resourceArea: activeResources(3) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");
      engine.getG().exhausted[enemyId!] = true;

      expectSuccess(p1.deployUnit(st08JeganGroundTypeAManHunter009, { targets: [enemyId!] }));

      expect(
        engine
          .getG()
          .continuousEffects.some(
            (e) =>
              e.targetId === enemyId &&
              e.payload.kind === "restriction" &&
              e.payload.restriction === "prevent-active",
          ),
      ).toBe(true);

      engine.endTurn();

      expect(engine.getG().exhausted[enemyId!]).toBe(true);
    });

    it("rejects an active enemy Unit target", () => {
      const enemy = createMockUnit({ ap: 2, hp: 3, level: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st08JeganGroundTypeAManHunter009], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectFailure(
        p1.deployUnit(st08JeganGroundTypeAManHunter009, { targets: [enemyId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
