import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  spoilerVStreetkid,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("V - Streetkid", () => {
  it("goes solo from the legend area", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: spoilerVStreetkid, faceDown: false }],
      eddies: 4,
    });

    const legendId = engine.findCardId(spoilerVStreetkid, "legendArea", P1);
    engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1);

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      spoilerVStreetkid.id,
    );
  });

  it("on defeat trashes three cards then moves a Braindance Program from trash to hand", () => {
    const ability = spoilerVStreetkid.abilities[1]!;
    expect(ability.trigger).toEqual({ trigger: "defeated" });
    expect(ability.effects.map((effect) => effect.effect)).toEqual(["trashFromDeck", "moveCard"]);
    expect(JSON.stringify(ability.effects)).toContain(alphaCorporateSurveillance.type);
    expect(alphaCorpoSecurity.type).toBe("unit");
  });
});
