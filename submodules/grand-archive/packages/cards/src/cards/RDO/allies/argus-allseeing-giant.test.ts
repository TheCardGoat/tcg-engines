import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { argusAllseeingGiant } from "./argus-allseeing-giant.ts";

/** @covers 4GFKcHg9NU-a2 */
describe("Argus, All-Seeing Giant — printed keywords", () => {
  proveKeywordGroup({
    card: argusAllseeingGiant,
    keywords: [
      {
        name: "taunt",
      },
      {
        name: "true-sight",
      },
      {
        name: "vigor",
      },
    ],
  });
});
