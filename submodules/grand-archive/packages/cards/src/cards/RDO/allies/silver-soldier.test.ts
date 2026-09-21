import { describe } from "vitest";

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";
import { silverSoldier } from "./silver-soldier.ts";

/** @covers c3C6PjX0Vt-a2 */
describe("Silver Soldier — printed keywords", () => {
  proveKeywordGroup({
    card: silverSoldier,
    keywords: [
      {
        name: "retort",
        value: 2,
      },
      {
        name: "vigor",
      },
    ],
  });
});
