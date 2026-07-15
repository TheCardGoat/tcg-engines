import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st08LaneAim011 } from "./011-lane-aim.ts";

describe("Lane Aim (ST08-011)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const attacker = createMockUnit({ ap: 1, hp: 4 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [st08LaneAim011] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getHand()).toContain(shieldId);
  });

  describe("When you draw with an effect, if this is a blue Unit, it gains <High-Maneuver> during this turn.", () => {
    it("grants High-Maneuver to the paired blue Unit after you draw with an effect", () => {
      const host = createMockUnit({ color: "blue", ap: 2, hp: 4 });
      const drawCommand = createMockCommand({
        effect: "【Main】Draw 1.",
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "【Main】Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [st08LaneAim011, drawCommand],
        play: [host],
        resourceArea: activeResources(4),
        deck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st08LaneAim011, host));
      expectSuccess(p1.playCommand(drawCommand));

      expect(p1.getVisibleCard(hostId!)?.keywords).toContain("HighManeuver");
    });

    it("does not grant High-Maneuver when the paired Unit is not blue", () => {
      const host = createMockUnit({ color: "red", ap: 2, hp: 4 });
      const drawCommand = createMockCommand({
        effect: "【Main】Draw 1.",
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [{ action: { action: "draw", count: 1 } }],
            sourceText: "【Main】Draw 1.",
          },
        ],
      });
      const engine = GundamTestEngine.create({
        hand: [st08LaneAim011, drawCommand],
        play: [host],
        resourceArea: activeResources(4),
        deck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(st08LaneAim011, host));
      expectSuccess(p1.playCommand(drawCommand));

      expect(p1.getVisibleCard(hostId!)?.keywords).not.toContain("HighManeuver");
    });
  });
});
