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

import { proveLinkedStats } from "../../../testing/linked-stats.ts";

/** @covers g23WBQW2Ro-a2 */
describe("Linked stat bonus", () => {
  proveLinkedStats({ card: bloodDragonsPact, host: "ally", power: 4, life: 4 });
});

import { provePhaseSelfDamage } from "../../../testing/phase-self-damage.ts";
/** @covers g23WBQW2Ro-a3 */
describe("bloodDragonsPact phase damage", () =>
  provePhaseSelfDamage(bloodDragonsPact, "end", 4, true, true));
