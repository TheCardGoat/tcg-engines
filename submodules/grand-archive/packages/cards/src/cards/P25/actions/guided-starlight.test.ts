import { describe } from "vitest";
import { guidedStarlight } from "./guided-starlight.ts";
import { proveOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers b0iz7wm7ow-a3 */
describe("guided-starlight — optional Aetherwing loading", () => {
  proveOptionalAetherwingLoad(guidedStarlight);
});

import { proveElementAethercalling } from "../../../testing/element-aethercalling.ts";
/** @covers b0iz7wm7ow-a1 */
describe("guided-starlight — Element Bonus Aethercalling", () =>
  proveElementAethercalling(guidedStarlight));
