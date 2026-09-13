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
import { gd05CyclonePunch121 } from "../command/121-cyclone-punch.ts";
import { gd05DomonKasshu097 } from "./097-domon-kasshu.ts";

function specialMoveCommand() {
  return createMockCommand({
    name: "Special Move",
    traits: ["special move"],
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 2,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 enemy Unit. Deal 2 damage to it.",
      },
    ],
  });
}

describe("Domon Kasshu (GD05-097)", () => {
  /** @behavioral-proof complete: automatic return Burst, draw-discard identity, Special Move gate, and optional activation are public. */
  describe("【Burst】Add this card to your hand.", () => {
    function revealBurst() {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05DomonKasshu097] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      return { p2 };
    }

    it("adds Domon to hand when its controller accepts Burst", () => {
      const { p2 } = revealBurst();
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        directiveIndex: -1,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));
      expect(p2.getCardZone(gd05DomonKasshu097)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("puts Domon in trash when its controller declines Burst", () => {
      const { p2 } = revealBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: false } }));
      expect(p2.getCardZone(gd05DomonKasshu097)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【When Paired】Draw 1. Then, discard 1. If you discard a (Special Move) Command card with this effect, you may activate its 【Main】.", () => {
    function setup(discard: ReturnType<typeof createMockCommand>) {
      const host = createMockUnit({ name: "Domon Host", hp: 8 });
      const pairTarget = createMockUnit({ name: "MF Pair Target", traits: ["mf"], hp: 8 });
      const enemy = createMockUnit({ name: "Enemy", ap: 4, hp: 8 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05DomonKasshu097, discard],
          play: [host, pairTarget],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, pairTargetId] = p1.getCardsInZone("battleArea");
      const discardId = p1.getHand().find((id) => id !== p1.getHand()[0])!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd05DomonKasshu097, hostId));
      const discardChoice = p1.getBoardView().pendingChoice;
      if (discardChoice?.kind !== "targetSelection") {
        throw new Error("Expected Domon's discard choice");
      }
      expect(discardChoice.legalTargetIds).toContain(discardId);
      expectSuccess(p1.resolveEffect({ targets: [discardId] }));

      return { p1, p2, discardId, enemyId, pairTargetId: pairTargetId! };
    }

    it("draws, discards the chosen Special Move, and may activate its Main effect", () => {
      const command = specialMoveCommand();
      const { p1, p2, discardId, enemyId } = setup(command);
      const activation = p1.getBoardView().pendingChoice;
      if (activation?.kind !== "optional") {
        throw new Error("Expected optional discarded-command activation");
      }
      expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [activation.directiveIndex]: true } }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(2);
      expect(p1.getHand()).toHaveLength(1);
    });

    it("allows a discarded Cyclone Punch to activate Main and then pair from trash", () => {
      const { p1, p2, discardId, enemyId, pairTargetId } = setup(gd05CyclonePunch121);
      const activation = p1.getBoardView().pendingChoice;
      if (activation?.kind !== "optional") {
        throw new Error("Expected optional discarded-command activation");
      }
      expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [activation.directiveIndex]: true } }));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
      const pairChoice = p1.getBoardView().pendingChoice;
      if (pairChoice?.kind !== "targetSelection") {
        throw new Error("Expected Cyclone Punch's optional trash Pair choice");
      }
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [pairChoice.directiveIndex]: true } }));
      expectSuccess(p1.resolveEffect({ targets: [pairTargetId] }));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
      expect(p1.getPilotId(pairTargetId)).toBe(discardId);
      expect(p1.getCardZone(discardId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("may leave the discarded Special Move unactivated", () => {
      const command = specialMoveCommand();
      const { p1, p2, discardId, enemyId } = setup(command);
      const activation = p1.getBoardView().pendingChoice;
      if (activation?.kind !== "optional") {
        throw new Error("Expected optional discarded-command activation");
      }

      expectSuccess(p1.resolveEffect({ optionalAnswers: { [activation.directiveIndex]: false } }));

      expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(0);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not offer activation after discarding a non-Special Move Command", () => {
      const ordinaryCommand = createMockCommand({
        name: "Ordinary Command",
        traits: ["operation meteor"],
      });
      const { p1, discardId } = setup(ordinaryCommand);

      expect(p1.getCardZone(discardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toHaveLength(1);
    });
  });
});
