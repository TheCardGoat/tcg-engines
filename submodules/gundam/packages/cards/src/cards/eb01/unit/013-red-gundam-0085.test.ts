import { describe, expect, it } from "vite-plus/test";
import { createMockUnit, expectSuccess, GundamTestEngine, PLAYER_ONE } from "@tcg/gundam-engine";
import { eb01RedGundam0085013 } from "./013-red-gundam-0085.ts";

describe("Red Gundam(0085) (EB01-013)", () => {
  it("【Attack】 gives only itself AP+2 at the six-card enemy hand threshold", () => {
    const engine = GundamTestEngine.create(
      { play: [eb01RedGundam0085013] },
      {
        hand: Array.from({ length: 6 }, () => createMockUnit()),
        shieldArea: [createMockUnit({ name: "Enemy Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const printedAp = eb01RedGundam0085013.ap;

    expectSuccess(p1.enterBattle(sourceId, "direct"));

    expect(p1.getVisibleCard(sourceId)?.effectiveAp).toBe(printedAp + 2);
  });

  it("does not gain AP when the enemy has only five cards in hand", () => {
    const engine = GundamTestEngine.create(
      { play: [eb01RedGundam0085013] },
      {
        hand: Array.from({ length: 5 }, () => createMockUnit()),
        shieldArea: [createMockUnit({ name: "Enemy Shield" })],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(sourceId, "direct"));

    expect(p1.getVisibleCard(sourceId)?.effectiveAp).toBe(eb01RedGundam0085013.ap);
  });
});
