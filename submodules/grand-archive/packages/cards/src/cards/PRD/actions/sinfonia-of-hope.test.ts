import { describe } from "vitest";
import { sinfoniaOfHope } from "./sinfonia-of-hope.ts";
import { proveTargetedAllyStat } from "../../../testing/targeted-ally-stat.ts";
/** @covers 7QmyDecqkk-a1 */

describe("sinfoniaOfHope — temporary ally bonus", () => {
  proveTargetedAllyStat({
    card: sinfoniaOfHope,
    property: "life",
    bonus: 2,
    targets: "one",
    human: false,
    extraCost: 0,
  });
});
