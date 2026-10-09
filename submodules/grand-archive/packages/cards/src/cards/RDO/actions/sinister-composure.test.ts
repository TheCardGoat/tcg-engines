import { describe } from "vitest";
import { sinisterComposure } from "./sinister-composure.ts";

import { proveDrawAndPrepare } from "../../../testing/draw-and-prepare.ts";
/** @covers IcxG2jsqmu-a1 */
describe("sinisterComposure draw and preparation", () => {
  proveDrawAndPrepare(sinisterComposure, 2, 1, "none");
});
