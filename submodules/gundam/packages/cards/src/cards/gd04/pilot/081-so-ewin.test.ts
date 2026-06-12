import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04SoEwin081 } from "./081-so-ewin.ts";

describe("Uso Ewin (GD04-081)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04SoEwin081] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("【When Paired】deploys a Parts token if paired Unit is League Militaire", () => {
    const host = createMockUnit({ traits: ["league militaire"] });
    const engine = GundamTestEngine.create({
      hand: [gd04SoEwin081],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04SoEwin081, hostId));

    const tokenId = p1.getCardsInZone("battleArea").at(-1)!;
    const token = engine.getRuntime().getFrameworkReadAPI().cards.getDefinition(tokenId);
    expect(token?.name).toBe("Parts");
  });
});
