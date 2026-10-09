import { proveLinkedStats } from "../../../testing/linked-stats.ts";
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

/** @covers eanbrfnrow-a3 */
describe("Blast Shield Class Bonus", () => {
  for (const classBonus of [false, true])
    proveLinkedStats({ card: blastShield, host: "ally", power: classBonus ? 2 : 0, classBonus });
});

import { provePhaseSelfDamage } from "../../../testing/phase-self-damage.ts";
/** @covers eanbrfnrow-a2 */
describe("blastShield phase damage", () =>
  provePhaseSelfDamage(blastShield, "recollection", 2, false, true));
