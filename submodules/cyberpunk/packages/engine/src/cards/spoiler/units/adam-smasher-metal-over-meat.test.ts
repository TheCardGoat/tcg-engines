import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  spoilerAdamSmasherMetalOverMeat,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Adam Smasher - Metal Over Meat", () => {
  it("defeats every other unit when played and leaves Adam on the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerAdamSmasherMetalOverMeat],
        field: [alphaArmoredMinotaur],
        eddies: 9,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    engine.playCard(spoilerAdamSmasherMetalOverMeat, { as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toEqual([
      spoilerAdamSmasherMetalOverMeat.id,
    ]);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      alphaArmoredMinotaur.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });
});
