import { describe, expect, it } from "vite-plus/test";
import { alphaKiroshiOptics, spoilerPanamPalmerNomadCavalry } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Panam Palmer - Nomad Cavalry", () => {
  it("calls ready from a spent face-down state", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: spoilerPanamPalmerNomadCavalry, faceDown: true, spent: true }],
    });

    engine.callLegend(spoilerPanamPalmerNomadCavalry, { as: P1 });

    expect(engine.getCard(spoilerPanamPalmerNomadCavalry, "legendArea", P1).meta.spent).toBe(false);
  });

  it("moves Gear from herself to an attacking unit and readies that unit if it does", () => {
    const ability = spoilerPanamPalmerNomadCavalry.abilities[1]!;
    expect(ability.effects[0]).toMatchObject({ effect: "ifYouDo" });
    expect(JSON.stringify(ability.effects)).toContain(alphaKiroshiOptics.type);
  });
});
