import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { forgedScalemail } from "./forged-scalemail.ts";

/** @covers 7lr2jiu66i-a1 */
describe("Forged Scalemail — Link", () => {
  proveIntrinsicLink({
    card: forgedScalemail,
    host: woodlandSquirrels,
    invalidHost: potionOfHealing,
  });
});
