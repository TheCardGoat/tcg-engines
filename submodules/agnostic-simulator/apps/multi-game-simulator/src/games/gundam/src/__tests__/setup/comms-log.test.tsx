// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefault } from "../../game/fixtures/setup-default.ts";

/**
 * RTL port of `e2e/setup/comms-log.spec.ts`. The sidebar comms log is a
 * projection of the engine's game-log stream.
 */
describe("Sidebar · Comms log", () => {
  it("renders a log entry after the viewer chooses first player", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    await user.click(screen.getByRole("button", { name: /i go first/i }));

    // The full sidebar (host of the comms log) expands from the icon
    // rail's "Open match panel" button. Click to open before querying.
    await user.click(screen.getByRole("button", { name: /open match panel/i }));

    const log = await screen.findByRole("log", { name: /comms log/i });
    expect(within(log).getByText(/to go first/i)).not.toBeNull();
  });

  it("renders player ids as pretty names (You / Opponent), not raw engine ids", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    await user.click(screen.getByRole("button", { name: /i go first/i }));
    await user.click(screen.getByRole("button", { name: /open match panel/i }));

    const log = await screen.findByRole("log", { name: /comms log/i });
    expect(within(log).getByText(/you chose you to go first/i)).not.toBeNull();
    expect(log.textContent ?? "").not.toMatch(/player_one|player_two/i);
  });
});
