import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { render } from "@testing-library/react";
import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import type { ReactNode } from "react";

import { CardPreviewProvider } from "../components/CardPreview/CardPreviewContext";
import { CardInspectProvider } from "../components/GameBoard/CardInspectContext";
import { UserConfigProvider, type ScenarioId, type Side } from "../engine";
import { BoardSharedPage, type BoardSharedPageProps } from "../pages/BoardShared.page";
import { theme } from "../theme";
import { CyberpunkSimulatorPom } from "./cyberpunk-simulator-pom";
import { WindowCyberpunkHarnessClient } from "./window-cyberpunk-harness-client";

export interface RenderCyberpunkSimulatorOptions {
  readonly scenarioId: ScenarioId;
  readonly initialHumanSide?: Side;
  readonly layout?: "desktop" | "mobile";
  readonly boardProps?: Partial<BoardSharedPageProps>;
}

export function renderCyberpunkSimulatorScenario({
  scenarioId,
  initialHumanSide,
  layout = "desktop",
  boardProps,
}: RenderCyberpunkSimulatorOptions): ReturnType<typeof render> {
  // The shared MobileShell hides the InteractionPanel behind a tab in mobile
  // layout. jsdom defaults to a narrow viewport, so force a desktop width so
  // the panel is in the DOM and the POM can drive actions through it.
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;
  const originalMatchMedia = window.matchMedia;
  window.innerWidth = layout === "mobile" ? 390 : 1440;
  if (layout === "mobile") {
    window.innerHeight = 844;
    window.matchMedia = createLayoutMatchMedia();
  }
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
        {...boardProps}
        scenarioId={scenarioId}
        initialAi={{ player: null, opponent: null }}
        initialHumanSide={initialHumanSide}
        initialAiMode="step"
        autoResolveSingletonCardTargets={false}
      />
    </UserConfigProvider>,
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MantineProvider theme={theme} env="test">
          <Notifications position="top-right" />
          <CardInspectProvider>
            <CardPreviewProvider>{children}</CardPreviewProvider>
          </CardInspectProvider>
        </MantineProvider>
      ),
    },
  );

  const originalUnmount = view.unmount.bind(view);
  view.unmount = () => {
    originalUnmount();
    window.innerWidth = originalInnerWidth;
    if (layout === "mobile") {
      window.innerHeight = originalInnerHeight;
      window.matchMedia = originalMatchMedia;
    }
    window.dispatchEvent(new Event("resize"));
    delete win.__cyberpunkEngine;
    delete win.__cyberpunkSimulator;
  };

  return view;
}

function createLayoutMatchMedia(): typeof window.matchMedia {
  return ((query: string): MediaQueryList => {
    const maxWidth = /max-width:\s*(\d+(?:\.\d+)?)px/.exec(query)?.[1];
    const minWidth = /min-width:\s*(\d+(?:\.\d+)?)px/.exec(query)?.[1];
    const maxHeight = /max-height:\s*(\d+(?:\.\d+)?)px/.exec(query)?.[1];
    const minHeight = /min-height:\s*(\d+(?:\.\d+)?)px/.exec(query)?.[1];
    const width = 390;
    const height = 844;
    let matches = false;
    if (maxWidth || minWidth || maxHeight || minHeight) {
      matches =
        (maxWidth ? width <= Number(maxWidth) : true) &&
        (minWidth ? width >= Number(minWidth) : true) &&
        (maxHeight ? height <= Number(maxHeight) : true) &&
        (minHeight ? height >= Number(minHeight) : true);
    } else if (query.includes("orientation: portrait")) {
      matches = true;
    } else if (query.includes("orientation: landscape")) {
      matches = false;
    }
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    } as MediaQueryList;
  }) as typeof window.matchMedia;
}

export function createTestingLibraryCyberpunkSimulatorPom(
  container: HTMLElement,
): CyberpunkSimulatorPom<WindowCyberpunkHarnessClient> {
  return new CyberpunkSimulatorPom(
    new TestingLibraryDomDriver(container),
    new WindowCyberpunkHarnessClient(),
  );
}
