import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { aquatechShell } from "./aquatech-shell.ts";

/** @covers QZT9pQQltw-a3 */
describe("AquaTech Shell — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: aquatechShell });
});

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers QZT9pQQltw-a1 */
describe("Aquatech Shell — Link", () => {
  proveIntrinsicLink({
    card: aquatechShell,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
