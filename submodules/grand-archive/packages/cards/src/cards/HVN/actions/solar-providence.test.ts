import { describe } from "vitest";
import { solarProvidence } from "./solar-providence.ts";
import { proveDrawThenDiscard } from "../../../testing/draw-then-discard.ts";

/** @covers gnj9hi5ult-a1 */
describe("solar-providence — draw then discard", () => {
  proveDrawThenDiscard(solarProvidence, 1, 1);
});
