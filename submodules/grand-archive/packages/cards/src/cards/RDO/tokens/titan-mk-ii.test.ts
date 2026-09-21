import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { titanMkIi } from "./titan-mk-ii.ts";

/** @covers r79VgzA3W4-a1 */
describe("Titan Mk II — printed keywords", () => {
  proveKeywordGroup({
    card: titanMkIi,
    directField: true,
    keywords: [
      {
        name: "taunt",
      },
      {
        name: "vigor",
      },
    ],
  });
});
