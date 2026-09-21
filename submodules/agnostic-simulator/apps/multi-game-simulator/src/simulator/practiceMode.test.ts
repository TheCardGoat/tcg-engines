import { describe, expect, it } from "vitest";

import { parsePracticeMode, practiceModeFromSearch } from "./practiceMode";

describe("practice mode", () => {
  it.each([null, undefined, "", "ai", "unexpected"])("defaults %s to bot practice", (value) =>
    expect(parsePracticeMode(value)).toBe("bot"),
  );

  it("recognizes play-both-sides launches", () => {
    expect(practiceModeFromSearch("?mode=self&start=1")).toBe("self");
  });
});
