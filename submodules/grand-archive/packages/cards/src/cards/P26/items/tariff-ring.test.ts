import { describe } from "vitest";
import { tariffRing } from "./tariff-ring.ts";
import { proveAttackTax } from "../../../testing/attack-tax.ts";
/** @covers xnrw8qq1uw-a1 */
describe("tariff-ring attack cost", () => proveAttackTax(tariffRing, "xnrw8qq1uw-a1", 2));
