import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, spoilerPeaceOffering } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Peace Offering", () => {
  it("sets one Gig to another Gig's value and draws from a value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [spoilerPeaceOffering],
      deck: [alphaCorpoSecurity],
      eddies: 1,
      gigArea: [
        { dieType: "d4", faceValue: 3 },
        { dieType: "d6", faceValue: 6 },
      ],
    });
    const drawCard = engine
      .getCardsInZone("deck", P1)
      .find((card) => card.definitionId === alphaCorpoSecurity.id);
    if (!drawCard) throw new Error("Expected Corpo Security in deck.");
    engine.judgeStackDeck([drawCard], { as: P1 });
    const handBefore = engine.getHandCount(P1);

    engine.playCard(spoilerPeaceOffering, { as: P1 });
    const selectedGigIds = engine.getGigDice(P1).map((die) => die.id);
    expect(
      engine.executeMove(
        "resolveEffectTarget",
        { args: { targetIds: selectedGigIds.map((id) => id as string) } },
        P1,
      ),
    ).toMatchObject({ success: true });

    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === spoilerPeaceOffering.id),
    ).toBe(true);
  });
});
