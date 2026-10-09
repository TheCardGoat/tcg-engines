import { describe } from "vitest";
import { spiritShard } from "./spirit-shard.ts";
import { proveLevelSacrificeDraw } from "../../../testing/level-sacrifice-draw.ts";
/** @covers 3p5iqigcom-a1 */
describe("Spirit Shard's level-three sacrifice draw", () => {
  proveLevelSacrificeDraw(spiritShard, "3p5iqigcom-a1", 3);
});
