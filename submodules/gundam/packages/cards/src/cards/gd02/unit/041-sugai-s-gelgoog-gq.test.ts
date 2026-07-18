import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd02SugaiSGelgoogGq041 } from "./041-sugai-s-gelgoog-gq.ts";
import { gd02UndyingPersistence109 } from "../command/109-undying-persistence.ts";

describe("Sugai's Gelgoog (GQ) (GD02-041)", () => {
  describe("Printed Lv.4 and cost 4", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02SugaiSGelgoogGq041],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 3 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02SugaiSGelgoogGq041],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[1]!;

      expectSuccess(p1.deployUnit(spender));
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => !p1.isExhausted(id))).toHaveLength(3);
    });
  });

  it("offers only enemy Lv.5 or higher Units and deals 2 damage", () => {
    const friendlyHigh = createMockUnit({ level: 5, hp: 5 });
    const enemyLow = createMockUnit({ level: 4, hp: 5 });
    const enemyHigh = createMockUnit({ level: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd02SugaiSGelgoogGq041, gd02UndyingPersistence109],
        play: [friendlyHigh],
        resourceArea: activeResources(5),
      },
      { play: [enemyLow, enemyHigh], shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd02SugaiSGelgoogGq041));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyHighId],
    });
    expectFailure(p1.resolveEffect({ targets: [enemyLowId!] }), "ILLEGAL_TARGET");
    expectSuccess(p1.resolveEffect({ targets: [enemyHighId!] }));

    expect(p2.getDamage(enemyHighId!)).toBe(2);
    expect(p2.getDamage(enemyLowId!)).toBe(0);
    expect(p1.getDamage(friendlyId)).toBe(0);
    expectSuccess(p1.playCommandAsPilot(gd02UndyingPersistence109, gd02SugaiSGelgoogGq041));
    expectSuccess(p1.enterBattle(gd02SugaiSGelgoogGq041, "direct"));
  });

  it("deploys without a stale target prompt when no enemy Unit is Lv.5 or higher", () => {
    const enemyLow = createMockUnit({ level: 4, hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [gd02SugaiSGelgoogGq041], resourceArea: activeResources(4) },
      { play: [enemyLow] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd02SugaiSGelgoogGq041));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(0);
  });
});
