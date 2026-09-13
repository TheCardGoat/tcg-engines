import { expect, it } from "vitest";
import { applyReplayPatch } from "./replay-materializer";

it("plays historical array shrink patches without mutating the previous frame", () => {
  const initial = { hand: ["a", "b", "c", "d"], pitch: [] };
  expect(
    applyReplayPatch(initial, [
      { op: "replace", path: "/hand/1", value: "c" },
      { op: "replace", path: "/hand/2", value: "d" },
      { op: "replace", path: "/hand/length", value: 3 },
      { op: "add", path: "/pitch/0", value: "b" },
    ]),
  ).toEqual({ hand: ["a", "c", "d"], pitch: ["b"] });
  expect(initial.hand).toEqual(["a", "b", "c", "d"]);
});

it("does not interpret malformed array lengths as a valid replay transition", () => {
  expect(() =>
    applyReplayPatch({ hand: ["a"] }, [{ op: "replace", path: "/hand/length", value: 10 }]),
  ).toThrow("Invalid replay array path");
});
