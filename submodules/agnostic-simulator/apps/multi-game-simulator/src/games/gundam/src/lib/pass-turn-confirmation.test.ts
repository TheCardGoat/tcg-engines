import { describe, expect, it } from "vite-plus/test";

import { hasOpenTurnActions } from "./pass-turn-confirmation.ts";

describe("hasOpenTurnActions", () => {
  it("detects an enabled gameplay move", () => {
    expect(
      hasOpenTurnActions([
        { id: "passTurn", enabled: true },
        { id: "deployUnit", enabled: true },
      ]),
    ).toBe(true);
  });

  it("ignores disabled moves and non-gameplay actions", () => {
    expect(
      hasOpenTurnActions([
        { id: "passTurn", enabled: true },
        { id: "passActionStep", enabled: true },
        { id: "concede", enabled: true },
        { id: "deployUnit", enabled: false },
      ]),
    ).toBe(false);
  });
});
