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

describe("Mobile top rail · game log", () => {
  it("opens a dedicated log sheet instead of the full match sidebar", async () => {
    setViewportWidth(390);
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    await user.click(await screen.findByRole("button", { name: /i go first/i }));
    await user.click(await screen.findByRole("button", { name: /^comms log$/i }));

    const sheet = await screen.findByRole("dialog", { name: /game log/i });
    const log = within(sheet).getByRole("log", { name: /comms log/i });

    expect(within(log).getByText(/you chose you to go first/i)).not.toBeNull();
    expect(within(sheet).queryByRole("region", { name: /ai opponent controls/i })).toBeNull();
    expect(within(sheet).getByRole("button", { name: /close game log/i })).not.toBeNull();
  });
});
