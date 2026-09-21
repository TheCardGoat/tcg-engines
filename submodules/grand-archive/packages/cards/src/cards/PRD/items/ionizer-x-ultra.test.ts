import { describe } from "vitest";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { ionizerXUltra } from "./ionizer-x-ultra.ts";

/** @covers 1Hb6HXKXzG-a1 */
describe("Ionizer X Ultra — Link", () => {
  proveIntrinsicLink({
    card: ionizerXUltra,
    host: woodlandSquirrels,
    invalidHost: "champion",
  });
});
