import { describe } from "vitest";
import { ritaiBerserker } from "./ritai-berserker.ts";
import { proveCurrentDirectionStats } from "../../../testing/current-direction-stats.ts";
/** @covers xrbffkghwt-a1 */
describe("ritaiBerserker — direction stats", () => {
  proveCurrentDirectionStats(ritaiBerserker, false);
});
