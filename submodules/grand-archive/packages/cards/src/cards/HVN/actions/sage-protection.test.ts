import { describe } from "vitest";
import { sageProtection } from "./sage-protection.ts";
import { proveTargetedAllyStat } from "../../../testing/targeted-ally-stat.ts";
/** @covers fqsa372jii-a1 */

describe("sageProtection — temporary ally bonus", () => {
  proveTargetedAllyStat({
    card: sageProtection,
    property: "life",
    bonus: 1,
    targets: "three",
    human: false,
    extraCost: 0,
  });
});

import { proveTargetedClassCounter } from "../../../testing/targeted-class-counter.ts";
/** @covers fqsa372jii-a2 */
describe("Sage Protection — Class Bonus enlighten", () =>
  proveTargetedClassCounter(sageProtection, "enlighten", "optional-ally"));
