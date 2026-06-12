import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaCorporateSurveillance,
  alphaRuthlessLowlife,
  spoilerGoroTakemuraVengefulBodyguard,
  welcomeToNightCityRetailGoroTakemuraVengefulBodyguard,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Goro Takemura - Vengeful Bodyguard", () => {
  it("calls ready even if the legend was spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: spoilerGoroTakemuraVengefulBodyguard, faceDown: true, spent: true }],
    });

    engine.callLegend(spoilerGoroTakemuraVengefulBodyguard, { as: P1 });

    expect(engine.getCard(spoilerGoroTakemuraVengefulBodyguard, "legendArea", P1).meta.spent).toBe(
      false,
    );
  });

  it("can grant a low-cost friendly unit power and blocker on a rival attack", () => {
    const ability = spoilerGoroTakemuraVengefulBodyguard.abilities[1]!;
    expect(ability.trigger).toMatchObject({ trigger: "event", event: { event: "cardAttacks" } });
    expect(JSON.stringify(ability.bindings)).toContain(alphaCorpoSecurity.type);
    expect(ability.effects.map((effect) => effect.effect)).toEqual(["modifyPower", "grantRule"]);
  });

  it("retail version triggers when a friendly unit uses BLOCKER", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [alphaCorporateSurveillance],
        field: [alphaCorpoSecurity],
        legendArea: [
          { card: welcomeToNightCityRetailGoroTakemuraVengefulBodyguard, faceDown: false },
        ],
      },
      {
        field: [{ card: alphaRuthlessLowlife, playedThisTurn: false }],
      },
      { activePlayerId: P2 },
    );

    engine.attackRival(alphaRuthlessLowlife, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(alphaCorpoSecurity, { as: P1 });

    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "chooseTarget",
      payload: { type: "discardFromHand" },
    });
    engine.resolveDiscardFromHand([alphaCorporateSurveillance], { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(1);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaCorporateSurveillance.id,
    );
    expect(engine.getEvents("cardsDrawn").some((event) => event.playerId === P1)).toBe(true);
  });
});
