import { renderToString } from "react-dom/server";
import { expect, test, vi } from "vitest";
import AlphaClashChoiceBoardFixture from "./AlphaClashChoiceBoardFixture";
import { boardChoiceCases } from "./choice-board-fixtures";

// Use the actual scene boundary: a direct request must work without browser globals.
for (const [kind] of boardChoiceCases) {
  test(`${kind} can render on a direct server request`, () => {
    // The app setup installs browser shims; remove window for the server render itself.
    vi.stubGlobal("window", undefined);
    try {
      const html = renderToString(<AlphaClashChoiceBoardFixture kind={kind} />);
      expect(html).toContain("REAL BOARD");
      expect(html).toContain("Reset fixture");
    } finally {
      vi.unstubAllGlobals();
    }
  });
}
