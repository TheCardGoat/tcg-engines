import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vite-plus/test";
import { ResolutionFocusCard } from "@tcg/simulator-presentation/focus";
afterEach(cleanup);
test("scene-owned staging renders controls and caption without a second card", () => {
  const { container } = render(
    <ResolutionFocusCard caption="Standby" art="/card.webp" name="Card" sceneOwnsCard>
      <button>Pay</button>
    </ResolutionFocusCard>,
  );
  expect(container.querySelectorAll("img")).toHaveLength(0);
  expect(container.querySelector(".tcg-resolution-focus-fallback")).toBeNull();
  expect(screen.getByText("Standby")).toBeDefined();
  expect(screen.getByRole("button", { name: "Pay" })).toBeDefined();
});
test("other focus consumers still render their existing artwork", () => {
  const { container } = render(
    <ResolutionFocusCard caption="Resolving" art="/card.webp">
      <button>Confirm</button>
    </ResolutionFocusCard>,
  );
  expect(container.querySelectorAll("img")).toHaveLength(1);
});
