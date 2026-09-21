import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { theMajesticSpirit } from "./the-majestic-spirit.ts";

/** @covers tsvbgl6ffq-a1 */
describe("The Majestic Spirit — printed keywords", () => {
  proveKeywordGroup({
    card: theMajesticSpirit,
    keywords: [
      {
        name: "intercept",
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
