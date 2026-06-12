import { describe, expect, it } from "bun:test";

import { CANONICAL_PLAYER_ONE, CANONICAL_PLAYER_TWO, SPECTATOR_PLAYER_ID } from "./index";

describe("testing constants", () => {
  it("exports stable shared player ids", () => {
    expect(CANONICAL_PLAYER_ONE).toBe("player_one");
    expect(CANONICAL_PLAYER_TWO).toBe("player_two");
    expect(SPECTATOR_PLAYER_ID).toBe("spectator");
  });
});
