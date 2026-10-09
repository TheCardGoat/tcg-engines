import { describe } from "vitest";
import { dwarfStarsGlow } from "./dwarf-stars-glow.ts";

import { proveStarcallingCard } from "../../../testing/starcalling-card.ts";
/** @covers zVubkJC3ce-a1 @covers zVubkJC3ce-a2 */
describe("dwarfStarsGlow Starcalling", () => proveStarcallingCard(dwarfStarsGlow, 1, "glow"));
