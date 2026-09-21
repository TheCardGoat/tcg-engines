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
