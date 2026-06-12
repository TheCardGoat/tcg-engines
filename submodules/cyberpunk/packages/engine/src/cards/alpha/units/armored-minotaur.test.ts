import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Armored Minotaur", () => {
  it("defeats a chosen rival unit with power 5 or less when friendly Street Cred is at least 12", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaArmoredMinotaur],
        eddies: 6,
        gigArea: [
          { dieType: "d8", faceValue: 7 },
          { dieType: "d6", faceValue: 5 },
        ],
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false }],
      },
    );

    expect(engine.playCard(alphaArmoredMinotaur, { as: P1 })).toMatchObject({ success: true });
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
        .getCardsInZone("trash", P2)
        .some((card) => card.definitionId === alphaSwordwiseHuscle.id),
    ).toBe(true);
  });

  it("does not trigger below 12 Street Cred even when a small rival unit exists", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaArmoredMinotaur],
        eddies: 6,
        gigArea: [{ dieType: "d8", faceValue: 11 }],
      },
      {
        field: [{ card: alphaRuthlessLowlife, spent: false }],
      },
    );

    expect(engine.playCard(alphaArmoredMinotaur, { as: P1 })).toMatchObject({ success: true });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(
      engine
        .getCardsInZone("field", P2)
        .some((card) => card.definitionId === alphaRuthlessLowlife.id),
    ).toBe(true);
  });
});
