import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { vaporjetShield } from "./vaporjet-shield.ts";

/** @covers y208kkz07n-a1 */
describe("Vaporjet Shield — Link", () => {
  proveIntrinsicLink({
    card: vaporjetShield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
