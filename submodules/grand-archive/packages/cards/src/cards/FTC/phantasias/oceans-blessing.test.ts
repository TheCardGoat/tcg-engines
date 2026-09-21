import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { oceansBlessing } from "./oceans-blessing.ts";

/** @covers 4muq2r6v37-a3 */
describe("Ocean's Blessing — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: oceansBlessing });
});

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers 4muq2r6v37-a1 */
describe("Ocean's Blessing — Link", () => {
  proveIntrinsicLink({
    card: oceansBlessing,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
