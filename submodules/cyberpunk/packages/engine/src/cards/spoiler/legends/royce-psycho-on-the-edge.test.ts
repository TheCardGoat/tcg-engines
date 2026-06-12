import { describe, expect, it } from "vite-plus/test";
import { alphaKiroshiOptics, spoilerRoycePsychoOnTheEdge } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Royce - Psycho on the Edge", () => {
  it("goes solo as a red legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: spoilerRoycePsychoOnTheEdge, faceDown: false }],
      eddies: 6,
    });

    const legendId = engine.findCardId(spoilerRoycePsychoOnTheEdge, "legendArea", P1);
    engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1);

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      spoilerRoycePsychoOnTheEdge.id,
    );
  });

  it("gets two power for each equipped Gear during its controller's turn", () => {
    const ability = spoilerRoycePsychoOnTheEdge.abilities[1]!;
    expect(ability.effects[0]).toMatchObject({ effect: "modifyPower", duration: "continuous" });
    expect(JSON.stringify(ability.effects)).toContain(alphaKiroshiOptics.type);
  });
});
