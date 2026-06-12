import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  activeResources,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd01FortressDefense106 } from "./106-fortress-defense.ts";

describe("Fortress Defense (GD01-106)", () => {
  describe("【Main】Deploy [Zaku Ⅱ] Unit token(s).", () => {
    it("deploys 2 Zaku Ⅱ tokens into the friendly battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01FortressDefense106],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      const unitsBefore = p1.getCardsInZone("battleArea").length;

      expectSuccess(p1.playCommand(gd01FortressDefense106));

      const unitsAfter = p1.getCardsInZone("battleArea");
      expect(unitsAfter.length).toBe(unitsBefore + 2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot be played during action-phase (main-only timing)", () => {
      const engine = GundamTestEngine.create({
        hand: [gd01FortressDefense106],
        resourceArea: activeResources(5),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(gd01FortressDefense106), "WRONG_TIMING");
    });
  });

  it("deploys 2 Zaku Ⅱ tokens with AP1/HP1", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FortressDefense106],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd01FortressDefense106));

    const tokens = p1.getCardsInZone("battleArea");
    expect(tokens.length).toBe(2);
    const framework = engine.getRuntime().getFrameworkReadAPI();
    for (const tokenId of tokens) {
      const def = framework.cards.getDefinition(tokenId) as { ap?: number; hp?: number };
      expect(def.ap).toBe(1);
      expect(def.hp).toBe(1);
    }
  });

  // Regression for the missing-token-art bug. Pre-fix the deployToken
  // handler registered a synthetic UnitCard whose `cardNumber` was the
  // instance id (`token_zaku_ii_1`) — the simulator's image pipeline
  // built a malformed CDN URL from that and fell back to the tinted
  // `ArtFallback`. Pinning the printed `T-007` card means the registered
  // definition carries the real CDN-resolvable cardNumber.
  it("registers each token with the printed T-007 cardNumber for image lookup", () => {
    const engine = GundamTestEngine.create({
      hand: [gd01FortressDefense106],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.playCommand(gd01FortressDefense106));

    const tokens = p1.getCardsInZone("battleArea");
    const framework = engine.getRuntime().getFrameworkReadAPI();
    for (const tokenId of tokens) {
      const def = framework.cards.getDefinition(tokenId) as { cardNumber?: string };
      expect(def.cardNumber).toBe("T-007");
    }
  });
});
