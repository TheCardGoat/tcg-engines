// @vitest-environment jsdom
import { webcrypto } from "node:crypto";
import { MantineProvider } from "@mantine/core";
import { cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FabPresentationCatalogProvider } from "./FabPresentationCatalog";
import { testPresentationEnvelope } from "./presentation-test-provider";
import { FabAutomationSettingsProvider } from "./fab-automation-settings";
import { FabHistoryFixture } from "./FabHistory.fixture";
import { FabMatchClockFixture } from "./FabMatchClock.fixture";
import { MemoryRouter } from "react-router-dom";
import FabHostedControlsFixture from "../../routes/fab-hosted-controls";
import FabSidebarPreview from "../../routes/fab-sidebar-preview";

beforeEach(() => {
  vi.stubGlobal("crypto", webcrypto);
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {} }),
  );
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it.each([
  ["history-reading", FabHistoryFixture],
  ["match-clocks", FabMatchClockFixture],
  ["hosted-controls", FabHostedControlsFixture],
  ["hosted-controls?attack=required-equipment", FabHostedControlsFixture],
  ["hosted-controls?phase=opening", FabHostedControlsFixture],
  ["sidebar-preview", FabSidebarPreview],
] as const)("%s loads board images from an empty presentation scope", async (_name, Fixture) => {
  const view = render(
    <MemoryRouter initialEntries={[`/flesh-and-blood/simulator/tests/${_name}`]}>
      <MantineProvider>
        <FabPresentationCatalogProvider initial={testPresentationEnvelope}>
          <FabAutomationSettingsProvider>
            <Fixture />
          </FabAutomationSettingsProvider>
        </FabPresentationCatalogProvider>
      </MantineProvider>
    </MemoryRouter>,
  );
  await waitFor(() => {
    expect(view.container.querySelectorAll('img[src*="/assets/board/"]').length).toBeGreaterThan(0);
    expect(view.container.textContent).not.toMatch(/image unavailable/i);
  });
});

it("exposes shell hydration and presentation readiness separately from card image readiness", async () => {
  const view = render(
    <MemoryRouter initialEntries={["/flesh-and-blood/simulator/tests/sidebar-preview"]}>
      <MantineProvider>
        <FabPresentationCatalogProvider initial={testPresentationEnvelope}>
          <FabAutomationSettingsProvider>
            <FabSidebarPreview />
          </FabAutomationSettingsProvider>
        </FabPresentationCatalogProvider>
      </MantineProvider>
    </MemoryRouter>,
  );

  await waitFor(() => {
    const root = view.container.querySelector(".fab-simulator-root");
    expect(root?.getAttribute("data-fab-hydrated")).toBe("true");
    expect(root?.getAttribute("data-fab-presentation-state")).toBe("ready");
  });
});
