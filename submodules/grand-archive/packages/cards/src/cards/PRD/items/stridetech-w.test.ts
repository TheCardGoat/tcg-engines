import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { stridetechW } from "./stridetech-w.ts";

/** @covers rdI48Qb5mP-a1 */
describe("StrideTech W — Link", () => {
  proveIntrinsicLink({
    card: stridetechW,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
