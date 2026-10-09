import { describe } from "vitest";
import { goldenPawn } from "./golden-pawn.ts";

import { proveDeathDraw } from "../../../testing/death-draw.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
/** @covers Lewf9sfv9m-a2 */
describe("goldenPawn death draw", () =>
  proveDeathDraw({ card: goldenPawn, abilityId: "Lewf9sfv9m-a2", attacker: ferventBeastmaster }));
