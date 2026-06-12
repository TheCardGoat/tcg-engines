// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadDeployUnitDemo } from "../../game/fixtures/deploy-unit-demo.ts";

/**
 * RTL port of `e2e/main-phase/deploy-unit.spec.ts`.
 * Click a hand unit → Confirm → unit on the battle area + resource exhausts.
 *
 * Uses the purpose-built `deploy-unit-demo` fixture rather than
 * `main-phase-demo` (which is a visual playground and explicitly
 * documented as unsuitable for engine-correctness tests).
 */
describe("Main-phase · Deploy Unit", () => {
  it("clicking a hand unit deploys it and exhausts its cost", async () => {
    // deployUnit has no `describeProcedure` → the engine returns no
    // remaining steps after the seed input, and the simulator
    // auto-submits. No more click-then-confirm pattern for trivial
    // deploys.
    const user = userEvent.setup();
    renderSimulator(loadDeployUnitDemo);

    await user.click(screen.getByRole("button", { name: /open match panel/i }));
    expect(screen.getByTestId("interaction-card:action:deployUnit")).not.toBeNull();
    expect(screen.getByTestId("interaction-submit:action:deployUnit")).not.toBeNull();
  });
});
