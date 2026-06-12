import { describe, expect, it } from "bun:test";
import { faLiMulansMother } from "./143-fa-li-mulans-mother";

describe("Fa Li - Mulan's Mother", () => {
  it("is a vanilla character with the printed stats and no abilities", () => {
    expect(faLiMulansMother.vanilla).toBe(true);
    expect(faLiMulansMother.abilities).toBeUndefined();
    expect(faLiMulansMother.classifications).toEqual(["Storyborn", "Mentor"]);
    expect(faLiMulansMother.cost).toBe(1);
    expect(faLiMulansMother.strength).toBe(1);
    expect(faLiMulansMother.willpower).toBe(3);
    expect(faLiMulansMother.lore).toBe(1);
    expect(faLiMulansMother.inkable).toBe(true);
  });
});
