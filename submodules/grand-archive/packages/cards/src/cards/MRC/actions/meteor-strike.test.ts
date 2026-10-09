import { describe } from "vitest";
import { meteorStrike } from "./meteor-strike.ts";

import { proveStarcallingCard } from "../../../testing/starcalling-card.ts";
/** @covers dwavcoxpnj-a1 @covers dwavcoxpnj-a2 */
describe("meteorStrike Starcalling", () => proveStarcallingCard(meteorStrike, 3, "meteor"));
