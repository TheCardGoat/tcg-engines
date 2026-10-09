import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { describe } from "vitest";
import { journeysBeginning } from "./journeys-beginning.ts";

/** @covers 8ofid087a6-a1 */
describe("journeysBeginning draw", () => {
  proveDrawCardResolution({ card: journeysBeginning, destination: "hand" });
});

import { proveGuoJiaQuestAction } from "../../../testing/guo-jia-quest-action.ts";
/** @covers 8ofid087a6-a2 */
describe("journeysBeginning Guo Jia quest bonus", () => {
  proveGuoJiaQuestAction(journeysBeginning, 3, "draw");
});
