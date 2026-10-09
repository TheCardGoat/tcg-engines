import { describe } from "vitest";
import { frostShard } from "./frost-shard.ts";
import { proveTargetStateDamage } from "../../../testing/target-state-damage.ts";
/** @covers jnsl7ddcgw-a2 */
describe("Frost Shard — rested unit damage", () => proveTargetStateDamage(frostShard, false, true));
