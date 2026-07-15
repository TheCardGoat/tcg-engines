import { describe, expect, it } from "bun:test";
import { createPlayerId } from "#core";
import {
  addTemporaryRestriction,
  hasTemporaryRestriction,
  resolveTemporaryEffectWindow,
} from "./temporary-effects";

const PLAYER_ONE = createPlayerId("p1");
const PLAYER_TWO = createPlayerId("p2");

describe("temporary-effects", () => {
  it("applies 'their-next-turn' on the target owner's next turn", () => {
    expect(
      resolveTemporaryEffectWindow(1, "their-next-turn", {
        currentPlayerId: PLAYER_ONE,
        targetOwnerId: PLAYER_ONE,
      }),
    ).toEqual({
      startsAtTurn: 3,
      expiresAtTurn: 3,
    });

    expect(
      resolveTemporaryEffectWindow(1, "their-next-turn", {
        currentPlayerId: PLAYER_ONE,
        targetOwnerId: PLAYER_TWO,
      }),
    ).toEqual({
      startsAtTurn: 2,
      expiresAtTurn: 2,
    });
  });

  it("treats cant-quest-or-challenge as both cant-quest and cant-challenge", () => {
    const meta = addTemporaryRestriction({}, "cant-quest-or-challenge", 2);

    expect(hasTemporaryRestriction(meta, 1, "cant-quest")).toBe(true);
    expect(hasTemporaryRestriction(meta, 1, "cant-challenge")).toBe(true);
    expect(hasTemporaryRestriction(meta, 1, "cant-quest-or-challenge")).toBe(true);
  });
});
