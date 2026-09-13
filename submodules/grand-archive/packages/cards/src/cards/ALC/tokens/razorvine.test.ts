import { describe } from "vitest";

import { proveCyclingHerb } from "../../../testing/cycling-herb.ts";
import { razorvine } from "./razorvine.ts";

/** @covers jnltv5klry-a1 */
describe("razorvine — cycle a hand card", () => {
  proveCyclingHerb({ card: razorvine, abilityId: "jnltv5klry-a1" });
});
