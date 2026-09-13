import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05RoseScreamer113 } from "../command/113-rose-screamer.ts";
import { gd05GundamRose044 } from "./044-gundam-rose.ts";

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

describe("Gundam Rose (GD05-044)", () => {
  /** @behavioral-proof complete: Link, Attack timing, and the paired Main activation are public. */
  describe("【During Link】【Attack】Activate 【Main】 on the card paired with this Unit.", () => {
    it("activates the paired George de Sand card's Main effect when it attacks", () => {
      const specialMove = pairedMainCommand("George de Sand");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05GundamRose044],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const roseId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(specialMove, roseId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(roseId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack + 1);
    });

    it("does not activate the paired Main before Gundam Rose attacks", () => {
      const specialMove = pairedMainCommand("George de Sand");
      const engine = GundamTestEngine.create({
        hand: [specialMove],
        play: [gd05GundamRose044],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const roseId = p1.getCardsInZone("battleArea")[0]!;
      const handBeforePairing = p1.getHand().length;

      expectSuccess(p1.playCommandAsPilot(specialMove, roseId));

      expect(p1.getHand()).toHaveLength(handBeforePairing - 1);
    });

    it("does not activate Main when the paired card does not satisfy Link", () => {
      const wrongPilot = pairedMainCommand("Wrong Pilot");
      const engine = GundamTestEngine.create({
        hand: [wrongPilot],
        play: [gd05GundamRose044],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const roseId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommandAsPilot(wrongPilot, roseId));
      const handBeforeAttack = p1.getHand().length;
      expectSuccess(p1.enterBattle(roseId, "direct"));

      expect(p1.getHand()).toHaveLength(handBeforeAttack);
    });

    it("resolves Rose Screamer's Main but does not activate its trash-only Pair clause", () => {
      const engine = GundamTestEngine.create({
        hand: [gd05RoseScreamer113],
        play: [gd05GundamRose044],
        resourceArea: activeResources(3),
        deck: 5,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const roseId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, roseId));
      expectSuccess(p1.enterBattle(roseId, "direct"));
      expectSuccess(p1.resolveEffect({ targets: [roseId] }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getVisibleCard(roseId)?.effectiveAp).toBe(6);
      expect(p1.getPilotId(roseId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
