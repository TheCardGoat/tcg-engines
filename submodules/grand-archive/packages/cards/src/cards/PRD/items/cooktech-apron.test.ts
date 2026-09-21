import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { cooktechApron } from "./cooktech-apron.ts";

/** @covers oJIuGCrzPG-a1 */
describe("CookTech Apron — Link", () => {
  proveIntrinsicLink({
    card: cooktechApron,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
