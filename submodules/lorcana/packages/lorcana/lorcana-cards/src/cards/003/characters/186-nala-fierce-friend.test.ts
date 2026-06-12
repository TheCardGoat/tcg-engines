import { describe, expect, it } from "bun:test";
import { nalaFierceFriend } from "./186-nala-fierce-friend";

describe("Nala - Fierce Friend", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(nalaFierceFriend.vanilla).toBe(true);
    expect(nalaFierceFriend.abilities).toBeUndefined();
  });
});
