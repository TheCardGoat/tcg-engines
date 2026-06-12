export interface SimulatorClickOptions {
  force?: boolean;
}

export type SimulatorAriaRole =
  | "alert"
  | "alertdialog"
  | "application"
  | "article"
  | "banner"
  | "button"
  | "cell"
  | "checkbox"
  | "columnheader"
  | "combobox"
  | "complementary"
  | "contentinfo"
  | "definition"
  | "dialog"
  | "directory"
  | "document"
  | "feed"
  | "figure"
  | "form"
  | "grid"
  | "gridcell"
  | "group"
  | "heading"
  | "img"
  | "link"
  | "list"
  | "listbox"
  | "listitem"
  | "log"
  | "main"
  | "marquee"
  | "math"
  | "menu"
  | "menubar"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "navigation"
  | "none"
  | "note"
  | "option"
  | "presentation"
  | "progressbar"
  | "radio"
  | "radiogroup"
  | "region"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "search"
  | "searchbox"
  | "separator"
  | "slider"
  | "spinbutton"
  | "status"
  | "switch"
  | "tab"
  | "table"
  | "tablist"
  | "tabpanel"
  | "term"
  | "textbox"
  | "timer"
  | "toolbar"
  | "tooltip"
  | "tree"
  | "treegrid"
  | "treeitem";

export interface SimulatorDomElement {
  locator(selector: string): SimulatorDomElement;
  first(): SimulatorDomElement;
  count(): Promise<number>;
  click(options?: SimulatorClickOptions): Promise<void>;
  getAttribute(name: string): Promise<string | null>;
  textContent(): Promise<string>;
  isVisible(): Promise<boolean>;
  waitFor(options?: { timeoutMs?: number; state?: "attached" | "visible" }): Promise<void>;
}

export interface SimulatorDomDriver {
  locator(selector: string): SimulatorDomElement;
  getByTestId(testId: string): SimulatorDomElement;
  getByRole(role: SimulatorAriaRole, options?: { name?: string | RegExp }): SimulatorDomElement;
  waitFor(
    predicate: () => boolean | Promise<boolean>,
    options?: { timeoutMs?: number; message?: string },
  ): Promise<void>;
}

export function cssString(value: string): string {
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

export async function expectDomCount(
  element: SimulatorDomElement,
  expected: number,
  message?: string,
): Promise<void> {
  const count = await element.count();
  if (count !== expected) {
    throw new Error(message ?? `Expected ${expected} elements, found ${count}.`);
  }
}

export async function expectDomAttribute(
  element: SimulatorDomElement,
  name: string,
  expected: string,
): Promise<void> {
  const actual = await element.getAttribute(name);
  if (actual !== expected) {
    throw new Error(
      `Expected ${name}="${expected}", found ${actual === null ? "null" : `"${actual}"`}.`,
    );
  }
}
