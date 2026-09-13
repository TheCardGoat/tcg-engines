import { proveTargetPlayerAction } from "../../../testing/target-player-action.ts";
import { describe } from "vitest";
import { setTheTraps } from "./set-the-traps.ts";

/** @covers xipHhhsgJy-a1 @covers xipHhhsgJy-a2 */
describe("Set the Traps \u2014 resolution", () => {
  proveTargetPlayerAction({ card: setTheTraps, kind: "mill", counterAmount: 1 });
});
