// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import App from "../App.tsx";
import { installBrowserShims } from "../testing/browser-shims.ts";

describe("multi-game index routing", () => {
  beforeEach(() => {
    installBrowserShims();
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    cleanup();
    window.history.pushState({}, "", "/");
  });

  it("uses the real visual fixture index as the One Piece game index", async () => {
    window.history.pushState({}, "", "/one-piece");

    render(<App initialPath="/one-piece" />);

    await waitFor(() => expect(window.location.pathname).toBe("/one-piece/simulator/tests"));
  });

  it("redirects trailing-slash game indexes to the visual fixture index", async () => {
    window.history.pushState({}, "", "/one-piece/");
    const replaceState = vi.spyOn(window.history, "replaceState");

    render(<App initialPath="/one-piece/" />);

    await waitFor(() => expect(window.location.pathname).toBe("/one-piece/simulator/tests"));
    expect(replaceState).toHaveBeenCalledWith({}, "", "/one-piece/simulator/tests");
  });

  it("uses the real visual fixture index as the Cyberpunk game index", async () => {
    window.history.pushState({}, "", "/cyberpunk");

    render(<App initialPath="/cyberpunk" />);

    await waitFor(() => expect(window.location.pathname).toBe("/cyberpunk/simulator/tests"));
  });

  it("navigates from the index Cyberpunk row with a real link href", async () => {
    render(<App initialPath="/" />);

    const fixtureHubs = screen.getByRole("region", { name: "Fixture hubs" });
    const cyberpunkLink = within(fixtureHubs).getByRole("link", { name: /Cyberpunk/ });
    expect(cyberpunkLink.getAttribute("href")).toBe("/cyberpunk/simulator/tests");

    fireEvent.click(cyberpunkLink);

    await waitFor(() => expect(window.location.pathname).toBe("/cyberpunk/simulator/tests"));
  });

  it("uses the mounted Gundam simulator hub as the Gundam game index", async () => {
    window.history.pushState({}, "", "/gundam");

    render(<App initialPath="/gundam" />);

    await waitFor(() => expect(window.location.pathname).toBe("/gundam/simulator"));
  });

  it("does not expose a fake Lorcana game fixture route", async () => {
    window.history.pushState({}, "", "/lorcana");

    render(<App initialPath="/lorcana" />);

    expect(await screen.findByText("Page not found")).not.toBeNull();
    expect(screen.queryByText("Lorcana ordering prompt")).toBeNull();
  });
});
