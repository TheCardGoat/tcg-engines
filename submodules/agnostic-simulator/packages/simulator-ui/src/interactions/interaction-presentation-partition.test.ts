import { expect, test } from "vite-plus/test";
import type { EntityPartitionInput } from "@tcg/protocol";
import { interactionInputComplete } from "./interaction-presentation";
const input: EntityPartitionInput = {
  kind: "entity-partition",
  id: "deckOrder",
  required: true,
  text: { key: "Order" },
  entityKind: "card",
  assignment: "exhaustive",
  candidates: ["a", "b"].map((instanceId) => ({
    entity: { kind: "card", instanceId },
    enabled: true,
  })),
  routes: ["top", "bottom"].map((id) => ({
    id,
    kind: "destination",
    ordered: true,
    text: { key: id },
    min: 0,
    max: 2,
  })),
};
test("exhaustive groups need every permitted card exactly once", () => {
  const invalid: Record<string, string[]>[] = [
    { top: ["a"], bottom: [] },
    { top: ["a"], bottom: ["a"] },
    { top: ["a"], bottom: ["unknown"] },
    { top: ["a"], elsewhere: ["b"] },
  ];
  for (const value of invalid) expect(interactionInputComplete(input, value)).toBe(false);
  expect(interactionInputComplete(input, { top: ["b", "a"], bottom: [] })).toBe(true);
  expect(interactionInputComplete(input, { bottom: ["a", "b"] })).toBe(true);
});
test("route eligibility and conditional minimums still apply", () => {
  expect(
    interactionInputComplete(
      {
        ...input,
        routes: input.routes.map((route) =>
          route.id === "top" ? { ...route, candidateIds: ["a"] } : route,
        ),
      },
      { top: ["b"], bottom: ["a"] },
    ),
  ).toBe(false);
  expect(
    interactionInputComplete(
      {
        ...input,
        routes: input.routes.map((route) =>
          route.id === "top" ? { ...route, minWhenRemainingAtLeast: { count: 2, min: 1 } } : route,
        ),
      },
      { top: [], bottom: ["a", "b"] },
    ),
  ).toBe(false);
  expect(
    interactionInputComplete(
      { ...input, assignment: "remainder-automatic", remainderText: { key: "Leave rest" } },
      {},
    ),
  ).toBe(true);
});
