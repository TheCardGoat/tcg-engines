import { describe, expect, it } from "vite-plus/test";

import { createCardNamePattern } from "../CardLinkedText.tsx";

describe("createCardNamePattern", () => {
  it("matches complete card names without linking substrings in larger words", () => {
    const pattern = createCardNamePattern(["Rush", "Gyan"]);

    expect(pattern).not.toBeNull();
    expect("Rush attacked Gyan.".match(pattern!)).toEqual(["Rush", "Gyan"]);
    expect("Rushed past a Gyanam.".match(pattern!)).toBeNull();
  });
});
