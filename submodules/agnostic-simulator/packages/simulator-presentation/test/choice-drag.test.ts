import { describe, it, expect } from "vitest";
import {
  placeChoice,
  choiceProblems,
  removeChoice,
  type ChoiceSlot,
} from "../src/choice-drag-model";
const slots: ChoiceSlot[] = [
  { id: "white", label: "White", accepts: ["w"], min: 1, max: 1 },
  { id: "any", label: "Any", accepts: ["w", "r"], min: 1, max: 1 },
];
describe("shared choice draft", () => {
  it("rejects an illegal color and a full slot without changing the draft", () => {
    const draft = { white: ["w"] };
    expect(placeChoice(slots, draft, "r", "white")).toBe(draft);
    expect(placeChoice(slots, draft, "missing", "any")).toBe(draft);
  });
  it("moves a resource rather than spending it twice", () => {
    const moved = placeChoice(slots, { white: ["w"] }, "w", "any");
    expect(moved).toEqual({ white: [], any: ["w"] });
    expect(choiceProblems(slots, moved)).toHaveLength(1);
  });
  it("validates total payment and duplicate protection", () => {
    expect(choiceProblems(slots, { white: ["w"], any: ["r"] })).toEqual([]);
    expect(choiceProblems(slots, { white: ["w"], any: ["w"] })).not.toEqual([]);
  });
  it("inserts an ordered entry and preserves every other card", () => {
    const ordered: ChoiceSlot[] = [
      { id: "top", label: "Top", accepts: ["a", "b", "c"], min: 0, max: 3, ordered: true },
      { id: "bottom", label: "Bottom", accepts: ["a", "b", "c"], min: 0, max: 3, ordered: true },
    ];
    expect(placeChoice(ordered, { top: ["a", "b"], bottom: ["c"] }, "c", "top", "a")).toEqual({
      top: ["c", "a", "b"],
      bottom: [],
    });
    expect(placeChoice(ordered, { top: ["a", "b"], bottom: [] }, "a", "top")).toEqual({
      top: ["b", "a"],
      bottom: [],
    });
  });
  it("removes a selection without changing unrelated slots", () =>
    expect(removeChoice({ white: ["w"], any: ["r"] }, "w")).toEqual({ white: [], any: ["r"] }));
  it("rejects unknown destinations and tampered draft keys", () => {
    const draft = {};
    expect(placeChoice(slots, draft, "w", "unknown")).toBe(draft);
    expect(choiceProblems(slots, { white: ["w"], any: ["r"], hidden: [] })).not.toEqual([]);
  });
});
