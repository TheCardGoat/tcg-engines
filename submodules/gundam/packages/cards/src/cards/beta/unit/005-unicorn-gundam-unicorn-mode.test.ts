import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, createMockUnit } from "@tcg/gundam-engine";
import { betaUnicornGundamUnicornMode005 } from "./005-unicorn-gundam-unicorn-mode.ts";

describe("Unicorn Gundam (Unicorn Mode) (GD01-005)", () => {
  // Card data encodes only the `discard 1` directive for this effect
  // (the printed "return paired pilot" clause is not structured yet —
  // sibling card-data agent owns that expansion). The effect is a
  // `destroyed` trigger gated by `duringPair`.
  it("【During Pair】【Destroyed】 discards 1 when destroyed while paired", () => {
    const filler = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [betaUnicornGundamUnicornMode005], hand: [filler] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unicornId = p1.getCardsInZone("battleArea")[0]!;

    // Pair a pilot without satisfying any linkCondition (duringPair only
    // requires *something* paired, not a link match).
    // biome-ignore lint/suspicious/noExplicitAny: test-only access
    (engine.getG() as any).pilotAssignments[unicornId] = `pilot-for-${unicornId}`;

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    engine.destroyUnit(unicornId);

    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore - 1);
  });

  it("does NOT discard when destroyed while unpaired", () => {
    const filler = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [betaUnicornGundamUnicornMode005], hand: [filler] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unicornId = p1.getCardsInZone("battleArea")[0]!;

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    engine.destroyUnit(unicornId);

    // duringPair gate fails → discard not enqueued.
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore);
  });
});
