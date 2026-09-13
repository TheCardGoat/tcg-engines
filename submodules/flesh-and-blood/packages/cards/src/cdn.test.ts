import { describe, expect, it } from "vitest";

import { fabDefaultPrintingId } from "./cdn.ts";

describe("fabDefaultPrintingId", () => {
  const printings = [
    { id: "p-best", imageUrl: "https://cdn.tcg.online/public/fab/assets/full/best.webp" },
    { id: "p-next", imageUrl: "https://cdn.tcg.online/public/fab/assets/full/next.webp" },
  ];

  it("uses the source-quality order preserved by catalog normalization", () => {
    expect(fabDefaultPrintingId({ printings })).toBe("p-best");
  });

  it("chooses the first usable first-party printing", () => {
    expect(
      fabDefaultPrintingId({
        printings: [
          { id: "p-missing", imageUrl: "" },
          {
            id: "p-first",
            imageUrl: "https://cdn.tcg.online/public/fab/assets/full/first.webp",
          },
        ],
      }),
    ).toBe("p-first");
  });

  it("returns undefined when no printing has a usable image", () => {
    expect(fabDefaultPrintingId({ printings: [{ id: "p", imageUrl: "" }] })).toBeUndefined();
    expect(fabDefaultPrintingId({ printings: [] })).toBeUndefined();
  });
});
