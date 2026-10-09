import { describe } from "vitest";
import { cellSharpshooter } from "./cell-sharpshooter.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers etaebjlwab-a1 */
describe("Cell Sharpshooter Ranged", () => {
  proveRangedAlly({ card: cellSharpshooter, power: 1, ranged: 2, classBonus: false });
});
