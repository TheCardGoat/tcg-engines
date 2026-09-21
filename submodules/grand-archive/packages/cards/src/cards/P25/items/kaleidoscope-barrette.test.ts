import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { kaleidoscopeBarrette } from "./kaleidoscope-barrette.ts";

/** @covers qktid6zlyt-a1 */
describe("Kaleidoscope Barrette — entry draw", () => {
  proveOnEnterDraw({
    card: kaleidoscopeBarrette,
    abilityId: "qktid6zlyt-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
