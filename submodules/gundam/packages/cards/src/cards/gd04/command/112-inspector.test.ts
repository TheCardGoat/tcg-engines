import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd04Inspector112 } from "./112-inspector.ts";

describe("Inspector (GD04-112)", () => {
  describe("【Main】Deal 1 damage to all Units that are Lv.2 or lower.", () => {
    it("damages every friendly and enemy Unit at Lv.2 or lower and moves Inspector to trash", () => {
      const friendlyLow = createMockUnit({ level: 2, hp: 4 });
      const enemyLow = createMockUnit({ level: 1, hp: 4 });
      const enemyHigh = createMockUnit({ level: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04Inspector112],
          play: [friendlyLow],
          resourceArea: activeResources(4),
        },
        { play: [enemyLow, enemyHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const friendlyLowId = p1.getCardsInZone("battleArea")[0]!;
      const [enemyLowId, enemyHighId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getDamage(friendlyLowId)).toBe(1);
      expect(p2.getDamage(enemyLowId!)).toBe(1);
      expect(p2.getDamage(enemyHighId!)).toBe(0);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("cannot be played during an Action window", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04Inspector112],
        resourceArea: activeResources(4),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());

      expectFailure(p1.playCommand(commandId), "WRONG_TIMING");
      expect(p1.getCardZone(commandId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played without an active Resource for its cost", () => {
      const engine = GundamTestEngine.create({
        hand: [gd04Inspector112],
        resourceArea: restedResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd04Inspector112), "INSUFFICIENT_RESOURCES");
    });
  });

  it("can be paired as Gates Capa instead of activating the Command effect", () => {
    const host = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({
      hand: [gd04Inspector112],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommandAsPilot(commandId, hostId));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
  });
});
