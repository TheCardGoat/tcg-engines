// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { cleanup, screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { loadSetupDefault } from "../../game/fixtures/setup-default.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    value: width,
    configurable: true,
    writable: true,
  });
  window.dispatchEvent(new Event("resize"));
}

afterEach(() => {
  cleanup();
  setViewportWidth(1024);
});

describe("Mobile top rail · match panel", () => {
  it("opens the full match sidebar drawer with the game log", async () => {
    setViewportWidth(390);
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    await user.click(await screen.findByRole("button", { name: /i go first/i }));
    await user.click(await screen.findByRole("button", { name: /open match activity/i }));

    const drawer = await screen.findByRole("dialog", {
      name: /gundam activity and utilities/i,
    });
    const log = within(drawer).getByRole("log", { name: /comms log/i });

    expect(within(log).getByText(/you chose to go first/i)).not.toBeNull();
    await user.click(within(drawer).getByRole("tab", { name: /more/i }));
    expect(within(drawer).getByRole("slider", { name: /sound volume/i })).not.toBeNull();
    expect(within(drawer).getByRole("button", { name: /^close$/i })).not.toBeNull();
  });
});
