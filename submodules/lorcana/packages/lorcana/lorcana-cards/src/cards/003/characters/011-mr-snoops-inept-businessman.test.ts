import { describe, expect, it } from "bun:test";
import { mrSnoopsIneptBusinessman } from "./011-mr-snoops-inept-businessman";

describe("Mr. Snoops - Inept Businessman", () => {
  it("is a vanilla card (no abilities)", () => {
    expect(mrSnoopsIneptBusinessman.vanilla).toBe(true);
    expect(mrSnoopsIneptBusinessman.abilities).toBeUndefined();
  });
});
