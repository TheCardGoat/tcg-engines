import { fireEvent, getByRole, queryAllByTestId, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type {
  SimulatorAriaRole,
  SimulatorClickOptions,
  SimulatorDomDriver,
  SimulatorDomElement,
} from "./dom-driver";

type ElementProvider = () => Element[];

export interface TestingLibraryDomDriverOptions {
  user?: ReturnType<typeof userEvent.setup>;
}

export class TestingLibraryDomDriver implements SimulatorDomDriver {
  readonly user: ReturnType<typeof userEvent.setup>;
  private readonly container: HTMLElement;

  constructor(container: HTMLElement, options: TestingLibraryDomDriverOptions = {}) {
    this.container = container;
    this.user = options.user ?? userEvent.setup();
  }

  locator(selector: string): SimulatorDomElement {
    return new TestingLibraryDomElement(
      () => Array.from(this.container.querySelectorAll(selector)),
      this.user,
    );
  }

  getByTestId(testId: string): SimulatorDomElement {
    return new TestingLibraryDomElement(() => queryAllByTestId(this.container, testId), this.user);
  }

  getByRole(
    role: SimulatorAriaRole,
    options: { name?: string | RegExp } = {},
  ): SimulatorDomElement {
    return new TestingLibraryDomElement(
      () => [getByRole(this.container, role, options)],
      this.user,
    );
  }

  async waitFor(
    predicate: () => boolean | Promise<boolean>,
    options: { timeoutMs?: number; message?: string } = {},
  ): Promise<void> {
    await waitFor(
      async () => {
        if (!(await predicate())) {
          throw new Error(options.message ?? "Predicate did not pass.");
        }
      },
      { timeout: options.timeoutMs },
    );
  }
}

class TestingLibraryDomElement implements SimulatorDomElement {
  private readonly elements: ElementProvider;
  private readonly user: ReturnType<typeof userEvent.setup>;

  constructor(elements: ElementProvider, user: ReturnType<typeof userEvent.setup>) {
    this.elements = elements;
    this.user = user;
  }

  locator(selector: string): SimulatorDomElement {
    return new TestingLibraryDomElement(
      () => this.elements().flatMap((element) => Array.from(element.querySelectorAll(selector))),
      this.user,
    );
  }

  first(): SimulatorDomElement {
    return new TestingLibraryDomElement(() => this.elements().slice(0, 1), this.user);
  }

  async count(): Promise<number> {
    return this.elements().length;
  }

  async click(options: SimulatorClickOptions = {}): Promise<void> {
    const element = this.firstElement();
    if (options.force) {
      fireEvent.click(element);
      return;
    }
    await this.user.click(element);
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.firstElement().getAttribute(name);
  }

  async textContent(): Promise<string> {
    return this.firstElement().textContent ?? "";
  }

  async isVisible(): Promise<boolean> {
    const element = this.firstElement();
    if (!element.isConnected || element.hidden) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden";
  }

  async waitFor(
    options: { timeoutMs?: number; state?: "attached" | "visible" } = {},
  ): Promise<void> {
    await waitFor(
      async () => {
        if ((await this.count()) === 0) {
          throw new Error("Element is not attached.");
        }
        if (options.state === "attached") {
          return;
        }
        if (!(await this.isVisible())) {
          throw new Error("Element is not visible.");
        }
      },
      { timeout: options.timeoutMs },
    );
  }

  private firstElement(): HTMLElement {
    const element = this.elements()[0];
    if (!element) {
      throw new Error("No matching DOM element.");
    }
    if (!(element instanceof HTMLElement)) {
      throw new Error("Matching DOM element is not an HTMLElement.");
    }
    return element;
  }
}
