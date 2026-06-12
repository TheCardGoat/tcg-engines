import { MantineProvider } from "@mantine/core";
import { render } from "@testing-library/react";
import { TestingLibraryDomDriver } from "@tcg/simulator-testing/testing-library";
import type { ReactNode } from "react";

import { CardInspectProvider, DragDropProvider } from "../components/GameBoard";
import { CardPreviewProvider } from "../components/GameBoard/CardPreviewContext";
import { UserConfigProvider, type ScenarioId } from "../engine";
import { BoardPage } from "../pages/Board.page";
import { theme } from "../theme";
import { CyberpunkSimulatorPom } from "./cyberpunk-simulator-pom";
import { WindowCyberpunkHarnessClient } from "./window-cyberpunk-harness-client";

export interface RenderCyberpunkSimulatorOptions {
  readonly scenarioId: ScenarioId;
}

export function renderCyberpunkSimulatorScenario({
  scenarioId,
}: RenderCyberpunkSimulatorOptions): ReturnType<typeof render> {
  return render(
    <UserConfigProvider>
      <CardPreviewProvider>
        <CardInspectProvider>
          <DragDropProvider>
            <BoardPage
              scenarioId={scenarioId}
              initialAi={{ player: null, opponent: null }}
              initialAiMode="step"
              autoResolveSingletonCardTargets={false}
              autoAdvanceAttackFlow={false}
            />
          </DragDropProvider>
        </CardInspectProvider>
      </CardPreviewProvider>
    </UserConfigProvider>,
    {
      wrapper: ({ children }: { children: ReactNode }) => (
        <MantineProvider theme={theme} env="test">
          {children}
        </MantineProvider>
      ),
    },
  );
}

export function createTestingLibraryCyberpunkSimulatorPom(
  container: HTMLElement,
): CyberpunkSimulatorPom {
  return new CyberpunkSimulatorPom(
    new TestingLibraryDomDriver(container),
    new WindowCyberpunkHarnessClient(),
  );
}
