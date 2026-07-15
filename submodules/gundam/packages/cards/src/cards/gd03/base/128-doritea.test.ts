import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AHealthyCuriosity101 } from "../command/101-a-healthy-curiosity.ts";
import { gd03HumanKarma113 } from "../command/113-human-karma.ts";
import { gd03Doritea128 } from "./128-doritea.ts";

describe("Doritea (GD03-128)", () => {
  it("lets its owner deploy it when its Burst is revealed by a direct attack", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd03Doritea128] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_TWO,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03Doritea128)).toBe(`baseSection:${PLAYER_TWO}`);
  });

  it("adds one shield to its owner's hand when deployed", () => {
    const returnedShield = createMockUnit({
      cardNumber: "TEST-RETURNED-SHIELD",
      name: "Returned Shield",
    });
    const engine = GundamTestEngine.create({
      hand: [gd03Doritea128],
      resourceArea: activeResources(4),
      shieldArea: [returnedShield],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Doritea128));

    expect(p1.getCardZone(returnedShield)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(gd03Doritea128)).toBe(`baseSection:${PLAYER_ONE}`);
  });

  it("deals 1 damage after an opponent's effect rests a friendly Unit on their turn", () => {
    const friendlyUnit = createMockUnit({ cardNumber: "TEST-FRIENDLY", hp: 4 });
    const firstEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-A", hp: 4 });
    const secondEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-B", hp: 4 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd03Doritea128], play: [friendlyUnit] },
      {
        hand: [gd03AHealthyCuriosity101],
        play: [firstEnemy, secondEnemy],
        trash: [healthyCuriosityCopy("A"), healthyCuriosityCopy("B")],
        deck: [
          createMockUnit({ cardNumber: "TEST-DRAW-BOTTOM" }),
          createMockUnit({ cardNumber: "TEST-DRAW-A" }),
          createMockUnit({ cardNumber: "TEST-DRAW-B" }),
        ],
        resourceArea: activeResources(3),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
    const commandId = p2.getHand()[0]!;

    expectSuccess(p2.playCommand(commandId));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_TWO,
      legalTargetIds: [friendlyId],
    });
    expectSuccess(p2.resolveEffect({ targets: [friendlyId] }));
    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      legalTargetIds: [firstEnemyId, secondEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p2.getDamage(firstEnemyId!)).toBe(1);
    expect(p2.getDamage(secondEnemyId!)).toBe(0);
  });

  it("does not trigger when the player's own effect rests their Unit", () => {
    const friendlyUnit = createMockUnit({ level: 4, hp: 4 });
    const enemyUnit = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd03HumanKarma113],
        baseSection: [gd03Doritea128],
        play: [friendlyUnit],
        resourceArea: activeResources(3),
      },
      { play: [enemyUnit] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03HumanKarma113, { targets: [friendlyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getDamage(enemyId)).toBe(3);
  });

  it("triggers only once when two Units are rested by enemy effects in one turn", () => {
    const firstFriendly = createMockUnit({ cardNumber: "TEST-FRIENDLY-A", hp: 4 });
    const secondFriendly = createMockUnit({ cardNumber: "TEST-FRIENDLY-B", hp: 4 });
    const firstEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-A", hp: 4 });
    const secondEnemy = createMockUnit({ cardNumber: "TEST-ENEMY-B", hp: 4 });
    const engine = GundamTestEngine.create(
      { baseSection: [gd03Doritea128], play: [firstFriendly, secondFriendly] },
      {
        hand: [gd03AHealthyCuriosity101, gd03AHealthyCuriosity101],
        play: [firstEnemy, secondEnemy],
        trash: [healthyCuriosityCopy("A"), healthyCuriosityCopy("B")],
        deck: [
          createMockUnit({ cardNumber: "TEST-DRAW-BOTTOM-ONCE" }),
          createMockUnit({ cardNumber: "TEST-DRAW-A" }),
          createMockUnit({ cardNumber: "TEST-DRAW-B" }),
        ],
        resourceArea: activeResources(3),
      },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [firstFriendlyId, secondFriendlyId] = p1.getCardsInZone("battleArea");
    const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
    const [firstCommandId, secondCommandId] = p2.getHand();

    expectSuccess(p2.playCommand(firstCommandId!));
    expectSuccess(p2.resolveEffect({ targets: [firstFriendlyId!] }));
    expect(p1.isExhausted(firstFriendlyId!)).toBe(true);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      legalTargetIds: [firstEnemyId, secondEnemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [firstEnemyId!] }));
    expectSuccess(p2.playCommand(secondCommandId!));
    expectSuccess(p2.resolveEffect({ targets: [secondFriendlyId!] }));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getDamage(firstEnemyId!)).toBe(1);
    expect(p2.getDamage(secondEnemyId!)).toBe(0);
  });
});

function healthyCuriosityCopy(suffix: string) {
  return createMockCommand({
    cardNumber: `TEST-HEALTHY-CURIOSITY-${suffix}`,
    name: "A Healthy Curiosity",
  });
}
