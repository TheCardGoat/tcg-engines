import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, spoilerRidingNomad } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Riding Nomad", () => {
  it("can attack a spent rival unit the turn it is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerRidingNomad],
        eddies: 6,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(spoilerRidingNomad, { as: P1 });
    const result = engine.attackUnit(spoilerRidingNomad, alphaCorpoSecurity, { as: P1 });

    expect(result.success).toBe(true);
    expect(engine.getAttackState()?.defenderId).toBe(
      engine.findCardId(alphaCorpoSecurity, "field", P2),
    );
  });

  it("still cannot attack a ready rival unit while played this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerRidingNomad],
        eddies: 6,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(spoilerRidingNomad, { as: P1 });
    const failure = engine.expectFailure(() =>
      engine.attackUnit(spoilerRidingNomad, alphaCorpoSecurity, { as: P1 }),
    );

    expect(failure.errorCode).toBe("TARGET_READY");
  });
});
