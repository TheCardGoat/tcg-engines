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
import { gd01UnicornGundamDestroyMode002 } from "./002-unicorn-gundam-destroy-mode.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Unicorn Gundam (Destroy Mode) (GD01-002)", () => {
  it("may destroy a Lv.5 Link Unit with Unicorn Mode in its name to deploy at Lv.0 and cost 0", () => {
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd01UnicornGundamDestroyMode002, banagher],
      play: [unicornMode],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unicornModeId = p1.getCardsInZone("battleArea")[0]!;
    const banagherId = p1.getHand()[1]!;

    expectSuccess(p1.assignPilot(banagher, unicornModeId));
    const destroyModeId = p1.getHand()[0]!;
    expect(p1.getMoveProcedure("deployUnit", { cardId: destroyModeId })).toEqual([
      expect.objectContaining({
        kind: "selectMode",
        modes: [expect.objectContaining({ id: "alternate" })],
      }),
    ]);
    expect(p1.getMoveProcedure("deployUnit", { cardId: destroyModeId, mode: "alternate" })).toEqual(
      [
        expect.objectContaining({
          kind: "selectTarget",
          role: "cost",
          candidateIds: [unicornModeId],
          minTargets: 1,
          maxTargets: 1,
        }),
      ],
    );
    expectSuccess(
      p1.deployUnit(gd01UnicornGundamDestroyMode002, {
        mode: "alternate",
        targets: [unicornModeId],
      }),
    );

    expect(p1.getCardZone(unicornModeId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(banagherId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd01UnicornGundamDestroyMode002)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("may decline the alternate cost and deploy normally while leaving the eligible Link Unit in play", () => {
    const unicornMode = createMockUnit({
      name: "Unicorn Gundam (Unicorn Mode)",
      level: 5,
      linkCondition: "[Banagher Links]",
    });
    const banagher = createMockPilot({ name: "Banagher Links", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd01UnicornGundamDestroyMode002, banagher],
      play: [unicornMode],
      resourceArea: activeResources(7),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unicornModeId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(banagher, unicornModeId));
    const destroyModeId = p1.getHand()[0]!;
    expect(p1.getMoveProcedure("deployUnit", { cardId: destroyModeId })).toEqual([
      expect.objectContaining({
        kind: "selectMode",
        modes: expect.arrayContaining([
          expect.objectContaining({ id: "normal" }),
          expect.objectContaining({ id: "alternate" }),
        ]),
      }),
    ]);
    expectSuccess(p1.deployUnit(gd01UnicornGundamDestroyMode002, { mode: "normal" }));

    expect(p1.getCardZone(unicornModeId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(destroyModeId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getPilotId(unicornModeId)).toBeDefined();
  });

  describe("【Attack】Choose 1 enemy Unit. Rest it.", () => {
    it("rests a chosen enemy Unit when Unicorn Gundam attacks", () => {
      const defender = createMockUnit({ name: "Defender", ap: 0, hp: 5 });
      const enemy = createMockUnit({ name: "Chosen Active Enemy", ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          play: [gd01UnicornGundamDestroyMode002],
          shieldArea: [createMockUnit()],
          deck: 5,
        },
        { play: [defender, enemy], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unicornId = p1.getCardsInZone("battleArea")[0]!;
      const [defenderId, enemyId] = p2.getCardsInZone("battleArea");

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId!]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      expectSuccess(p1.enterBattle(unicornId, defenderId!));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice?.kind).toBe("targetSelection");
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Unicorn Gundam's attack to ask which enemy Unit to rest");
      }
      expect(choice.legalTargetIds).toContain(enemyId);
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(p2.isExhausted(enemyId!)).toBe(true);
    });

    it("rests an enemy Unit even when attacking directly", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd01UnicornGundamDestroyMode002] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unicornId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unicornId, "direct"));

      const choice = p1.getBoardView().pendingChoice;
      expect(choice?.kind).toBe("targetSelection");
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Unicorn Gundam's direct attack to ask which enemy Unit to rest");
      }
      expect(choice.legalTargetIds).toEqual([enemyId]);
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("rests only enemy Units, not friendly Units", () => {
      const ally = createMockUnit({ ap: 2, hp: 5 });
      const enemy = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd01UnicornGundamDestroyMode002, ally] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unicornId, allyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unicornId!, "direct"));

      const choice = p1.getBoardView().pendingChoice;
      expect(choice?.kind).toBe("targetSelection");
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected Unicorn Gundam's attack to offer only enemy Units");
      }
      expect(choice.legalTargetIds).toEqual([enemyId]);
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.isExhausted(allyId!)).toBe(false);
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("does not create a target prompt when the opponent has no Units", () => {
      const engine = GundamTestEngine.create({ play: [gd01UnicornGundamDestroyMode002] }, {});
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unicornId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unicornId, "direct"));

      expect(engine.getPendingChoice()).toBeUndefined();
    });
  });
});
