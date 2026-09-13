import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  restedResources,
} from "@tcg/gundam-engine";
import { gd05GundamCalibarn018 } from "./018-gundam-calibarn.ts";

function exPaymentCommand() {
  return createMockCommand({
    name: "EX Payment Command",
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [{ action: { action: "draw", count: 1 } }],
        sourceText: "【Main】Draw 1.",
      },
    ],
  });
}

function enemyDamageCommand() {
  return createMockCommand({
    name: "Enemy Damage Command",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["action"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 5,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Action】Deal 5 damage to 1 enemy Unit.",
      },
    ],
  });
}

describe("Gundam Calibarn (GD05-018)", () => {
  /** @behavioral-proof complete: EX-exile trigger ownership, optional friendly target, enemy-damage reduction, decline branch, and Deploy EX resources are public. */
  describe("When one of your EX Resources is exiled from the game, you may choose 1 of your Units. During this turn, when it receives enemy damage, reduce it by 3.", () => {
    it("reduces the chosen Unit's next enemy battle damage by 3 after an EX Resource pays a cost", () => {
      const command = exPaymentCommand();
      const enemyDamage = enemyDamageCommand();
      const enemy = createMockUnit({ name: "Enemy", ap: 5, hp: 10 });
      const protectedUnit = createMockUnit({ name: "Protected Unit", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05GundamCalibarn018, command],
          deck: 2,
          resourceArea: [...activeResources(7), ...restedResources(1)],
          play: [protectedUnit],
        },
        { hand: [enemyDamage], play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyDamageId = p2.getHand()[0]!;
      const protectedUnitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05GundamCalibarn018));
      const calibarnId = p1.getCardsInZone("battleArea")[1]!;
      expectSuccess(p1.playCommand(command));

      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection")
        throw new Error("Expected Calibarn's EX-exile choice");
      expect(choice.legalTargetIds).toEqual(expect.arrayContaining([calibarnId, protectedUnitId]));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: true } }));
      expectSuccess(p1.resolveEffect({ targets: [protectedUnitId] }));

      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(enemyDamageId, { targets: [protectedUnitId] }));

      expect(p1.getDamage(protectedUnitId)).toBe(2);
    });

    it("does not reduce damage when the optional EX-exile trigger is declined", () => {
      const command = exPaymentCommand();
      const enemyDamage = enemyDamageCommand();
      const enemy = createMockUnit({ name: "Enemy", ap: 5, hp: 10 });
      const protectedUnit = createMockUnit({ name: "Protected Unit", hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05GundamCalibarn018, command],
          deck: 2,
          resourceArea: [...activeResources(7), ...restedResources(1)],
          play: [protectedUnit],
        },
        { hand: [enemyDamage], play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyDamageId = p2.getHand()[0]!;
      const protectedUnitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(gd05GundamCalibarn018));
      expectSuccess(p1.playCommand(command));

      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection")
        throw new Error("Expected Calibarn's EX-exile choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [choice.directiveIndex]: false } }));

      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(enemyDamageId, { targets: [protectedUnitId] }));

      expect(p1.getDamage(protectedUnitId)).toBe(5);
    });
  });

  describe("【Deploy】Place 3 EX Resources.", () => {
    it("places exactly 3 active EX Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05GundamCalibarn018],
        resourceArea: activeResources(8),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const before = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.deployUnit(gd05GundamCalibarn018));

      const placed = p1.getCardsInZone("resourceArea").filter((id) => !before.includes(id));
      expect(placed).toHaveLength(3);
      expect(placed.every((id) => !p1.isExhausted(id))).toBe(true);
    });
  });
});
