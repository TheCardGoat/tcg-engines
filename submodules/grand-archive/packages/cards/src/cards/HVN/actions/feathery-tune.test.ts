import { describe } from "vitest";
import { featheryTune } from "./feathery-tune.ts";
import { fledgling } from "../../HVN/tokens/fledgling.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers 4hm8uzmf8v-a1 */
describe("featheryTune", () => {
  proveSummonAction({ card: featheryTune, cost: 3, tokens: [{ card: fledgling, count: 2 }] });
});
