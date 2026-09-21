import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { markOfFervor } from "./mark-of-fervor.ts";

/** @covers 80mttsvbgl-a1 */
describe("Mark of Fervor — Link", () => {
  proveIntrinsicLink({
    card: markOfFervor,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
