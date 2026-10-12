import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import type { EntityPartitionInput } from "@tcg/protocol";
import { OrderedCardGroups } from "./OrderedCardGroups";

afterEach(cleanup);
const input: EntityPartitionInput = {
  kind: "entity-partition",
  id: "order",
  required: true,
  text: { key: "Order" },
  entityKind: "card",
  assignment: "exhaustive",
  candidates: ["a", "b"].map((id) => ({
    entity: { kind: "card", instanceId: id },
    enabled: true,
    text: { key: id },
  })),
  routes: ["top", "bottom"].map((id) => ({
    id,
    kind: "destination",
    text: { key: id },
    min: 0,
    max: 2,
    ordered: true,
    orderDirection: "top-first",
  })),
};
function Harness({
  sound = vi.fn(),
  locked = false,
  restricted = false,
}: {
  sound?: () => void;
  locked?: boolean;
  restricted?: boolean;
}) {
  const [value, onChange] = useState<Record<string, string[]>>({});
  return (
    <>
      <OrderedCardGroups
        input={
          restricted
            ? {
                ...input,
                routes: input.routes.map((route) => ({
                  ...route,
                  candidateIds: route.id === "top" ? ["a"] : ["b"],
                })),
              }
            : input
        }
        value={value}
        cards={new Map()}
        locked={locked}
        reducedMotion
        onChange={onChange}
        onPlace={sound}
      />
      <output data-testid="value">{JSON.stringify(value)}</output>
    </>
  );
}
function place(card: string, group: string) {
  fireEvent.click(screen.getByRole("button", { name: `Pick up ${card}` }), { detail: 0 });
  fireEvent.click(screen.getByRole("button", { name: `Place in ${group}` }));
}
test("groups reorder, move between groups, cancel and retry with one cue per placement", () => {
  const sound = vi.fn();
  render(<Harness sound={sound} />);
  place("a", "top");
  expect(screen.getByText("1 card still needs a group.")).toBeTruthy();
  place("b", "top");
  expect(screen.getByText("Order updated. Confirm when ready.")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Move b earlier" }));
  expect(screen.getByTestId("value").textContent).toBe('{"top":["b","a"],"bottom":[]}');
  place("a", "bottom");
  expect(screen.getByTestId("value").textContent).toBe('{"top":["b"],"bottom":["a"]}');
  expect(sound).toHaveBeenCalledTimes(4);
  fireEvent.click(screen.getByRole("button", { name: "Cancel changes" }));
  expect(screen.getByTestId("value").textContent).toBe("{}");
  expect(
    within(screen.getByRole("region", { name: "Unplaced cards" })).getAllByRole("button", {
      name: /^Pick up /,
    }),
  ).toHaveLength(2);
  place("a", "bottom");
  expect(screen.getByTestId("value").textContent).toBe('{"top":[],"bottom":["a"]}');
});
test("rejects an illegal group without sound or mutation; Escape cancels pickup", () => {
  const sound = vi.fn();
  render(<Harness restricted sound={sound} />);
  place("a", "bottom");
  expect(screen.getByTestId("value").textContent).toBe("{}");
  expect(screen.getByText(/That placement is not permitted/)).toBeTruthy();
  expect(sound).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Pick up a" }), { detail: 0 });
  fireEvent.keyDown(window, { key: "Escape" });
  fireEvent.click(screen.getByRole("button", { name: "Place in top" }));
  expect(screen.getByTestId("value").textContent).toBe("{}");
  place("a", "top");
  expect(sound).toHaveBeenCalledTimes(1);
});
test("locked input prevents edits", () => {
  render(<Harness locked />);
  expect(screen.getByRole("button", { name: "Pick up a" }).hasAttribute("disabled")).toBe(true);
  expect(screen.getByRole("button", { name: "Place in top" }).hasAttribute("disabled")).toBe(true);
  expect(screen.getByRole("button", { name: "Place a in top" }).hasAttribute("disabled")).toBe(
    true,
  );
});

test("direct destinations place each card once and clear the picked-up card", () => {
  const sound = vi.fn();
  render(<Harness sound={sound} />);
  fireEvent.click(screen.getByRole("button", { name: "Pick up b" }), { detail: 0 });
  fireEvent.click(screen.getByRole("button", { name: "Place a in top" }));
  expect(screen.getByTestId("value").textContent).toBe('{"top":["a"],"bottom":[]}');
  // A quick placement releases any prior pickup, so an empty slot cannot move it.
  fireEvent.click(screen.getByRole("button", { name: "Place in bottom" }));
  expect(screen.getByTestId("value").textContent).toBe('{"top":["a"],"bottom":[]}');
  fireEvent.click(screen.getByRole("button", { name: "Place b in bottom" }));
  expect(screen.getByTestId("value").textContent).toBe('{"top":["a"],"bottom":["b"]}');
  expect(screen.getByText("Order updated. Confirm when ready.")).toBeTruthy();
  expect(sound).toHaveBeenCalledTimes(2);
});

test("direct controls respect destination restrictions", () => {
  const sound = vi.fn();
  render(<Harness restricted sound={sound} />);
  const invalid = screen.getByRole("button", { name: "Place a in bottom" });
  expect(invalid.hasAttribute("disabled")).toBe(true);
  fireEvent.click(invalid);
  expect(screen.getByTestId("value").textContent).toBe("{}");
  expect(sound).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Place a in top" }));
  expect(screen.getByTestId("value").textContent).toBe('{"top":["a"],"bottom":[]}');
});
