import { describe } from "vitest";
import { bolsteringTempest } from "./bolstering-tempest.ts";
import { proveTargetedAllyStat } from "../../../testing/targeted-ally-stat.ts";
/** @covers PwHub76Fw4-a2 */
/** @covers PwHub76Fw4-a1 */
describe("bolsteringTempest — temporary ally bonus", () => {
  proveTargetedAllyStat({
    card: bolsteringTempest,
    property: "power",
    bonus: 3,
    targets: "any",
    human: true,
    extraCost: 2,
  });
});
