import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { protectiveHelm } from "./protective-helm.ts";

/** @covers l2ipxnctse-a1 */
describe("Protective Helm — Link", () => {
  proveIntrinsicLink({
    card: protectiveHelm,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
