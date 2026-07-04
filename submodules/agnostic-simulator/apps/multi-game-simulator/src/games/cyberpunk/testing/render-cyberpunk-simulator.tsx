import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import type { ReactNode } from "react";

import { UserConfigProvider, type ScenarioId } from "../engine";
import { BoardSharedPage } from "../pages/BoardShared.page";
import { theme } from "../theme";
import { CyberpunkSimulatorPom } from "./cyberpunk-simulator-pom";
import { WindowCyberpunkHarnessClient } from "./window-cyberpunk-harness-client";

export interface RenderCyberpunkSimulatorOptions {
  readonly scenarioId: ScenarioId;
}

export function renderCyberpunkSimulatorScenario({
  scenarioId,
}: RenderCyberpunkSimulatorOptions): ReturnType<typeof render> {
  // The shared MobileShell hides the InteractionPanel behind a tab in mobile
  // layout. jsdom defaults to a narrow viewport, so force a desktop width so
  // the panel is in the DOM and the POM can drive actions through it.
  const originalInnerWidth = window.innerWidth;
  window.innerWidth = 1440;
  window.dispatchEvent(new Event("resize"));

  // Each scenario render owns the global test-harness bridge. Clear any stale
  // bridge from a previous render so waitForReady doesn't latch onto an old
  // EngineProvider instance.
  const win = window as unknown as {
    __cyberpunkEngine?: unknown;
    __cyberpunkSimulator?: unknown;
  };
  delete win.__cyberpunkEngine;
  delete win.__cyberpunkSimulator;

  const view = render(
    <UserConfigProvider>
      <BoardSharedPage
        scenarioId={scenarioId}
        initialAi={{ player: null, opponent: null }}
        initialAiMode="step"
        autoResolveSingletonCardTargets={false}
      />
    </UserConfigProvider>,
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MantineProvider theme={theme} env="test">
          {children}
        </MantineProvider>
      ),
    },
  );

  const originalUnmount = view.unmount.bind(view);
  view.unmount = () => {
    originalUnmount();
    window.innerWidth = originalInnerWidth;
    window.dispatchEvent(new Event("resize"));
    delete win.__cyberpunkEngine;
    delete win.__cyberpunkSimulator;
  };

  return view;
}

export function createTestingLibraryCyberpunkSimulatorPom(
  container: HTMLElement,
): CyberpunkSimulatorPom {
  return new CyberpunkSimulatorPom(
    new TestingLibraryDomDriver(container),
    new WindowCyberpunkHarnessClient(),
  );
}
