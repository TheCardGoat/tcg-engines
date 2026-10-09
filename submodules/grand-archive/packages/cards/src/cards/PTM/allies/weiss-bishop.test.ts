import { describe } from "vitest";
import { weissBishop } from "./weiss-bishop.ts";
import { proveDefenderDependentPower } from "../../../testing/defender-dependent-power.ts";
/** @covers Dgtim99eB5-a2 */
describe("Weiss Bishop odd-life attack bonus", () => {
  proveDefenderDependentPower(weissBishop, "odd-life", 1, "Alice");
  proveDefenderDependentPower(weissBishop, "odd-life", 0, "Other");
});

import { pawnPiece } from "../../PTM/tokens/pawn-piece.ts";
import { proveSupportedStealth } from "../../../testing/supported-stealth.ts";
/** @covers Dgtim99eB5-a1 */
describe("weissBishop — supported Stealth", () => {
  proveSupportedStealth(weissBishop, pawnPiece, false);
});
