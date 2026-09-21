import { describe, expect, it } from "vitest";

import { fabBotStrategyForPracticeMode } from "./practice-mode";

describe("FAB practice modes", () => {
  it("keeps the selected strategy for bot practice", () => {
    expect(fabBotStrategyForPracticeMode("bot", "value-extract")).toBe("value-extract");
  });

  it("disables automation for play-both-sides practice", () => {
    expect(fabBotStrategyForPracticeMode("self", "value-extract")).toBeNull();
  });
});
