import { describe } from "vitest";
import { coriolisWard } from "./coriolis-ward.ts";
import { proveUnitDamagePrevention } from "../../../testing/unit-damage-prevention.ts";
/** @covers cagz0393zq-a1 */
describe("coriolisWard prevention", () => {
  for (const level of [0, 1, 3])
    proveUnitDamagePrevention({ card: coriolisWard, cost: 1, capacity: 1 + level, level });
});

import { proveShiftingCurrentConditional } from "../../../testing/shifting-current-conditionals.ts";
/** @covers cagz0393zq-a2 */
describe("Coriolis Ward — West memory draw", () =>
  proveShiftingCurrentConditional(coriolisWard, "draw"));
