import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { avatarOfGaia } from "./avatar-of-gaia.ts";

/** @covers fqsuo6gb0o-a1 */
describe("Avatar of Gaia — Link", () => {
  proveIntrinsicLink({
    card: avatarOfGaia,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
