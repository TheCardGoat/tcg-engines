import { describe } from "vitest";
import { cellProduction } from "./cell-production.ts";
import { powercell } from "../../MRC/tokens/powercell.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers m6lGw6bQtb-a1 */
describe("cellProduction", () => {
  proveSummonAction({
    card: cellProduction,
    cost: 3,
    tokens: [{ card: powercell, count: 2 }],
    rested: true,
  });
});
