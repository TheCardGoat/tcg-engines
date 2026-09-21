import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { bloodDragonsPact } from "./blood-dragons-pact.ts";

/** @covers g23WBQW2Ro-a1 */
describe("Blood Dragon's Pact — Link", () => {
  proveIntrinsicLink({
    card: bloodDragonsPact,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
