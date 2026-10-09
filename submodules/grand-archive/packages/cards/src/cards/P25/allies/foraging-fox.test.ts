import { describe } from "vitest";
import { proveLookRevealAndReturn } from "../../../testing/look-reveal-and-return.ts";
import { foragingFox } from "./foraging-fox.ts";
import { fatestoneOfRevelations } from "../items/fatestone-of-revelations.ts";
/** @covers b0ssellm84-a1 */
describe("foragingFox — On Enter reveals a qualifying card into memory", () => {
  proveLookRevealAndReturn(foragingFox, 5, 2, [fatestoneOfRevelations], "memory", "field");
});
