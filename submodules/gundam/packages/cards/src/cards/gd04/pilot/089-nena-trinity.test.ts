import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04NenaTrinity089 } from "./089-nena-trinity.ts";

describe("Nena Trinity (GD04-089)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04NenaTrinity089] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  describe("【Activate･Main】<Support 2> (Rest this Unit. 1 other friendly Unit gets AP+(specified amount) during this turn.)", () => {
    it("rests this Unit and gives one other friendly Unit AP+2 this turn", () => {
      const host = createMockUnit({ ap: 2 });
      const target = createMockUnit({ ap: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd04NenaTrinity089],
        play: [host, target],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, targetId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd04NenaTrinity089, hostId!));
      expectSuccess(p1.useSupport(hostId!, targetId!));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(p1.isExhausted(hostId!)).toBe(true);
      expect(getEffectiveStats(targetId!, engine.getG(), framework.cards, framework).ap).toBe(5);
    });

    it("cannot target the supported Unit itself", () => {
      const host = createMockUnit({ ap: 2 });
      const engine = GundamTestEngine.create({
        hand: [gd04NenaTrinity089],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04NenaTrinity089, hostId));

      expectFailure(p1.useSupport(hostId, hostId), "ILLEGAL_TARGET");
    });
  });
});
