import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04RozenZulu039 } from "./039-rozen-zulu.ts";

describe("Rozen Zulu (GD04-039)", () => {
  it("gets cost -4 in hand while there are 8 or more Neo Zeon cards in your trash", () => {
    const trash = Array.from({ length: 8 }, (_, i) =>
      createMockUnit({ name: `Neo Zeon ${i}`, traits: ["neo zeon"] }),
    );
    const engine = GundamTestEngine.create(
      {
        hand: [gd04RozenZulu039],
        trash,
        resourceArea: activeResources(4),
      },
      { play: [createMockUnit({ hp: 6 })] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const rozenId = p1.getCardsInZone("hand")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(rozenId, { targets: [enemyId] }));

    expect(p1.getCardsInZone("battleArea")).toContain(rozenId);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("requires full cost when there are fewer than 8 Neo Zeon cards in trash", () => {
    const trash = Array.from({ length: 7 }, (_, i) =>
      createMockUnit({ name: `Neo Zeon ${i}`, traits: ["neo zeon"] }),
    );
    const engine = GundamTestEngine.create({
      hand: [gd04RozenZulu039],
      trash,
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd04RozenZulu039), "INSUFFICIENT_RESOURCES");
  });

  it("【Deploy】deals 1 damage to a chosen enemy Unit without Repair", () => {
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      { hand: [gd04RozenZulu039], resourceArea: activeResources(6) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04RozenZulu039, { targets: [enemyId] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("【Deploy】deals 3 damage instead when the chosen enemy Unit has Repair", () => {
    const enemy = createMockUnit({ hp: 6, keywordEffects: [{ keyword: "Repair", value: 1 }] });
    const engine = GundamTestEngine.create(
      { hand: [gd04RozenZulu039], resourceArea: activeResources(6) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04RozenZulu039, { targets: [enemyId] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(enemyId)).toBe(3);
  });

  it("【Deploy】checks Repair on the chosen Unit rather than a different enemy", () => {
    const chosenEnemy = createMockUnit({ name: "Chosen Enemy", hp: 6 });
    const repairEnemy = createMockUnit({
      name: "Other Repair Enemy",
      hp: 6,
      keywordEffects: [{ keyword: "Repair", value: 1 }],
    });
    const engine = GundamTestEngine.create(
      { hand: [gd04RozenZulu039], resourceArea: activeResources(6) },
      { play: [chosenEnemy, repairEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenEnemyId, repairEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd04RozenZulu039, { targets: [chosenEnemyId!] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(chosenEnemyId!)).toBe(1);
    expect(p2.getDamage(repairEnemyId!)).toBe(0);
  });
});
