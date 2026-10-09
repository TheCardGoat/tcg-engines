import { describe } from "vitest";
import { plutusFortunesFavor } from "./plutus-fortunes-favor.ts";
import { proveAdditionalCardMoveCost } from "../../../testing/additional-card-move-cost.ts";
/** @covers bgbhr5vm38-a1 */
describe("plutusFortunesFavor — additional card payment", () => {
  proveAdditionalCardMoveCost(plutusFortunesFavor, 1, false);
});
