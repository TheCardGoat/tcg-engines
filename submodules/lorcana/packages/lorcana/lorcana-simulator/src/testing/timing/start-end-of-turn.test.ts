import { describe, it } from "bun:test";

describe("Timing: Start and End of Turn", () => {
  // Turn phase timing determines when triggers fire and effects expire.
  //
  // Test cases to cover:
  // 1. Start-of-turn triggered abilities fire before the active player takes actions
  // 2. End-of-turn triggered abilities fire after the active player passes
  // 3. Multiple start-of-turn triggers resolve in the correct order
  // 4. Temporary effects expire at the correct turn boundary
  // 5. Readying characters happens at the correct timing window (start of turn)

  it.todo("should fire start-of-turn triggers before the active player acts", () => {});

  it.todo("should fire end-of-turn triggers after the active player passes", () => {});

  it.todo("should resolve multiple start-of-turn triggers in the correct order", () => {});

  it.todo("should expire temporary effects at the correct turn boundary", () => {});

  it.todo("should ready characters at the correct timing window", () => {});
});
