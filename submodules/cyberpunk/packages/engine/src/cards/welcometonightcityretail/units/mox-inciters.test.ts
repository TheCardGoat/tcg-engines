import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Mox Inciters", () => {
  it("makes the chosen rival Unit attack next turn if it can", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.skipToNextPlayerTurn(P1);

    const prompt = engine.getPrompt(P2);
    const moveIds = prompt.availableMoves.map((move) => move.moveId);
    const incitedUnitId = engine.findCardId(welcomeToNightCityRetailRidingNomad, "field", P2);
    const directAttack = prompt.availableMoves.find((move) => move.moveId === "attackRival");

    expect(moveIds).not.toContain("passPhase");
    expect(directAttack).toMatchObject({ inputSpec: { type: "selectCard" } });
    if (directAttack?.inputSpec.type === "selectCard") {
      expect(directAttack.inputSpec.candidates).toContain(incitedUnitId);
    }

    const failure = engine.expectFailure(() => engine.passPhase({ as: P2 }));
    expect(failure.errorCode).toBe("MUST_ATTACK");
  });

  it("lets the rival pass if the incited Unit can't attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailMoxInciters],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    engine.skipToNextPlayerTurn(P1);

    expect(engine.completeTurn({ as: P2 })).toMatchObject({ success: true });
  });

  it("does not break when there is no rival Unit to incite", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailMoxInciters],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailMoxInciters, { as: P1 });
    engine.expectNoPendingChoice();
    engine.skipToNextPlayerTurn(P1);

    expect(engine.completeTurn({ as: P2 })).toMatchObject({ success: true });
  });
});
