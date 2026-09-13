import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01GundamEpyon040 } from "./040-gundam-epyon.ts";

describe("Gundam Epyon (EB01-040)", () => {
  /** @behavioral-proof complete: the standard two-player enemy-count gate prevents the conditional Breach grant. */
  it("does not trigger with only one enemy player", () => {
    const ally = createMockUnit({ name: "Ally" });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01GundamEpyon040],
        play: [ally],
        resourceArea: activeResources(8),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const allyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.deployUnit(eb01GundamEpyon040));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getVisibleCard(allyId)?.keywords).not.toContain("Breach");
  });
});
