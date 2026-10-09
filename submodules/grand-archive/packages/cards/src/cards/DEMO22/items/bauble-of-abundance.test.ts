import { describe } from "vitest";
import { baubleOfAbundance } from "./bauble-of-abundance.ts";
import { proveBanishDraw } from "../../../testing/banish-draw.ts";
/** @covers Z9TCpaMJTc-a1 */
describe("bauble-of-abundance — banish and draw", () =>
  proveBanishDraw(baubleOfAbundance, "Z9TCpaMJTc-a1", false));
