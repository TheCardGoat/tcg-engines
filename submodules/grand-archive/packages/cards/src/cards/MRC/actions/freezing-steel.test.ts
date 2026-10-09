import { describe } from "vitest";
import { freezingSteel } from "./freezing-steel.ts";
import { proveNextEntryRested } from "../../../testing/next-entry-rested.ts";
/** @covers x7mdk0xhi5-a1 */
describe("freezingSteel — next entry batch", () => {
  proveNextEntryRested({ card: freezingSteel, cost: 1, items: true });
});
