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
import type { Card, TestCardEntry } from "@tcg/gundam-engine";
import { gd03ZakuFz020 } from "./020-zaku-fz.ts";

function rested(card: Card): TestCardEntry {
  return { card, exhausted: true };
}

describe("Zaku II FZ (GD03-020)", () => {
  it("【When Paired】 deploys 2 rested Ad Balloon tokens with 4+ Cyclops Team cards in trash", () => {
    const pilot = createMockPilot({ traits: ["cyclops team"] });
    const trash = Array.from({ length: 4 }, () => createMockUnit({ traits: ["cyclops team"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03ZakuFz020],
        trash,
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, zakuId));

    const battle = p1.getCardsInZone("battleArea");
    const tokens = battle.filter((id) => id !== zakuId && id !== battle[1]);
    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(tokens).toHaveLength(2);
    for (const tokenId of tokens) {
      expect(framework.cards.getDefinition(tokenId)?.name).toBe("Ad Balloon");
      expect(engine.getG().exhausted[tokenId]).toBe(true);
    }
  });

  it("【When Paired】 does not deploy tokens with fewer than 4 Cyclops Team cards in trash", () => {
    const pilot = createMockPilot({ traits: ["cyclops team"] });
    const trash = Array.from({ length: 3 }, () => createMockUnit({ traits: ["cyclops team"] }));
    const engine = GundamTestEngine.create(
      {
        hand: [pilot],
        play: [gd03ZakuFz020],
        trash,
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const zakuId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, zakuId));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });

  describe('While you have a Unit with "Ad Balloon" in its card name in play, this Unit can\'t receive enemy battle damage.', () => {
    it("prevents enemy battle damage while a friendly Ad Balloon Unit is in play", () => {
      const adBalloon = createMockUnit({ name: "Ad Balloon", ap: 0, hp: 1 });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [rested(gd03ZakuFz020), adBalloon] },
        { play: [enemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(enemyId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getDamage(zakuId)).toBe(0);
      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("receives enemy battle damage normally without a friendly Ad Balloon Unit in play", () => {
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        { play: [rested(gd03ZakuFz020)] },
        { play: [enemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(enemyId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardsInZone("trash")).toContain(zakuId);
      expect(p2.getDamage(enemyId)).toBe(1);
    });
  });
});
