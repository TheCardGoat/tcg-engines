import { describe } from "vitest";
import { ducalSeal } from "./ducal-seal.ts";
import { proveAttackTax } from "../../../testing/attack-tax.ts";
/** @covers qFwqqT0XWo-a2 */
describe("ducal-seal attack cost", () => proveAttackTax(ducalSeal, "qFwqqT0XWo-a2", 3));
