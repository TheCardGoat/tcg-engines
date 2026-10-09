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

import { proveLinkedStats } from "../../../testing/linked-stats.ts";

/** @covers 6sZXj2SZW6-a2 */
describe("Linked stat bonus", () => {
  proveLinkedStats({ card: cooktechKnife, host: "ally", power: 1, life: 0 });
});
