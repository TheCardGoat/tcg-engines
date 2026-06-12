import { describe, expect, it } from "bun:test";
import { plutoMickeysCleverFriend } from "./152-pluto-mickeys-clever-friend";

describe("Pluto - Mickey's Clever Friend", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(plutoMickeysCleverFriend.vanilla).toBe(true);
    expect(plutoMickeysCleverFriend.abilities).toBeUndefined();
  });
});
