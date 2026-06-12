// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { ShieldPips } from "./ShieldPips.tsx";

describe("ShieldPips", () => {
  afterEach(cleanup);

  it("renders damage counters on damaged shield pips without revealing identity", () => {
    const { getByTestId, getAllByRole } = render(
      <ShieldPips
        value={2}
        max={6}
        low={false}
        listLabel="Your shields"
        shields={[
          { id: "shield-1", name: "?", faceDown: true, damage: 2 },
          { id: "shield-2", name: "?", faceDown: true, damage: 0 },
        ]}
      />,
    );

    expect(getAllByRole("listitem")).toHaveLength(2);
    const overlay = getByTestId("damage-counter-overlay");
    expect(overlay.textContent).toBe("2");
    expect(overlay.getAttribute("aria-label")).toBe("This card has taken 2 damage.");
  });
});
