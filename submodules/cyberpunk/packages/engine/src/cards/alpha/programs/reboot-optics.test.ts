import { describe, expect, it } from "vite-plus/test";
import {
  alphaRebootOptics,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";

describe("Reboot Optics", () => {
  it("gives a chosen friendly unit +4 power for this turn and defeats it at end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [alphaRebootOptics],
      field: [{ card: alphaRuthlessLowlife, spent: false }],
      eddies: 2,
    });

    expect(engine.playCard(alphaRebootOptics, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");

    expect(engine.resolveEffectTarget(alphaRuthlessLowlife, { as: P1 })).toMatchObject({
      success: true,
    });

    const boosted = engine.getCard(alphaRuthlessLowlife, "field", P1);
    expect(getEffectivePower(engine.getState(), boosted.instanceId)).toBe(5);

    engine.completeTurn({ as: P1 });

    expect(
      engine
        .getCardsInZone("field", P1)
        .some((card) => card.definitionId === alphaRuthlessLowlife.id),
    ).toBe(false);
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === alphaRuthlessLowlife.id),
    ).toBe(true);
  });

  it("only offers friendly units as targets", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaRebootOptics],
        field: [{ card: alphaRuthlessLowlife, spent: false }],
        eddies: 2,
      },
      {
        field: [{ card: alphaSwordwiseHuscle, spent: false }],
      },
    );

    engine.playCard(alphaRebootOptics, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected Reboot Optics to ask for a friendly unit target.");
    }

    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toContain(alphaRuthlessLowlife.id);
    expect(eligibleDefinitions).not.toContain(alphaSwordwiseHuscle.id);
  });
});
