import { describe } from "vitest";
import { esteemedKnight } from "./esteemed-knight.ts";
import { proveClassIntercept } from "../../../testing/class-intercept.ts";
/** @covers iabqeB0I6t-a1 */
describe("esteemed-knight — Class Bonus Intercept", () =>
  proveClassIntercept(esteemedKnight, "iabqeB0I6t-a1"));
