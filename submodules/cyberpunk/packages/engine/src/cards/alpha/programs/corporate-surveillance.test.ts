import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorporateSurveillance,
  alphaRuthlessLowlife,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Corporate Surveillance", () => {
  it("spends a chosen rival unit that costs 3 or less, then trashes the program", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaCorporateSurveillance],
        eddies: 2,
      },
      {
        field: [{ card: alphaRuthlessLowlife, spent: false }],
      },
    );

    expect(engine.playCard(alphaCorporateSurveillance, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");

    expect(engine.resolveEffectTarget(alphaRuthlessLowlife, { as: P1 })).toMatchObject({
      success: true,
    });

    expect(engine.getCard(alphaRuthlessLowlife, "field", P2).meta.spent).toBe(true);
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === alphaCorporateSurveillance.id),
    ).toBe(true);
  });

  it("does not offer rival units that cost more than 3 as effect targets", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaCorporateSurveillance],
        eddies: 2,
      },
      {
        field: [
          { card: alphaRuthlessLowlife, spent: false },
          { card: alphaArmoredMinotaur, spent: false },
        ],
      },
    );

    engine.playCard(alphaCorporateSurveillance, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected Corporate Surveillance to ask for a rival unit target.");
    }

    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toContain(alphaRuthlessLowlife.id);
    expect(eligibleDefinitions).not.toContain(alphaArmoredMinotaur.id);
  });
});
