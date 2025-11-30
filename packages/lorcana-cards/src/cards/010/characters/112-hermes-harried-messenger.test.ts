import { describe, expect, it } from "bun:test";
import { hasRush } from "@tcg/lorcana";
import { hermesHarriedMessenger } from "./112-hermes-harried-messenger";

describe("Hermes - Harried Messenger", () => {
  it("should have Rush ability", () => {
    expect(hasRush(hermesHarriedMessenger)).toBe(true);
  });
});
