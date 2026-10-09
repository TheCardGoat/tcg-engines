import { describe } from "vitest";
import { valiantProtector } from "./valiant-protector.ts";
import { proveClassBulwark } from "../../../testing/class-bulwark.ts";
/** @covers k21JAm6joz-a1 */
describe("Valiant Protector — class-gated Bulwark entry", () =>
  proveClassBulwark(valiantProtector));
