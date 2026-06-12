import { act } from "@testing-library/react";

import type {
  CyberpunkEngineHandle,
  CyberpunkHarnessClient,
  CyberpunkSide,
} from "./cyberpunk-simulator-pom";
import type { EngineAction } from "../types/e2e";

export class WindowCyberpunkHarnessClient implements CyberpunkHarnessClient {
  async waitForReady(): Promise<void> {
    const deadline = Date.now() + 5_000;
    while (Date.now() <= deadline) {
      if (this.hasHarness()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error("Timed out waiting for window.__cyberpunkSimulator.");
  }

  async getHumanSide(): Promise<CyberpunkSide> {
    return this.getSimulator().getHumanSide();
  }

  async setHumanSide(side: CyberpunkSide): Promise<void> {
    await act(async () => {
      this.getSimulator().setHumanSide(side);
    });
  }

  async getDispatchLog(): Promise<ReadonlyArray<{ action: EngineAction; result: unknown }>> {
    return this.getSimulator().getDispatchLog();
  }

  async clearDispatchLog(): Promise<void> {
    this.getSimulator().clearDispatchLog();
  }

  async evalEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  async evalEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg: A) => T, arg: A): Promise<T>;
  async evalEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg?: A) => T, arg?: A): Promise<T> {
    return fn(this.getEngine(), arg);
  }

  async dispatchEngine<T>(fn: (engine: CyberpunkEngineHandle) => T): Promise<T>;
  async dispatchEngine<T, A>(fn: (engine: CyberpunkEngineHandle, arg: A) => T, arg: A): Promise<T>;
  async dispatchEngine<T, A>(
    fn: (engine: CyberpunkEngineHandle, arg?: A) => T,
    arg?: A,
  ): Promise<T> {
    let result: T | undefined;
    await act(async () => {
      result = fn(this.getEngine(), arg);
      this.getSimulator().forceRender();
    });
    if (result === undefined) {
      return undefined as T;
    }
    return result;
  }

  private hasHarness(): boolean {
    const win = window as unknown as CyberpunkHarnessWindow;
    return Boolean(win.__cyberpunkSimulator?.engine ?? win.__cyberpunkEngine);
  }

  private getEngine(): CyberpunkEngineHandle {
    const win = window as unknown as CyberpunkHarnessWindow;
    const engine = win.__cyberpunkSimulator?.engine ?? win.__cyberpunkEngine;
    if (!engine) {
      throw new Error("window.__cyberpunkEngine is unavailable.");
    }
    return engine as CyberpunkEngineHandle;
  }

  private getSimulator(): CyberpunkSimulatorBridge {
    const sim = (window as unknown as CyberpunkHarnessWindow).__cyberpunkSimulator;
    if (!sim) {
      throw new Error("window.__cyberpunkSimulator is unavailable.");
    }
    return sim;
  }
}

interface CyberpunkHarnessWindow {
  __cyberpunkEngine?: unknown;
  __cyberpunkSimulator?: CyberpunkSimulatorBridge;
}

interface CyberpunkSimulatorBridge {
  engine: unknown;
  forceRender: () => void;
  getDispatchLog: () => ReadonlyArray<{ action: EngineAction; result: unknown }>;
  clearDispatchLog: () => void;
  getHumanSide: () => CyberpunkSide;
  setHumanSide: (side: CyberpunkSide) => void;
}
