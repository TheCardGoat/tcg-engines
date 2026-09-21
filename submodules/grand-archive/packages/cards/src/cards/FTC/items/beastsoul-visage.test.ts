import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { beastsoulVisage } from "./beastsoul-visage.ts";

/** @covers 8asbierp5k-a1 */
describe("Beastsoul Visage — Link", () => {
  proveIntrinsicLink({
    card: beastsoulVisage,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
