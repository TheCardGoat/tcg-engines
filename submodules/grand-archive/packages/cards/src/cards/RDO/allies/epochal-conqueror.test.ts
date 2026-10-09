import { describe } from "vitest";
import { epochalConqueror } from "./epochal-conqueror.ts";

import { proveDefenderDependentPower } from "../../../testing/defender-dependent-power.ts";
/** @covers gR3LGjzKPS-a1 */
describe("epochalConqueror defender-dependent power", () => {
  proveDefenderDependentPower(epochalConqueror, "domain", 3);
});
