import { describe } from "vitest";
import { lunarSeer } from "./lunar-seer.ts";

import { proveStarcallingCard } from "../../../testing/starcalling-card.ts";
/** @covers qjt0ooffy4-a1 */
describe("lunarSeer Starcalling", () => proveStarcallingCard(lunarSeer, 1, "ally"));
