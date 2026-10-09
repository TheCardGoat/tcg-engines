import { describe } from "vitest";
import { lesserBoonOfScriveners } from "./lesser-boon-of-scriveners.ts";
import { proveBoonScavenge } from "../../../testing/boon-scavenge.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { slimecallCyclone } from "../../RDO/phantasias/slimecall-cyclone.ts";
/** @covers nJOde7e1Xc-a1 */
describe("lesserBoonOfScriveners gain Scavenge", () =>
  proveBoonScavenge(lesserBoonOfScriveners, [glacialGuidance, slimecallCyclone]));
