// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, expect, test, vi } from "vite-plus/test";
import type { InteractionInput } from "@tcg/protocol";
import { ContextualChoiceControl } from "./ContextualChoiceControl";

beforeAll(() => {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});
afterEach(cleanup);
const names = ["Haven", "Denver", "Sonoro", "Magnate", "Clarity", "Machina", "Torque", "Conquest"];
function options(labels = names): Extract<InteractionInput, { kind: "option-selection" }> {
  return {
    id: "selection",
    kind: "option-selection",
    text: { key: "Choose a name" },
    min: 1,
    max: 1,
    required: true,
    options: labels.map((name, index) => ({
      id: `native-${index}`,
      text: { key: name },
      enabled: index !== 7,
      ...(index === 7 ? { disabledText: { key: "This choice is not available" } } : {}),
    })),
  };
}
test("long names filter without changing native IDs; no results can be recovered", () => {
  const choose = vi.fn();
  render(
    <ContextualChoiceControl
      input={options()}
      cards={new Map()}
      locked={false}
      onChoose={choose}
    />,
  );
  const search = screen.getByRole("searchbox");
  fireEvent.change(search, { target: { value: "missing" } });
  expect(screen.getByText(/No matching choices/)).toBeTruthy();
  expect(choose).not.toHaveBeenCalled();
  fireEvent.change(search, { target: { value: "  DENv  " } });
  expect(screen.getByText("1 of 8 choices")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Denver" }));
  expect(choose).toHaveBeenCalledExactlyOnceWith(["native-1"]);
});
test("disabled and locked choices cannot submit; five colors need no search", () => {
  const choose = vi.fn();
  const { rerender } = render(
    <ContextualChoiceControl
      input={options()}
      cards={new Map()}
      locked={false}
      onChoose={choose}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Conquest" }));
  expect(screen.getByText("This choice is not available")).toBeTruthy();
  rerender(
    <ContextualChoiceControl
      input={options(["White", "Blue", "Black", "Red", "Green"])}
      cards={new Map()}
      locked
      onChoose={choose}
    />,
  );
  expect(screen.queryByRole("searchbox")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "White" }));
  expect(choose).not.toHaveBeenCalled();
});
test("search preserves card previews and preview does not answer", () => {
  const choose = vi.fn();
  const input = options();
  input.options[0] = { ...input.options[0], entity: { kind: "card", instanceId: "haven" } };
  render(
    <MantineProvider>
      <ContextualChoiceControl
        input={input}
        cards={new Map([["haven", { id: "haven", label: "Haven" }]])}
        locked={false}
        onChoose={choose}
      />
    </MantineProvider>,
  );
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Haven" } });
  fireEvent.click(screen.getByRole("button", { name: "Preview Haven" }));
  expect(choose).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Choose Haven" }));
  expect(choose).toHaveBeenCalledExactlyOnceWith(["native-0"]);
});
