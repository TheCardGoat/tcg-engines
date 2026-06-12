import { describe, expect, it } from "bun:test";
import { theFirebirdForceOfDestruction } from "./056-the-firebird-force-of-destruction";

describe("The Firebird - Force of Destruction", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(theFirebirdForceOfDestruction.vanilla).toBe(true);
    expect(theFirebirdForceOfDestruction.abilities).toBeUndefined();
  });
});
