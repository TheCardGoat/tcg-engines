import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
import { describe } from "vitest";
import { zanderPreparedScout } from "./zander-prepared-scout.ts";

/** @covers T3CIBknts0-a1 */
describe("Zander, Prepared Scout \u2014 resolution", () => {
  proveGlimpsePlay({
    card: zanderPreparedScout,
    cost: { kind: "memory", amount: 1 },
    count: 2,
    preparation: 1,
  });
});
