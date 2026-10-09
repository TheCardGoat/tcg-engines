import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { winblessKiteshield } from "./winbless-kiteshield.ts";

/** @covers uoy5ttkat9-a2 */
describe("Winbless Kiteshield — Link", () => {
  proveIntrinsicLink({
    card: winblessKiteshield,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});

import { proveClassBonusMaterializationDiscount } from "../../../testing/class-bonus-materialization-discount.ts";

/** @covers uoy5ttkat9-a1 */
describe("winblessKiteshield — Class Bonus materialization discount", () => {
  proveClassBonusMaterializationDiscount(winblessKiteshield, true);
});

import { proveLinkedVigor } from "../../../testing/linked-vigor.ts";

/** @covers uoy5ttkat9-a3 */
describe("winblessKiteshield — linked Vigor", () => {
  proveLinkedVigor(winblessKiteshield, {});
  proveLinkedVigor(winblessKiteshield, { championHost: true });
});
