import { describe, expect, it } from "vitest";
import type { InteractionInput } from "@tcg/protocol";
import { interactionValueMatches } from "./interaction-values.ts";

const candidates = ["a", "b", "c"].map((instanceId) => ({
  entity: { kind: "card" as const, instanceId },
  enabled: true,
}));
const selection = {
  id: "selection",
  kind: "entity-selection",
  role: "cost",
  entityKinds: ["card"],
  text: { key: "Choose cards" },
  min: 2,
  max: 3,
  ordered: false,
  candidates,
} satisfies InteractionInput;

describe("Grand Archive interaction value matching", () => {
  it.each([
    ["a", "b", "c"],
    ["a", "c", "b"],
    ["b", "a", "c"],
    ["b", "c", "a"],
    ["c", "a", "b"],
    ["c", "b", "a"],
  ])("matches the unordered permutation %s %s %s without mutating it", (...ids) => {
    const submitted = Object.freeze(ids);
    const expected = Object.freeze(["a", "b", "c"]);
    expect(interactionValueMatches(selection, submitted, expected)).toBe(true);
  });

  it.each([["a", "a"], ["a"], ["a", "c"], ["a", "b", "c"], ["a", 2]])(
    "does not turn a different selection into a legal payment: %j",
    (...ids) => {
      expect(interactionValueMatches(selection, ids, ["a", "b"])).toBe(false);
    },
  );

  it("matches mode choices without changing the order of explicitly ordered inputs", () => {
    const options: InteractionInput = {
      id: "modes",
      kind: "option-selection",
      text: { key: "Choose modes" },
      min: 2,
      max: 2,
      options: ["a", "b"].map((id) => ({ id, text: { key: id }, enabled: true })),
    };
    expect(interactionValueMatches(options, ["b", "a"], ["a", "b"])).toBe(true);
    expect(interactionValueMatches({ ...selection, ordered: true }, ["b", "a"], ["a", "b"])).toBe(
      false,
    );
    const ordering: InteractionInput = {
      id: "order",
      kind: "ordering",
      text: { key: "Order cards" },
      entityKind: "card",
      min: 2,
      max: 3,
      candidates,
    };
    expect(interactionValueMatches(ordering, ["b", "a"], ["a", "b"])).toBe(false);
    expect(interactionValueMatches(ordering, ["a", "b"], ["a", "b"])).toBe(true);
  });

  it("keeps partition destinations and ordered deck positions significant", () => {
    const partition: InteractionInput = {
      id: "partition",
      kind: "entity-partition",
      text: { key: "Separate cards" },
      entityKind: "card",
      candidateSetText: { key: "Cards" },
      candidates,
      assignment: "exhaustive",
      routes: [
        { id: "hand", text: { key: "Hand" }, kind: "destination", ordered: false, min: 0, max: 3 },
        { id: "deck", text: { key: "Deck" }, kind: "destination", ordered: true, min: 0, max: 3 },
      ],
    };
    expect(
      interactionValueMatches(
        partition,
        { hand: ["b", "a"], deck: ["c"] },
        { hand: ["a", "b"], deck: ["c"] },
      ),
    ).toBe(true);
    expect(
      interactionValueMatches(
        partition,
        { hand: ["c"], deck: ["b", "a"] },
        { hand: ["c"], deck: ["a", "b"] },
      ),
    ).toBe(false);
    expect(
      interactionValueMatches(
        partition,
        { hand: ["a"], deck: ["b", "c"] },
        { hand: ["b"], deck: ["a", "c"] },
      ),
    ).toBe(false);
  });
});
