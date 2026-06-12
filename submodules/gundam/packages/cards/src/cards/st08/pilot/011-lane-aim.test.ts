import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st08LaneAim011 } from "./011-lane-aim.ts";

describe("Lane Aim (ST08-011)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [st08LaneAim011] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed failed");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
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

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(
        getEffectiveStats(hostId!, engine.getG(), framework.cards, framework).keywords,
      ).toContain("HighManeuver");
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

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(
        getEffectiveStats(hostId!, engine.getG(), framework.cards, framework).keywords,
      ).not.toContain("HighManeuver");
    });
  });
});
