import { describe } from "vitest";
import { threeOfDiamonds } from "./three-of-diamonds.ts";

import { proveRetortCard } from "../../../testing/retort-card.ts";
/** @covers IZ2IiPsxe9-a1 */
describe("threeOfDiamonds Retort", () => proveRetortCard(threeOfDiamonds, 3));
