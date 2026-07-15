import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04GundamThroneEins036 } from "./036-gundam-throne-eins.ts";

describe("Gundam Throne Eins (GD04-036)", () => {
  it("【Deploy】rests up to 2 other active CB Units and deals that much damage to enemy Lv.6-or-lower Units", () => {
    const cbOne = createMockUnit({ traits: ["cb"], hp: 4 });
    const cbTwo = createMockUnit({ traits: ["cb"], hp: 4 });
    const lowEnemy = createMockUnit({ level: 6, hp: 5 });
    const highEnemy = createMockUnit({ level: 7, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamThroneEins036],
        play: [cbOne, cbTwo],
        resourceArea: activeResources(6),
      },
      { play: [lowEnemy, highEnemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [cbOneId, cbTwoId] = p1.getCardsInZone("battleArea");
    const [lowEnemyId, highEnemyId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd04GundamThroneEins036, { targets: [cbOneId!, cbTwoId!] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p1.isExhausted(cbOneId!)).toBe(true);
    expect(p1.isExhausted(cbTwoId!)).toBe(true);
    expect(p2.getDamage(lowEnemyId!)).toBe(2);
    expect(p2.getDamage(highEnemyId!)).toBe(0);
  });

  it("【Deploy】may rest exactly 1 other active CB Unit to deal 1 damage", () => {
    const cbUnit = createMockUnit({ traits: ["cb"], hp: 4 });
    const enemy = createMockUnit({ level: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamThroneEins036],
        play: [cbUnit],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const cbUnitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04GundamThroneEins036, { targets: [cbUnitId] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p1.isExhausted(cbUnitId)).toBe(true);
    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("counts only the CB Unit rested by its Deploy effect", () => {
    const alreadyRestedCb = createMockUnit({ name: "Already Rested CB", traits: ["cb"], hp: 4 });
    const chosenCb = createMockUnit({ name: "Chosen CB", traits: ["cb"], hp: 4 });
    const enemy = createMockUnit({ level: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamThroneEins036],
        play: [{ card: alreadyRestedCb, exhausted: true }, chosenCb],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [, chosenCbId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04GundamThroneEins036, { targets: [chosenCbId!] }));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

    expect(p1.isExhausted(chosenCbId!)).toBe(true);
    expect(p2.getDamage(enemyId)).toBe(1);
  });

  it("may decline to rest a CB Unit and deals no damage", () => {
    const cbUnit = createMockUnit({ traits: ["cb"], hp: 4 });
    const enemy = createMockUnit({ level: 6, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamThroneEins036],
        play: [cbUnit],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const cbUnitId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(gd04GundamThroneEins036));
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

    expect(p2.getDamage(enemyId)).toBe(0);
    expect(p1.isExhausted(cbUnitId)).toBe(false);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(2);
  });
});
