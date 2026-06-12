import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04MarbetFingerhat083 } from "./083-marbet-fingerhat.ts";

describe("Marbet Fingerhat (GD04-083)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04MarbetFingerhat083] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("gives friendly League Militaire Unit tokens AP+1 while paired", () => {
    const host = createMockUnit({ linkCondition: "[Marbet Fingerhat]" });
    const token = createMockUnit({ traits: ["league militaire"], ap: 1 });
    const engine = GundamTestEngine.create({
      hand: [gd04MarbetFingerhat083],
      play: [host, token],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, tokenId] = p1.getCardsInZone("battleArea");
    engine.markAsToken(tokenId!);

    expectSuccess(p1.assignPilot(gd04MarbetFingerhat083, hostId!));

    const framework = engine.getRuntime().getFrameworkReadAPI();
    expect(getEffectiveStats(tokenId!, engine.getG(), framework.cards, framework).ap).toBe(2);
  });
});
