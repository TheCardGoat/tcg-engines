import { describe } from "vitest";
import { lesserBoonOfVirelai } from "./lesser-boon-of-virelai.ts";
import { proveBoonScavenge } from "../../../testing/boon-scavenge.ts";
import { anthemOfVitality } from "../../FTC/actions/anthem-of-vitality.ts";
import { songOfFrost } from "../../FTC/actions/song-of-frost.ts";
/** @covers RWJ0fztQK2-a1 */
describe("lesserBoonOfVirelai gain Scavenge", () =>
  proveBoonScavenge(lesserBoonOfVirelai, [anthemOfVitality, songOfFrost]));
