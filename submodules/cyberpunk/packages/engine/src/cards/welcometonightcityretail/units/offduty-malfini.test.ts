import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailOffdutyMalfini,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Offduty Malfini (retail)", () => {
  it("PLAY trigger spends this Unit and a rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailOffdutyMalfini],
        eddies: 6,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false, playedThisTurn: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });

    // Self-spend happens immediately; the rival target selection suspends.
    expect(engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1).meta.spent).toBe(
      true,
    );

    // Choose the rival unit to spend.
    expect(
      engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 }),
    ).toMatchObject({
      success: true,
    });
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
  });

  it("PLAY trigger fizzles gracefully when no rival Unit is on the field", () => {
    // Selection `min: 1` against rival units with no eligible targets → the
    // engine skips the ability (no-op log), Malfini still enters the field,
    // no pending choice, no error.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailOffdutyMalfini],
        eddies: 6,
      },
      {
        // No rival field → no rival Unit to target.
      },
    );

    expect(engine.playCard(welcomeToNightCityRetailOffdutyMalfini, { as: P1 })).toMatchObject({
      success: true,
    });

    // Malfini entered the field unsold — neither the self-spend nor the
    // (impossible) rival-spend fired because the whole trigger fizzled.
    const malfini = engine.getCard(welcomeToNightCityRetailOffdutyMalfini, "field", P1);
    expect(malfini.meta.spent).toBe(false);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
  });
});
