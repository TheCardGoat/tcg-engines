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
import type { CommandCard } from "@tcg/gundam-types";
import { gd04Kindhearted101 } from "./101-kindhearted.ts";

function destroyCommand(
  timing: "main" | "action",
  targetOwner: "friendly" | "opponent",
): CommandCard {
  return createMockCommand({
    level: 1,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: [timing] },
        directives: [
          {
            action: {
              action: "destroy",
              target: { owner: targetOwner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【${timing === "main" ? "Main" : "Action"}】Destroy 1 Unit.`,
      },
    ],
  });
}

describe("Kindhearted (GD04-101)", () => {
  it("【Main】draws 1 and moves the Command to trash", () => {
    const drawCard = createMockUnit({ name: "Drawn Card" });
    const remainingCard = createMockUnit({ name: "Remaining Card" });
    const engine = GundamTestEngine.create({
      hand: [gd04Kindhearted101],
      resourceArea: activeResources(3),
      deck: [remainingCard, drawCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Action】can be played through the end-phase action window", () => {
    const drawCard = createMockUnit({ name: "Action Draw" });
    const remainingCard = createMockUnit({ name: "Remaining Card" });
    const engine = GundamTestEngine.create({
      hand: [gd04Kindhearted101],
      resourceArea: activeResources(3),
      deck: [remainingCard, drawCard],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("【Burst】offers activation, draws 1, and then moves the Shield to trash", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 5 });
    const drawCard = createMockUnit({ name: "Burst Draw" });
    const remainingCard = createMockUnit({ name: "Remaining Card" });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04Kindhearted101], deck: [remainingCard, drawCard] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice?.kind).toBe("optional");
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(1);
    expect(p1.getCardZone(gd04Kindhearted101)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("loses immediately after an effect draws the final deck card", () => {
    const finalCard = createMockUnit({ name: "Final Card" });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04Kindhearted101],
        resourceArea: activeResources(3),
        deck: [finalCard],
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd04Kindhearted101));

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("deck")).toHaveLength(0);
    expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
  });

  describe("During this turn, friendly Units can't be destroyed by enemy effects.", () => {
    it("prevents an enemy Action effect from destroying a friendly Unit", () => {
      const protectedUnit = createMockUnit({ name: "Protected Unit", hp: 4 });
      const attacker = createMockUnit({ name: "Friendly Attacker", ap: 2, hp: 5 });
      const defender = createMockUnit({ name: "Rested Defender", ap: 1, hp: 5 });
      const enemyDestroy = destroyCommand("action", "opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [gd04Kindhearted101],
          play: [protectedUnit, attacker],
          resourceArea: activeResources(3),
          deck: 3,
        },
        {
          hand: [enemyDestroy],
          play: [{ card: defender, exhausted: true }],
          resourceArea: activeResources(1),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [protectedId, attackerId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const enemyCommandId = p2.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      expectSuccess(p1.enterBattle(attackerId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.playCommand(enemyCommandId, { targets: [protectedId!] }));

      expect(p1.getCardsInZone("battleArea")).toContain(protectedId);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getCardZone(enemyCommandId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not prevent a friendly effect from destroying its controller's Unit", () => {
      const ownUnit = createMockUnit({ hp: 4 });
      const ownDestroy = destroyCommand("main", "friendly");
      const engine = GundamTestEngine.create({
        hand: [gd04Kindhearted101, ownDestroy],
        play: [ownUnit],
        resourceArea: activeResources(3),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [commandId, ownDestroyId] = p1.getHand();
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandId!));
      expectSuccess(p1.playCommand(ownDestroyId!, { targets: [unitId] }));

      expect(p1.getCardZone(unitId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId!)).toBe(`trash:${PLAYER_ONE}`);
    });
  });
});
