import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, markAsLinkUnit, createMockUnit } from "@tcg/gundam-engine";
import { gd01UnicornGundamUnicornMode005 } from "./005-unicorn-gundam-unicorn-mode.ts";

describe("Unicorn Gundam (Unicorn Mode) (GD01-005)", () => {
  // Card data encodes only the `discard 1` directive for this effect
  // (the printed "return paired pilot" clause is not structured yet).
  // The effect is a destroyed trigger gated by duringLink, so it fires on
  // unitDestroyed when the continuous duringLink condition holds.
  it("【During Link】【Destroyed】 discards 1 when destroyed as a Link Unit", () => {
    // Give P1 a separate card in hand — destroyed trigger needs
    // something discardable to verify the discard fired. Using a
    // non-Unicorn unit card makes the assertion unambiguous.
    const filler = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [gd01UnicornGundamUnicornMode005], hand: [filler] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unicornId = p1.getCardsInZone("battleArea")[0]!;

    markAsLinkUnit(engine, unicornId);

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });
    const trashBefore = engine.getCardCount({
      zone: "trash",
      playerId: PLAYER_ONE,
    });

    engine.destroyUnit(unicornId);

    // Hand lost 1 card (discard fired); trash gained the filler +
    // the destroyed Unicorn → +2 net, compared to +1 without the
    // trigger.
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore - 1);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(trashBefore + 2);
  });

  it("does NOT discard when destroyed while not a Link Unit", () => {
    // Unpaired → duringLink gate fails at enqueue time → discard does
    // not fire.
    const filler = createMockUnit({ ap: 1, hp: 1 });
    const engine = GundamTestEngine.create(
      { play: [gd01UnicornGundamUnicornMode005], hand: [filler] },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unicornId = p1.getCardsInZone("battleArea")[0]!;

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    engine.destroyUnit(unicornId);

    // Discard didn't fire → hand unchanged.
    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore);
  });
});
