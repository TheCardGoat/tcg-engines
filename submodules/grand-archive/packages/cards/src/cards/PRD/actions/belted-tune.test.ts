import { describe } from "vitest";
import { beltedTune } from "./belted-tune.ts";
import { proveTargetedCounterAction } from "../../../testing/targeted-counter-action.ts";
/** @covers ko5PJRsy25-a1 */
describe("Belted Tune — ally buff counters", () => proveTargetedCounterAction(beltedTune, "buff"));
