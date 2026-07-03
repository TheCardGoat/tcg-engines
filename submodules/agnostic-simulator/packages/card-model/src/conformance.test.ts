import { describe, expect, it } from "vitest";

import {
  CYBERPUNK_IS_BASE_CARD,
  GUNDAM_IS_BASE_CARD,
  LORCANA_IS_BASE_CARD,
  ONE_PIECE_IS_BASE_CARD,
  SWU_IS_BASE_CARD,
} from "./conformance.js";

/**
 * Runtime smoke for the cross-game `BaseCardDefinition` conformance guard in
 * `./conformance.ts`. The real enforcement is compile-time (tsc checks that
 * source file under `vp run check-types`); these assertions tie the guard to
 * the test suite so a wiring regression surfaces as a failing test as well.
 */
describe("cross-game BaseCardDefinition conformance", () => {
  it("every game's native card type is assignable to BaseCardDefinition", () => {
    expect(LORCANA_IS_BASE_CARD).toBe(true);
    expect(CYBERPUNK_IS_BASE_CARD).toBe(true);
    expect(GUNDAM_IS_BASE_CARD).toBe(true);
    expect(ONE_PIECE_IS_BASE_CARD).toBe(true);
    expect(SWU_IS_BASE_CARD).toBe(true);
  });
});
