import { describe } from "vitest";
import { magusInitiate } from "./magus-initiate.ts";

import { proveEntryEmpower } from "../../../testing/entry-empower.ts";
/** @covers fZ08zyFIlz-a1 */
describe("magusInitiate class Empower", () => proveEntryEmpower(magusInitiate));

import { proveDeathDraw } from "../../../testing/death-draw.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
/** @covers fZ08zyFIlz-a2 */
describe("magusInitiate death draw", () =>
  proveDeathDraw({
    card: magusInitiate,
    abilityId: "fZ08zyFIlz-a2",
    attacker: ferventBeastmaster,
  }));
