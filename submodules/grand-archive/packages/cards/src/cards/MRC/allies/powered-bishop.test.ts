import { describe } from "vitest";
import { poweredBishop } from "./powered-bishop.ts";

import { proveDeathPowercell } from "../../../testing/death-powercell.ts";
/** @covers uesdu6o6ea-a2 */
describe("powered-bishop death Powercell", () =>
  proveDeathPowercell(poweredBishop, "uesdu6o6ea-a2"));
