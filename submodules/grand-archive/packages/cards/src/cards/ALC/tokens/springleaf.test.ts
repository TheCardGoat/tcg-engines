import { describe } from "vitest";

import { proveCyclingHerb } from "../../../testing/cycling-herb.ts";
import { springleaf } from "./springleaf.ts";

/** @covers 69iq4d5vet-a1 */
describe("springleaf — cycle a hand card", () => {
  proveCyclingHerb({ card: springleaf, abilityId: "69iq4d5vet-a1" });
});
