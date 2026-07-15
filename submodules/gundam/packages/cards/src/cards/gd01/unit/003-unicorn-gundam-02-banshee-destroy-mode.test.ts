import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01UnicornGundam02BansheeDestroyMode003 } from "./003-unicorn-gundam-02-banshee-destroy-mode.ts";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

describe("Unicorn Gundam 02 Banshee (Destroy Mode) (GD01-003)", () => {
  it("returns exactly 12 chosen trash cards, readies itself, and visibly gains First Strike while linked", () => {
    const marida = createMockPilot({ name: "Marida Cruz", level: 1, cost: 1 });
    const trash = Array.from({ length: 13 }, (_, index) =>
      createMockUnit({ name: `Trash ${index + 1}` }),
    );
    const enemy = createMockUnit({ ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [marida],
        play: [gd01UnicornGundam02BansheeDestroyMode003],
        trash,
        resourceArea: activeResources(6),
        baseSection: [createMockBase({ hp: 20 })],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bansheeId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    const chosen = p1.getCardsInZone("trash").slice(0, 12);

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
    expectSuccess(p1.assignPilot(marida, bansheeId));
    expectSuccess(p1.enterBattle(bansheeId, enemyId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      minTargets: 12,
      maxTargets: 12,
    });
    expectSuccess(p1.resolveEffect({ targets: chosen }));

    expect(p1.getCardsInZone("trash")).toHaveLength(1);
    expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore + 12);
    expect(p1.isExhausted(bansheeId)).toBe(false);
    expect(p1.getVisibleCard(bansheeId)?.keywords).toContain("FirstStrike");
  });

  it("uses First Strike on the additional attack to destroy the defender without taking return damage", () => {
    const marida = createMockPilot({ name: "Marida Cruz", level: 1, cost: 1 });
    const trash = Array.from({ length: 12 }, (_, index) =>
      createMockUnit({ name: `Trash ${index + 1}` }),
    );
    const firstDefender = createMockUnit({ ap: 0, hp: 10 });
    const lethalDefender = createMockUnit({ ap: 5, hp: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [marida],
        play: [gd01UnicornGundam02BansheeDestroyMode003],
        trash,
        resourceArea: activeResources(6),
        baseSection: [createMockBase({ hp: 20 })],
        deck: 5,
      },
      { play: [firstDefender, lethalDefender], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bansheeId = p1.getCardsInZone("battleArea")[0]!;
    const [firstDefenderId, lethalDefenderId] = p2.getCardsInZone("battleArea");

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [firstDefenderId!, lethalDefenderId!]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(marida, bansheeId));
    expectSuccess(p1.enterBattle(bansheeId, firstDefenderId!));
    const choice = p1.getBoardView().pendingChoice;
    expect(choice).toMatchObject({ kind: "targetSelection", minTargets: 12, maxTargets: 12 });
    if (choice?.kind !== "targetSelection") {
      throw new Error("Expected Banshee to ask which 12 trash cards to return");
    }
    expectSuccess(p1.resolveEffect({ targets: choice.legalTargetIds }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p1.enterBattle(bansheeId, lethalDefenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardZone(lethalDefenderId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p1.getCardZone(bansheeId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getDamage(bansheeId)).toBe(0);
  });

  it("does not trigger with fewer than 12 trash cards", () => {
    const marida = createMockPilot({ name: "Marida Cruz", level: 1, cost: 1 });
    const trash = Array.from({ length: 11 }, () => createMockUnit());
    const enemy = createMockUnit({ ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [marida],
        play: [gd01UnicornGundam02BansheeDestroyMode003],
        trash,
        resourceArea: activeResources(6),
        baseSection: [createMockBase({ hp: 20 })],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bansheeId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(marida, bansheeId));
    expectSuccess(p1.enterBattle(bansheeId, enemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("trash")).toHaveLength(11);
    expect(p1.isExhausted(bansheeId)).toBe(true);
    expect(p1.getVisibleCard(bansheeId)?.keywords).not.toContain("FirstStrike");
  });

  it("does not trigger with 12 trash cards when paired outside its Link Condition", () => {
    const otherPilot = createMockPilot({ name: "Riddhe Marcenas", level: 1, cost: 1 });
    const trash = Array.from({ length: 12 }, (_, index) =>
      createMockUnit({ name: `Trash ${index + 1}` }),
    );
    const enemy = createMockUnit({ ap: 0, hp: 10 });
    const engine = GundamTestEngine.create(
      {
        hand: [otherPilot],
        play: [gd01UnicornGundam02BansheeDestroyMode003],
        trash,
        resourceArea: activeResources(6),
        baseSection: [createMockBase({ hp: 20 })],
        deck: 5,
      },
      { play: [enemy], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const bansheeId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    restUnitsByAttackingDirectly(engine, PLAYER_TWO, [enemyId]);
    passTurnThroughPublicMoves(engine, PLAYER_TWO);
    expectSuccess(p1.assignPilot(otherPilot, bansheeId));
    expectSuccess(p1.enterBattle(bansheeId, enemyId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardsInZone("trash")).toHaveLength(12);
    expect(p1.isExhausted(bansheeId)).toBe(true);
    expect(p1.getVisibleCard(bansheeId)?.keywords).not.toContain("FirstStrike");
  });
});
