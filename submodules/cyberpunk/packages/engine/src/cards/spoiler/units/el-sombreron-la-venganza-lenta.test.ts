import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, spoilerElSombreronLaVenganzaLenta } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("El Sombreron - La Venganza Lenta", () => {
  it("doubles power while fighting a rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: spoilerElSombreronLaVenganzaLenta, spent: false, playedThisTurn: false }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.attackUnit(spoilerElSombreronLaVenganzaLenta, alphaCorpoSecurity, { as: P1 });
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      spoilerElSombreronLaVenganzaLenta.id,
    );
  });
});
