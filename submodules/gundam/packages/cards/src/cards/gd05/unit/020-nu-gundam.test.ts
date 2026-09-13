import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05NuGundam020 } from "./020-nu-gundam.ts";

describe("Nu Gundam (GD05-020)", () => {
  /** @behavioral-proof complete: During Pair Breach grant and its unpaired exclusion, plus Deploy Londo Bell threshold and false branch, are public. */
  describe("【During Pair】This Unit gains <Breach 3>.", () => {
    it("gains Breach 3 only after pairing and deals exactly 3 damage to the enemy Base", () => {
      const pilot = createMockPilot({ name: "Any Pilot", level: 1, cost: 1 });
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 1 });
      const base = createMockBase({ name: "Enemy Base", hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd05NuGundam020],
          resourceArea: activeResources(1),
        },
        { play: [{ card: defender, exhausted: true }], baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      expect(p1.getVisibleCard(sourceId)?.keywords).not.toContain("Breach");
      expectSuccess(p1.assignPilot(pilot, sourceId));
      expect(p1.getVisibleCard(sourceId)?.keywords).toContain("Breach");

      expectSuccess(p1.enterBattle(sourceId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(baseId)).toBe(3);
    });
  });

  describe("【Deploy】If there are 2 or more (Londo Bell) cards in your trash, place 1 EX Resource.", () => {
    it("places one active EX Resource with exactly two Londo Bell cards in trash", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05NuGundam020],
        trash: [
          createMockUnit({ traits: ["londo bell"] }),
          createMockUnit({ traits: ["londo bell"] }),
        ],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const before = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(gd05NuGundam020));

      const placed = p1.getCardsInZone("resourceArea").filter((id) => !before.includes(id));
      expect(placed).toHaveLength(1);
      expect(p1.isExhausted(placed[0]!)).toBe(false);
    });

    it("does not place an EX Resource with only one Londo Bell card in trash", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05NuGundam020],
        trash: [
          createMockUnit({ traits: ["londo bell"] }),
          createMockUnit({ traits: ["neo zeon"] }),
        ],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const before = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(gd05NuGundam020));

      expect(p1.getCardsInZone("resourceArea")).toEqual(before);
    });
  });
});
