import { describe } from "vitest";
import { siderealSpellshot } from "./sidereal-spellshot.ts";

import { proveElementAethercalling } from "../../../testing/element-aethercalling.ts";
/** @covers xwwkxq0vp3-a1 */
describe("sidereal-spellshot — Element Bonus Aethercalling", () =>
  proveElementAethercalling(siderealSpellshot));
