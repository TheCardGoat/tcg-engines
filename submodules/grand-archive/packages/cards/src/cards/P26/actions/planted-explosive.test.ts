import { describe } from "vitest";
import { plantedExplosive } from "./planted-explosive.ts";
import { provePreparedTargetAction } from "../../../testing/prepared-target-action.ts";
/** @covers 5X5W2Uda5a-a1
 * @covers 5X5W2Uda5a-a2
 */
describe("plantedExplosive", () => {
  provePreparedTargetAction({ card: plantedExplosive, targetId: "target-1", effect: "damage" });
});
