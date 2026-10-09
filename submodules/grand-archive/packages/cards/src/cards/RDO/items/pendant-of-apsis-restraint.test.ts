import { describe } from "vitest";
import { pendantOfApsisRestraint } from "./pendant-of-apsis-restraint.ts";
import { proveFilteredCostScope } from "../../../testing/filtered-cost-scope.ts";
/** @covers FuPPK2ixjq-a1 */
describe("pendant-of-apsis-restraint — cost scope", () => {
  proveFilteredCostScope(pendantOfApsisRestraint, "ultimate");
});
