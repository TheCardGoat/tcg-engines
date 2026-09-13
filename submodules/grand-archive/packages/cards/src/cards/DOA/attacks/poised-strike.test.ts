import { provePreparedAttack } from "../../../testing/prepared-attack.ts";
import { describe } from "vitest";
import { poisedStrike } from "./poised-strike.ts";

/** @covers mj3WSrghUH-a1 @covers mj3WSrghUH-a2 */
describe("Poised Strike \u2014 resolution", () => {
  provePreparedAttack({ card: poisedStrike, cost: 2, power: 3, wake: true });
});
