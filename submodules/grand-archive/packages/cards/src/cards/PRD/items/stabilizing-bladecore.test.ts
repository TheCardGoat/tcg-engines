import { proveLinkedStats } from "../../../testing/linked-stats.ts";
import { describe } from "vitest";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { stabilizingBladecore } from "./stabilizing-bladecore.ts";

/** @covers CbPHWJ8Upd-a1 */
describe("Stabilizing BladeCore — Link", () => {
  proveIntrinsicLink({
    card: stabilizingBladecore,
    host: trainingSword,
    invalidHost: giantTortoise,
  });
});

/** @covers CbPHWJ8Upd-a2 */
describe("Stabilizing BladeCore Class Bonus", () => {
  for (const classBonus of [false, true])
    proveLinkedStats({
      card: stabilizingBladecore,
      host: "weapon",
      power: classBonus ? 2 : 0,
      classBonus,
    });
});
