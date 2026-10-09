import { describe } from "vitest";
import { fourOfDiamonds } from "./four-of-diamonds.ts";

import { proveRetortCard } from "../../../testing/retort-card.ts";
/** @covers NsnBhlVzTV-a1 */
describe("fourOfDiamonds Retort", () => proveRetortCard(fourOfDiamonds, 3));
