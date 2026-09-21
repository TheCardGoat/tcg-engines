import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { luBuIndomitableTitan } from "./lu-bu-indomitable-titan.ts";

/** @covers xyan7zbtxi-a1 */
describe("Lu Bu, Indomitable Titan — printed keywords", () => {
  proveKeywordGroup({
    card: luBuIndomitableTitan,
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
