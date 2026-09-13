import { describe } from "vitest";

import { proveGather } from "../../../testing/gather.ts";
import { automatedGardener } from "./automated-gardener.ts";

/** @covers xr93tig852-a1 */
describe("Automated Gardener — On Enter Gather", () => {
  proveGather({ card: automatedGardener, reserveCost: 3, classBonus: true });
});
