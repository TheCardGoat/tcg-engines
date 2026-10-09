import { describe } from "vitest";
import { eightOfHearts } from "./eight-of-hearts.ts";
import { proveCardistry, proveCardistryDrawReentry } from "../../../testing/cardistry.ts";
/** @covers YGz8gN8M69-a2 */
describe("eight-of-hearts — Cardistry", () =>
  proveCardistry({
    card: eightOfHearts,
    abilityId: "YGz8gN8M69-a2",
    sourceCost: 8,
    cost: 8,
    drawCount: 2,
    result: "draw-hand",
  }));

/** @covers YGz8gN8M69-a2 */
describe("eight-of-hearts — instance tracking", () =>
  proveCardistryDrawReentry(eightOfHearts, "YGz8gN8M69-a2", 8, 2, false));
