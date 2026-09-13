// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { WaitingForOpponentPrompt } from "./WaitingForOpponentPrompt.tsx";

describe("WaitingForOpponentPrompt", () => {
  it("centers against its positioned board container instead of the viewport", () => {
    render(
      <section data-sim-board>
        <WaitingForOpponentPrompt message="Waiting for opponent to decide their mulligan…" />
      </section>,
    );

    const waiting = screen.getByRole("status", { name: /waiting for opponent/i });
    expect(waiting.className).toContain("absolute");
    expect(waiting.className).not.toContain("fixed");
    expect(waiting.closest("[data-sim-board]")).not.toBeNull();
  });
});
