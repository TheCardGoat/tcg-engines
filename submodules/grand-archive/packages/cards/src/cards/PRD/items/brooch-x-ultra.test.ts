import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { broochXUltra } from "./brooch-x-ultra.ts";

/** @covers 3Gx9ByIl9t-a1 */
describe("Brooch X Ultra — Link", () => {
  proveIntrinsicLink({
    card: broochXUltra,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
