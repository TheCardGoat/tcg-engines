import type {
  SimulatorAriaRole,
  SimulatorClickOptions,
  SimulatorDomDriver,
  SimulatorDomElement,
} from "./dom-driver";

export interface PlaywrightLocatorLike {
  locator(selector: string): PlaywrightLocatorLike;
  first(): PlaywrightLocatorLike;
  count(): Promise<number>;
  click(options?: { force?: boolean }): Promise<void>;
  getAttribute(name: string): Promise<string | null>;
  textContent(): Promise<string | null>;
  isVisible(): Promise<boolean>;
  waitFor(options?: { timeout?: number; state?: "attached" | "visible" }): Promise<void>;
}

export interface PlaywrightPageLike {
  locator(selector: string): PlaywrightLocatorLike;
  getByTestId(testId: string): PlaywrightLocatorLike;
  getByRole(role: SimulatorAriaRole, options?: { name?: string | RegExp }): PlaywrightLocatorLike;
  waitForTimeout(timeout: number): Promise<void>;
}

export class PlaywrightDomDriver implements SimulatorDomDriver {
  private readonly page: PlaywrightPageLike;

  constructor(page: PlaywrightPageLike) {
    this.page = page;
  }

  locator(selector: string): SimulatorDomElement {
    return new PlaywrightDomElement(this.page.locator(selector));
  }

  getByTestId(testId: string): SimulatorDomElement {
    return new PlaywrightDomElement(this.page.getByTestId(testId));
  }

  getByRole(
    role: SimulatorAriaRole,
    options: { name?: string | RegExp } = {},
  ): SimulatorDomElement {
    return new PlaywrightDomElement(this.page.getByRole(role, options));
  }

  async waitFor(
    predicate: () => boolean | Promise<boolean>,
    options: { timeoutMs?: number; message?: string } = {},
  ): Promise<void> {
    const timeoutMs = options.timeoutMs ?? 5_000;
    const deadline = Date.now() + timeoutMs;
    let lastError: unknown;

    while (Date.now() <= deadline) {
      try {
        if (await predicate()) {
          return;
        }
      } catch (error) {
        lastError = error;
      }
      await this.page.waitForTimeout(25);
    }

    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error(options.message ?? `Timed out after ${timeoutMs}ms.`);
  }
}

class PlaywrightDomElement implements SimulatorDomElement {
  private readonly locatorRef: PlaywrightLocatorLike;

  constructor(locatorRef: PlaywrightLocatorLike) {
    this.locatorRef = locatorRef;
  }

  locator(selector: string): SimulatorDomElement {
    return new PlaywrightDomElement(this.locatorRef.locator(selector));
  }

  first(): SimulatorDomElement {
    return new PlaywrightDomElement(this.locatorRef.first());
  }

  count(): Promise<number> {
    return this.locatorRef.count();
  }

  async click(options: SimulatorClickOptions = {}): Promise<void> {
    await this.locatorRef.click({ force: options.force });
  }

  getAttribute(name: string): Promise<string | null> {
    return this.locatorRef.getAttribute(name);
  }

  async textContent(): Promise<string> {
    return (await this.locatorRef.textContent()) ?? "";
  }

  isVisible(): Promise<boolean> {
    return this.locatorRef.isVisible();
  }

  async waitFor(
    options: { timeoutMs?: number; state?: "attached" | "visible" } = {},
  ): Promise<void> {
    await this.locatorRef.waitFor({
      timeout: options.timeoutMs,
      state: options.state ?? "visible",
    });
  }
}
