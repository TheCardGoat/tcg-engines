import { describe } from "vitest";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { flametechBladecore } from "./flametech-bladecore.ts";

/** @covers aAJliPQT3F-a1 */
describe("FlameTech BladeCore — Link", () => {
  proveIntrinsicLink({
    card: flametechBladecore,
    host: trainingSword,
    invalidHost: giantTortoise,
  });
});
