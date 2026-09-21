import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { gusttechShield } from "./gusttech-shield.ts";

/** @covers MTm7r2KOSS-a1 */
describe("GustTech Shield — Link", () => {
  proveIntrinsicLink({
    card: gusttechShield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
