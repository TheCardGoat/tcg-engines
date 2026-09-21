import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { cooktechKnife } from "./cooktech-knife.ts";

/** @covers 6sZXj2SZW6-a1 */
describe("CookTech Knife — Link", () => {
  proveIntrinsicLink({
    card: cooktechKnife,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
