import { describe, expect, it } from "bun:test";
import { mickeyMouseTrueFriend } from "./012-mickey-mouse-true-friend";

describe("Mickey Mouse - True Friend", () => {
  it("is a vanilla card with no rules text abilities", () => {
    expect(mickeyMouseTrueFriend.vanilla).toBe(true);
    expect(mickeyMouseTrueFriend.abilities).toBeUndefined();
  });
});
