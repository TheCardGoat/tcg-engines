import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { essenceCrucible } from "./essence-crucible.ts";

/** @covers DF5Ffwv7DJ-a1 */
describe("Essence Crucible — entry draw", () => {
  proveOnEnterDraw({
    card: essenceCrucible,
    abilityId: "DF5Ffwv7DJ-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
