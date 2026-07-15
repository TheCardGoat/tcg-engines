import { describe, expect, test } from "vite-plus/test";

import { shouldWaitForAiAnimations } from "./aiStatus";

describe("shouldWaitForAiAnimations", () => {
  test("lets fast AI continue while animations are pending", () => {
    expect(shouldWaitForAiAnimations("fast", true, false)).toBe(false);
  });

  test.each(["balanced", "slow"] as const)("waits for animations at %s speed", (speed) => {
    expect(shouldWaitForAiAnimations(speed, true, false)).toBe(true);
  });

  test.each(["fast", "balanced", "slow"] as const)(
    "allows %s AI to continue once animations finish",
    (speed) => {
      expect(shouldWaitForAiAnimations(speed, false, false)).toBe(false);
    },
  );

  test.each(["balanced", "slow"] as const)(
    "allows %s AI to continue after the animation wait expires",
    (speed) => {
      expect(shouldWaitForAiAnimations(speed, true, true)).toBe(false);
    },
  );
});
