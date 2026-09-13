import { proveTargetPlayerAction } from "../../../testing/target-player-action.ts";
import { describe } from "vitest";
import { uncoverThePlot } from "./uncover-the-plot.ts";

/** @covers 4zkTRt8qXn-a1 @covers 4zkTRt8qXn-a2 */
describe("Uncover the Plot \u2014 resolution", () => {
  proveTargetPlayerAction({ card: uncoverThePlot, kind: "reveal", counterAmount: 2 });
});
