import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { aeneanFluxGenerator } from "./aenean-flux-generator.ts";

/** @covers oCqKBEPemA-a1 */
describe("Aenean Flux Generator — entry draw", () => {
  proveOnEnterDraw({
    card: aeneanFluxGenerator,
    abilityId: "oCqKBEPemA-a1",
    cost: { kind: "reserve", amount: 3 },
    destination: "memory",
  });
});
