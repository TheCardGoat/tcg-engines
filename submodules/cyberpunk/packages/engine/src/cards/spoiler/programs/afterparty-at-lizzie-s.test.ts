import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, spoilerAfterpartyAtLizzieS } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Afterparty at Lizzie's", () => {
  it("adjusts a rival Gig by up to two and draws when it matches a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerAfterpartyAtLizzieS],
        deck: [alphaCorpoSecurity],
        eddies: 2,
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 3 }],
      },
    );

    const drawCard = engine
      .getCardsInZone("deck", P1)
      .find((card) => card.definitionId === alphaCorpoSecurity.id);
    if (!drawCard) throw new Error("Expected Corpo Security in deck.");
    engine.judgeStackDeck([drawCard], { as: P1 });
    const handBefore = engine.getHandCount(P1);
    engine.playCard(spoilerAfterpartyAtLizzieS, { as: P1 });
    engine.resolve(spoilerAfterpartyAtLizzieS, { rivalGig: "d8" }, { as: P1 });
    expect(engine.executeMove("resolveAdjustGig", { args: { value: 5 } }, P1)).toMatchObject({
      success: true,
    });

    expect(engine.getGigValue(P2)).toBe(5);
    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });

  it("trashes after resolving even when no friendly Gig matches", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerAfterpartyAtLizzieS],
        eddies: 2,
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
    );

    engine.playCard(spoilerAfterpartyAtLizzieS, { as: P1 });
    engine.resolve(spoilerAfterpartyAtLizzieS, { rivalGig: "d8" }, { as: P1 });
    expect(engine.executeMove("resolveAdjustGig", { args: { value: 4 } }, P1)).toMatchObject({
      success: true,
    });

    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === spoilerAfterpartyAtLizzieS.id),
    ).toBe(true);
  });
});
