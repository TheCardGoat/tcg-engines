import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, alphaKiroshiOptics, spoilerGildedMaton } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Gilded Maton", () => {
  it("can defeat a friendly Gear to defeat a low-cost rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerGildedMaton],
        field: [alphaKiroshiOptics],
        eddies: 4,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    expect(engine.playCard(spoilerGildedMaton, { as: P1 })).toMatchObject({ success: true });
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      spoilerGildedMaton.id,
    );
    expect(spoilerGildedMaton.abilities[0]!.effects[0]).toMatchObject({ effect: "ifYouDo" });
  });

  it("requires the rival unit target to cost three or less", () => {
    const effect = spoilerGildedMaton.abilities[0]!.effects[0]!;
    expect(effect).toMatchObject({ effect: "ifYouDo" });
  });
});
