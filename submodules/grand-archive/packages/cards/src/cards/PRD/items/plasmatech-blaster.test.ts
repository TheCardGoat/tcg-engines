import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { plasmatechBlaster } from "./plasmatech-blaster.ts";

/** @covers PAymR7JsNp-a1 */
describe("PlasmaTech Blaster — Link", () => {
  proveIntrinsicLink({
    card: plasmatechBlaster,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
