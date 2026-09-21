import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { flametechShield } from "./flametech-shield.ts";

/** @covers U7pILTDm3s-a1 */
describe("FlameTech Shield — Link", () => {
  proveIntrinsicLink({
    card: flametechShield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
