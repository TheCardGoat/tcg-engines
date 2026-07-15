import { describe, it, expect } from "vite-plus/test";
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
import { gd04GundamDx049 } from "./049-gundam-dx.ts";
import { gd04DestinedBattle107 } from "../command/107-destined-battle.ts";
import { gd04PalaSys094 } from "../pilot/094-pala-sys.ts";

describe("Gundam DX (GD04-049)", () => {
  it("<Suppression> destroys the first 2 Shields in one direct attack", () => {
    const firstShield = createMockUnit({ name: "First Shield" });
    const secondShield = createMockUnit({ name: "Second Shield" });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamDx049] },
      { shieldArea: [firstShield, secondShield] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
    const shieldIds = p2.getCardsInZone("shieldArea");

    expectSuccess(p1.enterBattle(gundamDxId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
    expect(p2.getCardsInZone("trash")).toEqual(expect.arrayContaining(shieldIds));
  });

  it("lets the Shield owner choose which simultaneous Burst to resolve first", () => {
    const engine = GundamTestEngine.create(
      { play: [gd04GundamDx049] },
      { shieldArea: [gd04DestinedBattle107, gd04PalaSys094] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
    const [destinedBattleId, palaSysId] = p2.getCardsInZone("shieldArea");

    expectSuccess(p1.enterBattle(gundamDxId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    const ordering = p2.getBoardView().pendingChoice;
    expect(ordering).toMatchObject({
      kind: "ordering",
      controllerId: PLAYER_TWO,
      candidates: expect.arrayContaining([
        expect.objectContaining({ sourceCardId: destinedBattleId }),
        expect.objectContaining({ sourceCardId: palaSysId }),
      ]),
    });
    if (ordering?.kind !== "ordering") throw new Error("Expected Burst ordering choice");
    expect(ordering.candidates.map((candidate) => candidate.label).join(" ")).toContain(
      "Destined Battle",
    );
    expect(ordering.candidates.map((candidate) => candidate.label).join(" ")).toContain("Pala Sys");

    const palaBurst = ordering.candidates.find((candidate) => candidate.sourceCardId === palaSysId);
    expectSuccess(p2.resolveEffect({ pendingEffectId: palaBurst!.effectId }));

    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: palaSysId,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p2.getHand()).toContain(palaSysId);
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: destinedBattleId,
    });
  });

  describe("【During Pair】【Attack】If you are attacking the enemy player, you may choose 7 (Vulture) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit/Base that is Lv.8 or lower. Destroy it.", () => {
    function vultureTrash(count: number) {
      return Array.from({ length: count }, (_, index) =>
        createMockUnit({ name: `Vulture ${index + 1}`, traits: ["vulture"] }),
      );
    }

    it("exiles 7 Vulture cards from trash to destroy an enemy Lv.8 Unit on direct attack", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", cost: 1 });
      const trash = vultureTrash(7);
      const destroyTarget = createMockUnit({ name: "Enemy Target", level: 8, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd04GundamDx049],
          trash,
          resourceArea: activeResources(1),
        },
        { play: [destroyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
      const trashIds = p1.getCardsInZone("trash");
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gundamDxId));
      expectSuccess(p1.enterBattle(gundamDxId, "direct"));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
      expectSuccess(p1.resolveEffect({ targets: [...trashIds, targetId] }));

      for (const trashId of trashIds) {
        expect(p1.getCardZone(trashId)).toBe("removalArea");
      }
      expect(p2.getCardsInZone("trash")).toContain(targetId);
    });

    it("can destroy an enemy Base at Lv.8 or lower", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", cost: 1 });
      const trash = vultureTrash(7);
      const destroyTarget = createMockBase({ name: "Enemy Base", level: 8, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd04GundamDx049],
          trash,
          resourceArea: activeResources(1),
        },
        { baseSection: [destroyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
      const trashIds = p1.getCardsInZone("trash");
      const targetId = p2.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.assignPilot(pilot, gundamDxId));
      expectSuccess(p1.enterBattle(gundamDxId, "direct"));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
      expectSuccess(p1.resolveEffect({ targets: [...trashIds, targetId] }));

      expect(p2.getCardsInZone("baseSection")).not.toContain(targetId);
      expect(p2.getCardsInZone("trash")).toContain(targetId);
    });

    it("declining the exile skips the destroy", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", cost: 1 });
      const trash = vultureTrash(7);
      const destroyTarget = createMockUnit({ name: "Enemy Target", level: 8, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd04GundamDx049],
          trash,
          resourceArea: activeResources(1),
        },
        { play: [destroyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gundamDxId));
      expectSuccess(p1.enterBattle(gundamDxId, "direct"));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p2.getCardsInZone("battleArea")).toContain(targetId);
      expect(p1.getCardsInZone("trash")).toHaveLength(7);
    });

    it("does not trigger when attacking an enemy Unit instead of the enemy player", () => {
      const pilot = createMockPilot({ name: "Garrod Ran", cost: 1 });
      const trash = vultureTrash(7);
      const attackTarget = {
        card: createMockUnit({ name: "Rested Enemy", ap: 1, hp: 7 }),
        exhausted: true,
      };
      const destroyTarget = createMockUnit({ name: "Enemy Target", level: 8, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [gd04GundamDx049],
          trash,
          resourceArea: activeResources(1),
        },
        { play: [attackTarget, destroyTarget] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamDxId = p1.getCardsInZone("battleArea")[0]!;
      const [attackTargetId, destroyTargetId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, gundamDxId));
      expectSuccess(p1.enterBattle(gundamDxId, attackTargetId!));

      expect(p2.getCardsInZone("battleArea")).toContain(destroyTargetId!);
      expect(p1.getCardsInZone("trash")).toHaveLength(7);
    });
  });
});
