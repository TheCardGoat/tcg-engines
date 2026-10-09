import { describe } from "vitest";
import { elucidatePlans } from "./elucidate-plans.ts";
import { proveRepeatedChampionCounterAction } from "../../../testing/champion-counter-action.ts";
/** @covers GoC1YaaCUV-a1 */

describe("elucidatePlans counters and payment", () => {
  proveRepeatedChampionCounterAction(elucidatePlans, "preparation", 2, 2, false);
});
