import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st06GquuuuuuxOmegaPsycommu002 } from "./002-gquuuuuux-omega-psycommu.ts";

describe("GQuuuuuuX (Omega Psycommu) (ST06-002)", () => {
  it("deploys with printed 4 AP/2 HP for Lv.4 and cost 3", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GquuuuuuxOmegaPsycommu002],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu002));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 2 });
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
  });

  it("cannot deploy below Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GquuuuuuxOmegaPsycommu002],
      resourceArea: activeResources(3),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06GquuuuuuxOmegaPsycommu002),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("cannot deploy without three active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st06GquuuuuuxOmegaPsycommu002],
      resourceArea: restedResources(4),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st06GquuuuuuxOmegaPsycommu002),
      "INSUFFICIENT_RESOURCES",
    );
  });

  describe("【Deploy】 another friendly Clan Unit enables one damage to an enemy Unit", () => {
    it("publishes an exact-one enemy choice and damages only the chosen Unit", () => {
      const ally = createMockUnit({ traits: ["clan"] });
      const firstEnemy = createMockUnit({ hp: 4 });
      const secondEnemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st06GquuuuuuxOmegaPsycommu002],
          play: [ally],
          resourceArea: activeResources(4),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const sourceId = p1.getHand()[0]!;
      const [chosenId, otherId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.deployUnit(sourceId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: sourceId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [chosenId, otherId],
      });
      expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));

      expect(p1.getDamage(chosenId!)).toBe(1);
      expect(p1.getDamage(otherId!)).toBe(0);
    });

    it("does not count the deployed Unit itself as another Clan Unit", () => {
      const engine = GundamTestEngine.create(
        { hand: [st06GquuuuuuxOmegaPsycommu002], resourceArea: activeResources(4) },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu002));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getDamage(enemyId)).toBe(0);
    });

    it("does not count another friendly Unit with an unrelated trait", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st06GquuuuuuxOmegaPsycommu002],
          play: [createMockUnit({ traits: ["zeon"] })],
          resourceArea: activeResources(4),
        },
        { play: [createMockUnit({ hp: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu002));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("cannot target a friendly Unit", () => {
      const clanAlly = createMockUnit({ traits: ["clan"] });
      const engine = GundamTestEngine.create(
        {
          hand: [st06GquuuuuuxOmegaPsycommu002],
          play: [clanAlly],
          resourceArea: activeResources(4),
        },
        { play: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.deployUnit(st06GquuuuuuxOmegaPsycommu002, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );
    });

    it("destroys an enemy Unit with one remaining HP", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st06GquuuuuuxOmegaPsycommu002],
          play: [createMockUnit({ traits: ["clan"] })],
          resourceArea: activeResources(4),
        },
        { play: [createMockUnit({ hp: 1 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu002, { targets: [enemyId] }));

      expect(p1.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("resolves without a prompt when the opponent controls no Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st06GquuuuuuxOmegaPsycommu002],
        play: [createMockUnit({ traits: ["clan"] })],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st06GquuuuuuxOmegaPsycommu002));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });
  });
});
