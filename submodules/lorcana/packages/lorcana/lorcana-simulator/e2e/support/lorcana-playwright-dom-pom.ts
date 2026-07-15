import type { Page } from "@playwright/test";
import { PlaywrightDomDriver } from "@tcg/simulator-testing/playwright";
import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";

import {
  LorcanaDomSimulatorPom,
  type LorcanaHarnessClient,
} from "../../src/testing/lorcana-simulator-pom.js";
import type {
  LorcanaBrowserHarnessConfig,
  LorcanaBrowserHarnessExecuteResult,
  LorcanaBrowserStatus,
} from "../../src/lib/features/simulator-devtools/harness/browser-harness.js";
import type { LorcanaSimulatorView } from "../../src/lib/features/simulator/model/contracts.js";

export function createPlaywrightLorcanaSimulatorPom(page: Page): LorcanaDomSimulatorPom {
  return new LorcanaDomSimulatorPom(
    new PlaywrightDomDriver(page),
    new PlaywrightLorcanaHarnessClient(page),
  );
}

export class PlaywrightLorcanaHarnessClient implements LorcanaHarnessClient {
  constructor(private readonly page: Page) {}

  async waitForReady(): Promise<void> {
    await this.page.waitForFunction(() =>
      Boolean((window as LorcanaHarnessWindow).__lorcanaTestHarness),
    );
  }

  getConfig(): Promise<LorcanaBrowserHarnessConfig> {
    return this.evaluateHarness((harness) => harness.getConfig());
  }

  reset(): Promise<void> {
    return this.evaluateHarness((harness) => harness.reset());
  }

  execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params: Record<string, unknown> = {},
  ): Promise<LorcanaBrowserHarnessExecuteResult> {
    return this.evaluateHarness(
      (harness, payload) => harness.execute(payload.view, payload.moveId, payload.params),
      { view, moveId, params },
    );
  }

  getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus> {
    return this.evaluateHarness((harness, targetView) => harness.getStatus(targetView), view);
  }

  getBoard(view: LorcanaSimulatorView): Promise<LorcanaProjectedBoardView> {
    return this.evaluateHarness((harness, targetView) => harness.getBoard(targetView), view);
  }

  private evaluateHarness<T>(fn: (harness: LorcanaHarnessBridge) => T): Promise<T>;
  private evaluateHarness<T, A>(
    fn: (harness: LorcanaHarnessBridge, arg: A) => T,
    arg: A,
  ): Promise<T>;
  private evaluateHarness<T, A>(
    fn: (harness: LorcanaHarnessBridge, arg?: A) => T,
    arg?: A,
  ): Promise<T> {
    return this.page.evaluate(
      (payload: { fnSrc: string; arg: unknown }) => {
        const harness = (window as LorcanaHarnessWindow).__lorcanaTestHarness;
        if (!harness) {
          throw new Error("window.__lorcanaTestHarness is unavailable.");
        }
        const reified = (0, eval)(`(${payload.fnSrc})`) as (
          harness: LorcanaHarnessBridge,
          arg: unknown,
        ) => unknown;
        return reified(harness, payload.arg);
      },
      { fnSrc: fn.toString(), arg },
    ) as Promise<T>;
  }
}

interface LorcanaHarnessWindow {
  __lorcanaTestHarness?: LorcanaHarnessBridge;
}

interface LorcanaHarnessBridge {
  getConfig(): LorcanaBrowserHarnessConfig;
  reset(): Promise<void>;
  execute(
    view: LorcanaSimulatorView,
    moveId: string,
    params?: Record<string, unknown>,
  ): Promise<LorcanaBrowserHarnessExecuteResult>;
  getStatus(view?: LorcanaSimulatorView): Promise<LorcanaBrowserStatus>;
  getBoard(view: LorcanaSimulatorView): Promise<LorcanaProjectedBoardView>;
}
