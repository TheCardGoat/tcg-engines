import { describe } from "vitest";
import { cosmicFocus } from "./cosmic-focus.ts";

import { proveStarcallingCard } from "../../../testing/starcalling-card.ts";
/** @covers dWgPzoEbIE-a1 */
describe("cosmicFocus Starcalling", () => proveStarcallingCard(cosmicFocus, 0, "focus"));
