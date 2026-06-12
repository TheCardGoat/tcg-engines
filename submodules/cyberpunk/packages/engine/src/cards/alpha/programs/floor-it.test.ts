import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaFloorIt,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Floor It", () => {
  it("returns a spent unit that costs 4 or less to its owner's hand", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaFloorIt],
        eddies: 3,
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: true }],
      },
    );

    expect(engine.playCard(alphaFloorIt, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");

    expect(engine.resolveEffectTarget(alphaSwordwiseHuscle, { as: P1 })).toMatchObject({
      success: true,
    });

    expect(
      engine
        .getCardsInZone("field", P2)
        .some((card) => card.definitionId === alphaSwordwiseHuscle.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("hand", P2)
        .some((card) => card.definitionId === alphaSwordwiseHuscle.id),
    ).toBe(true);
    expect(
      engine.getCardsInZone("trash", P1).some((card) => card.definitionId === alphaFloorIt.id),
    ).toBe(true);
  });

  it("only offers spent units that meet the cost ceiling", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaFloorIt],
        eddies: 3,
      },
      {
        field: [
          { card: alphaRuthlessLowlife, spent: false },
          { card: alphaSwordwiseHuscle, spent: true },
          { card: alphaArmoredMinotaur, spent: true },
        ],
      },
    );

    engine.playCard(alphaFloorIt, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected Floor It to ask for a spent unit target.");
    }

    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toEqual([alphaSwordwiseHuscle.id]);
  });
});
