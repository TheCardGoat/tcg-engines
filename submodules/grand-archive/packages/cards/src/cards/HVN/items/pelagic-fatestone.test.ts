import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { pelagicFatestone } from "./pelagic-fatestone.ts";

/** @covers tqkkyf4ktr-a1 */
describe("Pelagic Fatestone — entry draw", () => {
  proveOnEnterDraw({
    card: pelagicFatestone,
    abilityId: "tqkkyf4ktr-a1",
    cost: { kind: "reserve", amount: 4 },
    destination: "memory",
  });
});
