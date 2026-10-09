import { describe } from "vitest";
import { hemorrhagedIntimidation } from "./hemorrhaged-intimidation.ts";
import { proveRecollectionDraw } from "../../../testing/recollection-draw.ts";
/** @covers PR4OkzJBVr-a1
 * @covers PR4OkzJBVr-a2
 */
describe("hemorrhagedIntimidation draw", () => {
  proveRecollectionDraw(hemorrhagedIntimidation, false);
});
