import { describe } from "vitest";
import { lesserBoonOfIsis } from "./lesser-boon-of-isis.ts";

import { proveClassLockedBoon } from "../../../testing/class-locked-boon.ts";
/** @covers GlqhpkmflM-a1 */
describe("Lesser Boon of Isis — Class Locked", () => {
  proveClassLockedBoon(lesserBoonOfIsis);
});
