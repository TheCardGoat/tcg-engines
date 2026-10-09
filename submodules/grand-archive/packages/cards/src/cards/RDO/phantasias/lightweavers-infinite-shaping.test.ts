import { describe } from "vitest";
import { lightweaversInfiniteShaping } from "./lightweavers-infinite-shaping.ts";
import { proveEndSacrifice } from "../../../testing/end-sacrifice.ts";
/** @covers RBco1DfZ1B-a3 */
describe("Lightweaver's Infinite Shaping end sacrifice", () =>
  proveEndSacrifice(lightweaversInfiniteShaping, "RBco1DfZ1B-a3"));
