import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { blastShield } from "./blast-shield.ts";

/** @covers eanbrfnrow-a1 */
describe("Blast Shield — Link", () => {
  proveIntrinsicLink({
    card: blastShield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
