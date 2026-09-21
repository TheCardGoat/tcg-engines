import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { gildasFaeswornMonarch } from "./gildas-faesworn-monarch.ts";

/** @covers g99PIuhU0O-a1 */
describe("Gildas, Faesworn Monarch — printed keywords", () => {
  proveKeywordGroup({
    card: gildasFaeswornMonarch,
    keywords: [
      {
        name: "stealth",
      },
      {
        name: "vigor",
      },
    ],
  });
});
