import { describe } from "vitest";
import { pyreticPrognosis } from "./pyretic-prognosis.ts";
import { proveDrawThenDiscard } from "../../../testing/draw-then-discard.ts";

/** @covers Q5HV9nWS5r-a1 */
describe("pyretic-prognosis — draw then discard", () => {
  proveDrawThenDiscard(pyreticPrognosis, 3, 2);
});
