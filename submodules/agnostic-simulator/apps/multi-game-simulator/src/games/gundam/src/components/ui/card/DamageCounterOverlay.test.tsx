// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";

import { DamageCounterOverlay } from "./DamageCounterOverlay.tsx";

describe("DamageCounterOverlay", () => {
  afterEach(cleanup);

  it("renders a counter stack with the current damage amount", () => {
    const { getByTestId } = render(<DamageCounterOverlay damage={3} scale={1} />);

    const overlay = getByTestId("damage-counter-overlay");
    expect(overlay.textContent).toBe("DMG3");
    expect(overlay.getAttribute("aria-label")).toBe("This card has taken 3 damage.");
  });

  it("does not render when damage is zero", () => {
    const { queryByTestId } = render(<DamageCounterOverlay damage={0} />);

    expect(queryByTestId("damage-counter-overlay")).toBeNull();
  });
});
