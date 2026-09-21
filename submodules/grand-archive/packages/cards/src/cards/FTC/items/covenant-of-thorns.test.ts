import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { covenantOfThorns } from "./covenant-of-thorns.ts";

/** @covers 1vt1cn1tzg-a2 */
describe("Covenant of Thorns — Link", () => {
  proveIntrinsicLink({
    card: covenantOfThorns,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
