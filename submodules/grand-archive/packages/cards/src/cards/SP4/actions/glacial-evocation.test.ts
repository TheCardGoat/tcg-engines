import { describe } from "vitest";
import { glacialEvocation } from "./glacial-evocation.ts";
import { proveTargetStateDamage } from "../../../testing/target-state-damage.ts";
/** @covers mr1lmsbjcf-a1 */
describe("Glacial Evocation — rested ally damage", () =>
  proveTargetStateDamage(glacialEvocation, false));
