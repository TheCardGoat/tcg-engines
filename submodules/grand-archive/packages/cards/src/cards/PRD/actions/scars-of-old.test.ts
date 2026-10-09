import { describe } from "vitest";
import { scarsOfOld } from "./scars-of-old.ts";
import { proveDrawThenDiscard } from "../../../testing/draw-then-discard.ts";

/** @covers lD0sK81PZT-a1 */
describe("scars-of-old — draw then discard", () => {
  proveDrawThenDiscard(scarsOfOld, 1, 1);
});
