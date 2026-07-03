import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, theHeistRetailStarterDeckMt0d12Flathead } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("MT0D12 Flathead (The Heist retail starter)", () => {
  it("can't be blocked while friendly Street Cred is less than a Rival's", () => {
    // P1 has 1 Street Cred (d4 faceValue 1). P2 has 7 (d8 faceValue 7).
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: theHeistRetailStarterDeckMt0d12Flathead, spent: false, playedThisTurn: false },
        ],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false, playedThisTurn: false }],
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
    );

    engine.attackRival(theHeistRetailStarterDeckMt0d12Flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    const failure = engine.expectFailure(() => engine.useBlocker(alphaCorpoSecurity, { as: P2 }));
    expect(failure.errorCode).toBe("CANT_BE_BLOCKED");
  });

  it("can be blocked when friendly Street Cred is not less than a Rival's", () => {
    // P1 has 7 Street Cred (d8 faceValue 7). P2 has 1 (d4 faceValue 1).
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: theHeistRetailStarterDeckMt0d12Flathead, spent: false, playedThisTurn: false },
        ],
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false, playedThisTurn: false }],
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(theHeistRetailStarterDeckMt0d12Flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.useBlocker(alphaCorpoSecurity, { as: P2 })).toMatchObject({ success: true });
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });

  it("can be blocked at the exact Street Cred tie (condition is strict `lt`)", () => {
    // P1 and P2 both have 5 Street Cred → "less than a Rival" is false at the
    // boundary, so BLOCKER is allowed. Proves the rule uses `<` not `<=`.
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: theHeistRetailStarterDeckMt0d12Flathead, spent: false, playedThisTurn: false },
        ],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false, playedThisTurn: false }],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
    );

    engine.attackRival(theHeistRetailStarterDeckMt0d12Flathead, { as: P1 });
    engine.resolveAttack({ as: P1 });

    expect(engine.useBlocker(alphaCorpoSecurity, { as: P2 })).toMatchObject({ success: true });
    expect(engine.getState().G.attackState?.kind).toBe("fight");
  });
});
