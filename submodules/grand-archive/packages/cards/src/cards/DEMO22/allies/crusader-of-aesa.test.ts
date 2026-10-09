import { describe } from "vitest";
import { crusaderOfAesa } from "./crusader-of-aesa.ts";
import { proveRestedEntry } from "../../../testing/rested-entry.ts";
/** @covers 2Q60hBYO3i-a1 */
describe("Crusader of Aesa — rested entry", () => {
  proveRestedEntry({ card: crusaderOfAesa, cost: { kind: "reserve", amount: 3 } });
});
import { proveClassIntercept } from "../../../testing/class-intercept.ts";
/** @covers 2Q60hBYO3i-a2 */
describe("crusader-of-aesa — Class Bonus Intercept", () =>
  proveClassIntercept(crusaderOfAesa, "2Q60hBYO3i-a2"));
