import { describe, expect, it } from "vitest";
import { printedIdentityKey } from "./printed-identity.ts";

describe("printedIdentityKey", () => {
  it("collapses pitch-color slugs of the same card name", () => {
    expect(printedIdentityKey(["snatch-red"], "snatch-red")).toBe("snatch");
    expect(printedIdentityKey(["snatch-yellow"], "snatch-yellow")).toBe("snatch");
    expect(printedIdentityKey(["Snatch"])).toBe("snatch");
  });
});
