import { describe, expect, it } from "vite-plus/test";
import { alphaRuthlessLowlife, welcomeToNightCityRetailMoxInciters } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Mox Inciters", () => {
  it("makes the chosen rival Unit attack next turn if it can", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        eddies: 3,
      },
      {
        field: [{ card: alphaRuthlessLowlife, spent: false, playedThisTurn: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
    engine.resolveEffectTarget(alphaRuthlessLowlife, { as: P1 });
    engine.skipToNextPlayerTurn(P1);

    const failure = engine.expectFailure(() => engine.completeTurn({ as: P2 }));
    expect(failure.errorCode).toBe("MUST_ATTACK");
  });
});
