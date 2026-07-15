import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ExtremeHatred112 } from "../../gd01/command/112-extreme-hatred.ts";
import { gd02RickDiasRed075 } from "../../gd02/unit/075-rick-dias-red.ts";
import { gd03GDefenser079 } from "./079-g-defenser.ts";

describe("G-Defenser (GD03-079)", () => {
  it("offers to rest G-Defenser instead when a Unit effect would rest its Base", () => {
    const base = createMockBase({ name: "Base", hp: 5 });
    const enemy = createMockUnit({ level: 1, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd02RickDiasRed075, gd03GDefenser079], baseSection: [base] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, gDefenserId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId!, enemyId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([baseId, enemyId]),
      minTargets: 2,
      maxTargets: 2,
    });
    expectSuccess(p1.resolveEffect({ targets: [baseId, enemyId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: gDefenserId,
      legalTargetIds: expect.arrayContaining([gDefenserId, baseId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [gDefenserId!] }));

    expect(p1.isExhausted(gDefenserId!)).toBe(true);
    expect(p1.isExhausted(baseId)).toBe(false);
  });

  it("may decline the substitution and rest the Base", () => {
    const base = createMockBase({ name: "Base", hp: 5 });
    const enemy = createMockUnit({ level: 1, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd02RickDiasRed075, gd03GDefenser079], baseSection: [base] },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, gDefenserId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId!, enemyId));
    expectSuccess(p1.resolveEffect({ targets: [baseId, enemyId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: gDefenserId,
      legalTargetIds: expect.arrayContaining([gDefenserId, baseId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [baseId] }));

    expect(p1.isExhausted(gDefenserId!)).toBe(false);
    expect(p1.isExhausted(baseId)).toBe(true);
  });

  it("lets the player select either eligible G-Defenser by its board card", () => {
    const base = createMockBase({ name: "Base", hp: 5 });
    const enemy = createMockUnit({ level: 1, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        play: [gd02RickDiasRed075, gd03GDefenser079, gd03GDefenser079],
        baseSection: [base],
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, firstGDefenserId, secondGDefenserId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId!, enemyId));
    expectSuccess(p1.resolveEffect({ targets: [baseId, enemyId] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([firstGDefenserId, secondGDefenserId, baseId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [secondGDefenserId!] }));

    expect(p1.isExhausted(firstGDefenserId!)).toBe(false);
    expect(p1.isExhausted(secondGDefenserId!)).toBe(true);
    expect(p1.isExhausted(baseId)).toBe(false);
  });

  it("does not offer a rested G-Defenser as a substitute", () => {
    const base = createMockBase({ name: "Base", hp: 5 });
    const helper = createMockUnit({ name: "Helper Unit" });
    const enemy = createMockUnit({ name: "Durable Enemy", level: 1, ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd01ExtremeHatred112],
        play: [gd03GDefenser079, gd02RickDiasRed075, helper],
        baseSection: [base],
        resourceArea: activeResources(6),
      },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [gDefenserId, rickDiasId, helperId] = p1.getCardsInZone("battleArea");
    const baseId = p1.getCardsInZone("baseSection")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(
      p1.playCommand(gd01ExtremeHatred112, {
        targets: [gDefenserId!, helperId!],
      }),
    );
    expect(p1.isExhausted(gDefenserId!)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([enemyId]),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expectSuccess(p1.enterBattle(rickDiasId!, enemyId));
    expectSuccess(p1.resolveEffect({ targets: [baseId, enemyId] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(gDefenserId!)).toBe(true);
    expect(p1.isExhausted(baseId)).toBe(true);
  });
});
