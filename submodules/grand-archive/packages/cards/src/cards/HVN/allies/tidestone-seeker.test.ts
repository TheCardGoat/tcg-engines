import { describe } from "vitest";
import { tidestoneSeeker } from "./tidestone-seeker.ts";

import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
/** @covers fv1sjj2cgs-a1 */
describe("tidestoneSeeker class Glimpse", () => {
  for (const classBonus of [false, true])
    proveGlimpsePlay({
      card: tidestoneSeeker,
      cost: { kind: "reserve", amount: 2 },
      count: 3,
      classRestricted: true,
      classBonus,
      preparation: 0,
    });
});
