import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { prototypeShield } from "./prototype-shield.ts";

/** @covers zadf9q1vk8-a1 */
describe("Prototype Shield — Link", () => {
  proveIntrinsicLink({
    card: prototypeShield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
