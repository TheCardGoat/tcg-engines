import type { Page } from "@playwright/test";
import { PlaywrightDomDriver } from "@tcg/simulator-testing/playwright";

import {
  CyberpunkSimulatorPom,
  type CyberpunkHarnessClient,
  type CyberpunkSide,
} from "@cyberpunk/testing/cyberpunk-simulator-pom";
import type { EngineAction } from "@cyberpunk/types/e2e";
import type { CyberpunkE2EFixture } from "@cyberpunk/testing/e2e-fixtures";

export type { CyberpunkE2EFixture } from "@cyberpunk/testing/e2e-fixtures";

export interface CreatePlaywrightCyberpunkSimulatorPomOptions {
  readonly fixture?: CyberpunkE2EFixture;
  readonly skipReady?: boolean;
  readonly skipStructuralState?: boolean;
}

function isFixture(value: unknown): value is CyberpunkE2EFixture {
  return Boolean(
    value &&
    typeof value === "object" &&
    "scenarioId" in value &&
    typeof value.scenarioId === "string",
  );
}

export async function createPlaywrightCyberpunkSimulatorPom(
  page: Page,
  fixtureOrOptions?: CyberpunkE2EFixture | CreatePlaywrightCyberpunkSimulatorPomOptions,
): Promise<CyberpunkSimulatorPom> {
  const options: CreatePlaywrightCyberpunkSimulatorPomOptions = isFixture(fixtureOrOptions)
    ? { fixture: fixtureOrOptions }
    : (fixtureOrOptions ?? {});

  // Force a desktop viewport so the InteractionPanel is rendered inline
  // rather than hidden behind the mobile-shell tab.
  await page.setViewportSize({ width: 1440, height: 900 });

  if (options.fixture) {
    await page.goto(
      `/cyberpunk/simulator/tests/${options.fixture.scenarioId}?ai=off&auto-advance-attack=off`,
    );
  }

  const pom = new CyberpunkSimulatorPom(
    new PlaywrightDomDriver(page),
    new PlaywrightCyberpunkHarnessClient(page),
  );

  if (!options.skipReady) {
    await pom.waitForReady();
  }
  if (!options.skipStructuralState) {
    await pom.expectStructuralState();
  }

  return pom;
}

export class PlaywrightCyberpunkHarnessClient implements CyberpunkHarnessClient {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForFunction(() =>
      Boolean((window as unknown as CyberpunkHarnessWindow).__cyberpunkSimulator),
    );
  }

  getHumanSide(): Promise<CyberpunkSide> {
    return this.page.evaluate(() => {
      const sim = (window as unknown as CyberpunkHarnessWindow).__cyberpunkSimulator;
      if (!sim) {
        throw new Error("window.__cyberpunkSimulator is unavailable.");
      }
      return sim.getHumanSide();
    });
  }

  async setHumanSide(side: CyberpunkSide): Promise<void> {
    await this.page.evaluate((targetSide) => {
      const sim = (window as unknown as CyberpunkHarnessWindow).__cyberpunkSimulator;
      if (!sim) {
        throw new Error("window.__cyberpunkSimulator is unavailable.");
      }
      sim.setHumanSide(targetSide);
    }, side);
  }

  getDispatchLog(): Promise<ReadonlyArray<{ action: EngineAction; result: unknown }>> {
    return this.page.evaluate(() => {
      const sim = (window as unknown as CyberpunkHarnessWindow).__cyberpunkSimulator;
      if (!sim) {
        throw new Error("window.__cyberpunkSimulator is unavailable.");
      }
      return sim.getDispatchLog();
    });
  }

  async clearDispatchLog(): Promise<void> {
    await this.page.evaluate(() => {
      const sim = (window as unknown as CyberpunkHarnessWindow).__cyberpunkSimulator;
      sim?.clearDispatchLog();
    });
  }
}

interface CyberpunkHarnessWindow {
  __cyberpunkSimulator?: {
    forceRender: () => void;
    getDispatchLog: () => ReadonlyArray<{ action: EngineAction; result: unknown }>;
    clearDispatchLog: () => void;
    getHumanSide: () => CyberpunkSide;
    setHumanSide: (side: CyberpunkSide) => void;
  };
}
