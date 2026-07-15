import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamExiaTransAm049 } from "./049-gundam-exia-trans-am.ts";

describe("Gundam Exia (Trans-Am) (GD03-049)", () => {
  it("<Suppression> destroys the first 2 Shields in one direct attack", () => {
    const shields = [
      createMockUnit({ name: "First Shield" }),
      createMockUnit({ name: "Second Shield" }),
    ];
    const engine = GundamTestEngine.create(
      { play: [gd03GundamExiaTransAm049] },
      { shieldArea: shields },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(exiaId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
  });

  function setup({ cbTrashCount = 10 }: { cbTrashCount?: number } = {}) {
    const cbTrash = Array.from({ length: cbTrashCount }, (_, index) =>
      createMockUnit({ name: `CB Trash ${index + 1}`, traits: ["cb"] }),
    );
    const lowHpEnemy = createMockUnit({ name: "Low HP Enemy", ap: 1, hp: 2 });
    const highHpEnemy = createMockUnit({ name: "High HP Enemy", ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd03GundamExiaTransAm049], trash: cbTrash },
      {
        shieldArea: [createMockUnit({ name: "Shield Card" })],
        play: [highHpEnemy, lowHpEnemy],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const exiaId = p1.getCardsInZone("battleArea")[0]!;
    const [highHpEnemyId, lowHpEnemyId] = p2.getCardsInZone("battleArea");

    return {
      p1,
      p2,
      exiaId,
      highHpEnemyId: highHpEnemyId!,
      lowHpEnemyId: lowHpEnemyId!,
    };
  }

  it("destroys the lowest-HP enemy Unit after destroying a shield area card with battle damage with 10+ CB cards in trash", () => {
    const { p1, p2, exiaId, highHpEnemyId, lowHpEnemyId } = setup();

    expectSuccess(p1.enterBattle(exiaId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [lowHpEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [lowHpEnemyId] }));

    expect(p2.getCardZone(lowHpEnemyId)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getCardsInZone("battleArea")).toContain(highHpEnemyId);
  });

  it("does not destroy an enemy Unit with fewer than 10 CB cards in trash", () => {
    const { p1, p2, exiaId, lowHpEnemyId } = setup({ cbTrashCount: 9 });

    expectSuccess(p1.enterBattle(exiaId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getCardsInZone("battleArea")).toContain(lowHpEnemyId);
  });
});
