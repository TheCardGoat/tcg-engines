import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import {
  assertNeverSlottedKind,
  flattenSlottedTargets,
  isSlotted,
  isSlottedTargetInput,
  slotKeysFor,
  SLOTTED_TARGET_KINDS,
  type SlottedTargetInput,
  type SlottedTargetKind,
} from "./slotted-targets";

/**
 * Type-level exhaustiveness harness. This file is compiled by `check-types`;
 * if a new `SlottedTargetInput` variant is added without updating the switch
 * below, the `default: assertNeverSlottedKind(input)` branch becomes reachable
 * with a non-`never` value and TypeScript errors out.
 */
function exhaustiveNarrowing(input: SlottedTargetInput): string {
  switch (input.kind) {
    case "move-damage":
      return `${input.from.length}:${input.to.length}`;
    case "move-to-location":
      return `${input.subject.length}:${input.location.length}`;
    case "shift-and-choose":
      return `${input.chosenCard.length}`;
    case "banish-and-play":
      return `${input.banish.length}:${input.play.length}`;
    default:
      return assertNeverSlottedKind(input);
  }
}

function mock(id: string): CardInstanceId {
  return id as CardInstanceId;
}

describe("slotted-targets", () => {
  it("isSlottedTargetInput rejects non-slotted values", () => {
    expect(isSlottedTargetInput(undefined)).toBe(false);
    expect(isSlottedTargetInput(null)).toBe(false);
    expect(isSlottedTargetInput("card-1")).toBe(false);
    expect(isSlottedTargetInput(["card-1", "card-2"])).toBe(false);
    expect(isSlottedTargetInput({ kind: "unknown", a: [] })).toBe(false);
    // kind-only stubs without slot arrays must be rejected (prevents runtime crashes in flattenSlottedTargets)
    expect(isSlottedTargetInput({ kind: "move-damage" })).toBe(false);
    expect(isSlottedTargetInput({ kind: "move-damage", from: [] })).toBe(false);
    expect(isSlottedTargetInput({ kind: "move-damage", from: "not-an-array", to: [] })).toBe(false);
  });

  it("isSlottedTargetInput accepts each known kind with valid slot arrays", () => {
    expect(isSlottedTargetInput({ kind: "move-damage", from: [], to: [] })).toBe(true);
    expect(isSlottedTargetInput({ kind: "move-to-location", subject: [], location: [] })).toBe(
      true,
    );
    expect(isSlottedTargetInput({ kind: "shift-and-choose", chosenCard: [] })).toBe(true);
    expect(isSlottedTargetInput({ kind: "banish-and-play", banish: [], play: [] })).toBe(true);
  });

  it("isSlotted narrows to the requested kind", () => {
    const input: SlottedTargetInput = {
      kind: "move-damage",
      from: [mock("a")],
      to: [mock("b")],
    };
    expect(isSlotted(input, "move-damage")).toBe(true);
    expect(isSlotted(input, "move-to-location")).toBe(false);
    if (isSlotted(input, "move-damage")) {
      // Type narrowing check: these keys should be accessible without assertion.
      expect(input.from[0]).toBe(mock("a"));
      expect(input.to[0]).toBe(mock("b"));
    }
  });

  it("flattenSlottedTargets concatenates slot arrays in declared order", () => {
    expect(
      flattenSlottedTargets({
        kind: "move-damage",
        from: [mock("a")],
        to: [mock("b")],
      }),
    ).toEqual([mock("a"), mock("b")]);

    expect(
      flattenSlottedTargets({
        kind: "banish-and-play",
        banish: [mock("x"), mock("y")],
        play: [mock("z")],
      }),
    ).toEqual([mock("x"), mock("y"), mock("z")]);
  });

  it("slotKeysFor returns the canonical key list", () => {
    expect(slotKeysFor("move-damage")).toEqual(["from", "to"]);
    expect(slotKeysFor("shift-and-choose")).toEqual(["chosenCard"]);
  });

  it("exhaustive narrowing covers every kind", () => {
    const samples: SlottedTargetInput[] = [
      { kind: "move-damage", from: [mock("a")], to: [mock("b")] },
      { kind: "move-to-location", subject: [mock("a")], location: [mock("b")] },
      { kind: "shift-and-choose", chosenCard: [mock("a")] },
      { kind: "banish-and-play", banish: [mock("a")], play: [mock("b")] },
    ];

    const covered = new Set<SlottedTargetKind>(samples.map((s) => s.kind));
    for (const kind of SLOTTED_TARGET_KINDS) {
      expect(covered.has(kind)).toBe(true);
    }

    for (const sample of samples) {
      expect(typeof exhaustiveNarrowing(sample)).toBe("string");
    }
  });
});
