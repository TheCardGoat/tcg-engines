import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03LookOfDetermination114 } from "./114-look-of-determination.ts";

function trashCards(count: number) {
  return Array.from({ length: count }, (_, i) => createMockCommand({ name: `Trash ${i}` }));
}

describe("Look of Determination (GD03-114)", () => {
  it("【Action】 destroys an active enemy Unit that is Lv.2 or lower", () => {
    const legalEnemy = createMockUnit({ level: 2 });
    const tooHigh = createMockUnit({ level: 3 });
    const engine = GundamTestEngine.create(
      { hand: [gd03LookOfDetermination114], resourceArea: activeResources(2) },
      { play: [legalEnemy, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const [legalEnemyId, tooHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.playCommand(commandId, { targets: [tooHighId!] }), "INVALID_TARGET");
    expectSuccess(p1.playCommand(commandId, { targets: [legalEnemyId!] }));

    expect(p2.getCardsInZone("trash")).toContain(legalEnemyId);
    expect(p2.getCardsInZone("battleArea")).toContain(tooHighId);
  });

  it("with 10 cards in trash, destroys Lv.4 but still rejects Lv.5", () => {
    const legalEnemy = createMockUnit({ level: 4 });
    const tooHigh = createMockUnit({ level: 5 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03LookOfDetermination114],
        trash: trashCards(10),
        resourceArea: activeResources(2),
      },
      { play: [legalEnemy, tooHigh] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const [legalEnemyId, tooHighId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectFailure(p1.playCommand(commandId, { targets: [tooHighId!] }), "INVALID_TARGET");
    expectSuccess(p1.playCommand(commandId, { targets: [legalEnemyId!] }));

    expect(p2.getCardsInZone("trash")).toContain(legalEnemyId);
    expect(p2.getCardsInZone("battleArea")).toContain(tooHighId);
  });

  it("【Burst】 lets its controller choose and destroy a legal active enemy Unit", () => {
    const attacker = createMockUnit({ level: 1, ap: 1, hp: 4 });
    const burstTarget = createMockUnit({ level: 2, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker, burstTarget] },
      { shieldArea: [gd03LookOfDetermination114] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [attackerId, burstTargetId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId!, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [burstTargetId],
    });
    expectSuccess(p2.resolveEffect({ targets: [burstTargetId!] }));

    expect(p1.getCardsInZone("trash")).toContain(burstTargetId);
    expect(p2.getCardZone(gd03LookOfDetermination114)).toBe(`trash:${PLAYER_TWO}`);
  });
});
