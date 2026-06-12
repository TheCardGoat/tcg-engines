import type { Page } from "@playwright/test";
import { PlaywrightDomDriver } from "@tcg/simulator-testing/playwright";

import {
  CyberpunkSimulatorPom,
  type CyberpunkEngineHandle,
  type CyberpunkHarnessClient,
  type CyberpunkSide,
} from "../../src/games/cyberpunk/testing/cyberpunk-simulator-pom";
import type { EngineAction } from "../../src/games/cyberpunk/types/e2e";

export function createPlaywrightCyberpunkSimulatorPom(page: Page): CyberpunkSimulatorPom {
  return new CyberpunkSimulatorPom(
    new PlaywrightDomDriver(page),
    new PlaywrightCyberpunkHarnessClient(page),
  );
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

  evalEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  evalEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg: A) => T, arg: A): Promise<T>;
  evalEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg?: A) => T, arg?: A): Promise<T> {
    return this.page.evaluate(
      (payload: { fnSrc: string; arg: unknown }) => {
        const handle = (window as unknown as CyberpunkHarnessWindow).__cyberpunkEngine;
        if (!handle) {
          throw new Error("window.__cyberpunkEngine is unavailable.");
        }
        // Playwright serializes test functions across the browser boundary as source text.
        const reified = (0, eval)(`(${payload.fnSrc})`) as (engine: unknown, x: unknown) => unknown;
        return reified(handle, payload.arg);
      },
      { fnSrc: fn.toString(), arg },
    ) as Promise<T>;
  }

  async dispatchEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  async dispatchEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg: A) => T, arg: A): Promise<T>;
  async dispatchEngine<T, A>(
    fn: (engine: CyberpunkEngineHandle, arg?: A) => T,
    arg?: A,
  ): Promise<T> {
    const result = await this.evalEngine<T, A | undefined>(fn, arg);
    await this.page.evaluate(async () => {
      (window as unknown as CyberpunkHarnessWindow).__cyberpunkSimulator?.forceRender();
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });
    return result;
  }
}

interface CyberpunkHarnessWindow {
  __cyberpunkEngine?: unknown;
  __cyberpunkSimulator?: {
    forceRender: () => void;
    getDispatchLog: () => ReadonlyArray<{ action: EngineAction; result: unknown }>;
    clearDispatchLog: () => void;
    getHumanSide: () => CyberpunkSide;
    setHumanSide: (side: CyberpunkSide) => void;
  };
}
