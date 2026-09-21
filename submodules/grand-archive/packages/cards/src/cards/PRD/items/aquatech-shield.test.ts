import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { aquatechShield } from "./aquatech-shield.ts";

/** @covers C89p0c3Sqb-a1 */
describe("AquaTech Shield — Link", () => {
  proveIntrinsicLink({
    card: aquatechShield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
