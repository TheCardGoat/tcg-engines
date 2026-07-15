import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAugmentedNegotiators,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Augmented Negotiators", () => {
  it("uses BLOCKER to redirect a direct attack, then makes the rival discard 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailAugmentedNegotiators, spent: false }],
      },
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
        ],
      },
    );

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(welcomeToNightCityRetailAugmentedNegotiators, { as: P1 });

    expect(engine.getState().G.attackState?.kind).toBe("fight");
    expect(
      engine.getCard(welcomeToNightCityRetailAugmentedNegotiators, "field", P1).meta.spent,
    ).toBe(true);
    expect(engine.getCardsInZone("hand", P2)).toHaveLength(0);
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });
});
