import { describe, it } from "bun:test";

describe("Resolution: Replacement Effect Resolution", () => {
  // Replacement effects intercept and modify game events before they resolve.
  //
  // Test cases to cover:
  // 1. Replacement effect modifies damage before it is applied
  // 2. Only one replacement effect applies per event (no double-replacing)
  // 3. Replacement effect expiry: does not apply after its window
  // 4. Controller chooses which replacement to apply when multiple are eligible

  it.todo("should modify damage before it is applied", () => {});

  it.todo("should apply only one replacement effect per event", () => {});

  it.todo("should not apply replacement after its expiry window", () => {});

  it.todo("should let the controller choose when multiple replacements are eligible", () => {});
});
