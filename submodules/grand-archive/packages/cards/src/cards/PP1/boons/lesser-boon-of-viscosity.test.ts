import { describe } from "vitest";
import { lesserBoonOfViscosity } from "./lesser-boon-of-viscosity.ts";
import { proveBoonScavenge } from "../../../testing/boon-scavenge.ts";
import { convokingSlime } from "../../MRC/allies/convoking-slime.ts";
import { slimecallCyclone } from "../../RDO/phantasias/slimecall-cyclone.ts";
/** @covers 2LArvOxz5L-a1 */
describe("lesserBoonOfViscosity gain Scavenge", () =>
  proveBoonScavenge(lesserBoonOfViscosity, [convokingSlime, slimecallCyclone]));
