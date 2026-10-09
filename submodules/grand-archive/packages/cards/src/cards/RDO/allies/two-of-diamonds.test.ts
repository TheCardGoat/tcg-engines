import { describe } from "vitest";
import { twoOfDiamonds } from "./two-of-diamonds.ts";

import { proveRetortCard } from "../../../testing/retort-card.ts";
/** @covers mzwTQzuXZa-a1 */
describe("twoOfDiamonds Retort", () => proveRetortCard(twoOfDiamonds, 2));
