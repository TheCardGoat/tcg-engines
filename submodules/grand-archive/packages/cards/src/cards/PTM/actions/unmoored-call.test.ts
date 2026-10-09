import { describe } from "vitest";
import { unmooredCall } from "./unmoored-call.ts";
import { proveRecollectionDraw } from "../../../testing/recollection-draw.ts";
/** @covers etobC7HEHw-a1
 * @covers etobC7HEHw-a3
 */
describe("unmooredCall draw", () => {
  proveRecollectionDraw(unmooredCall, true);
});
