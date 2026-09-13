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
import { gd05GravitonHammer122 } from "../command/122-graviton-hammer.ts";
import { gd05BoltGundam076 } from "./076-bolt-gundam.ts";

function pairedMainCommand(pilotName: string) {
  return createMockCommand({
    name: `${pilotName} Special Move`,
    pilotName,
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

describe("Bolt Gundam (GD05-076)", () => {
  /** @behavioral-proof complete: Link, Attack timing, and the paired Main activation are public. */
  describe("【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.", () => {
    it("activates the paired Argo Gulskii card's Main effect when it attacks", () => {
      const specialMove = pairedMainCommand("Argo Gulskii");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05BoltGundam076],
        resourceArea: activeResources(4),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const boltId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(specialMove, boltId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(boltId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack + 1);
    });

    it("does not activate the paired Main before Bolt Gundam attacks", () => {
      const specialMove = pairedMainCommand("Argo Gulskii");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05BoltGundam076],
        resourceArea: activeResources(4),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const boltId = p1.getCardsInZone("battleArea")[0]!;
      const handBeforePairing = p1.getHand().length;

      expectSuccess(p1.playCommandAsPilot(specialMove, boltId));

      expect(p1.getHand()).toHaveLength(handBeforePairing - 1);
    });

    it("does not activate Main when the paired card does not satisfy Link", () => {
      const wrongPilot = pairedMainCommand("Wrong Pilot");
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [gd05BoltGundam076],
        resourceArea: activeResources(4),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const boltId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(wrongPilot, boltId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(boltId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack);
    });

    it("resolves Graviton Hammer's Main but does not activate its trash-only Pair clause", () => {
      const enemy = createMockUnit({ name: "Enemy", level: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05GravitonHammer122],
          play: [gd05BoltGundam076],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const boltId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, boltId));
      expectSuccess(p1.enterBattle(boltId, "direct"));
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.isExhausted(enemyId)).toBe(true);
      expect(p1.getPilotId(boltId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
