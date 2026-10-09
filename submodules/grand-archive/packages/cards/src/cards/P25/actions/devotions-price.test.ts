import { describe } from "vitest";
import { devotionsPrice } from "./devotions-price.ts";
import { proveAdditionalCardMoveCost } from "../../../testing/additional-card-move-cost.ts";
/** @covers ri955ygd5v-a1 */
describe("devotionsPrice — additional card payment", () => {
  proveAdditionalCardMoveCost(devotionsPrice, 2, false);
});
