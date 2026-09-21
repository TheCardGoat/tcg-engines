import { describe } from "vitest";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { fracturedCrown } from "./fractured-crown.ts";

/** @covers suo6gb0op3-a1 */
describe("Fractured Crown — Link", () => {
  proveIntrinsicLink({
    card: fracturedCrown,
    host: "champion",
    invalidHost: giantTortoise,
  });
});
