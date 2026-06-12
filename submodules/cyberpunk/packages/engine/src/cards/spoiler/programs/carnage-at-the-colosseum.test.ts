import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  alphaTBugAmateurPhilosopher,
  spoilerCarnageAtTheColosseum,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Carnage At The Colosseum", () => {
  it("defeats a rival unit with less power than a friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerCarnageAtTheColosseum],
        field: [alphaArmoredMinotaur],
        eddies: 6,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    engine.playCard(spoilerCarnageAtTheColosseum, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(alphaCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });

  it("does not offer a rival unit that is not weaker than a friendly unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerCarnageAtTheColosseum],
        field: [alphaTBugAmateurPhilosopher],
        eddies: 6,
      },
      {
        field: [alphaArmoredMinotaur, alphaCorpoSecurity],
      },
    );

    engine.playCard(spoilerCarnageAtTheColosseum, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget" || !choice.payload.eligibleIds) {
      throw new Error("Expected target choice.");
    }
    const eligibleDefinitions = choice.payload.eligibleIds.map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toContain(alphaCorpoSecurity.id);
    expect(eligibleDefinitions).not.toContain(alphaArmoredMinotaur.id);
  });
});
