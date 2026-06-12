import { describe, expect, test } from "bun:test";
import { privateField } from "./private-field";

describe("privateField", () => {
  test("wraps a value with explicit viewer ids", () => {
    expect(privateField(["card-1", "card-2"], ["player-1"])).toEqual({
      __private: true,
      value: ["card-1", "card-2"],
      visibleTo: ["player-1"],
    });
  });
});
