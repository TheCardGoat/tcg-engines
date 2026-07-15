import { describe, expect, it } from "bun:test";
import { theQueenHatefulRival } from "./057-the-queen-hateful-rival";

describe("The Queen - Hateful Rival", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(theQueenHatefulRival.vanilla).toBe(true);
    expect(theQueenHatefulRival.abilities).toBeUndefined();
  });
});
