import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { lostProvidence } from "./lost-providence.ts";

/** @covers DNbIpzVgde-a1 */
describe("Lost Providence — printed keywords", () => {
  proveKeywordGroup({
    card: lostProvidence,
    keywords: [
      {
        name: "divine-relic",
      },
      {
        name: "hindered",
      },
    ],
  });
});
