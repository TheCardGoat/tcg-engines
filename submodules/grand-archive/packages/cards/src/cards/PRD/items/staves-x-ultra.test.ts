import { describe } from "vitest";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { stavesXUltra } from "./staves-x-ultra.ts";

/** @covers 33mWk4HYLF-a1 */
describe("Staves X Ultra — Link", () => {
  proveIntrinsicLink({
    card: stavesXUltra,
    host: trainingSword,
    invalidHost: giantTortoise,
  });
});
