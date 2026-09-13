import { describe } from "vitest";

import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionTw } from "./nameless-champion-tw.ts";

/** @covers 98i5ak5nwo-a1 */
/** @covers 98i5ak5nwo-a2 */
describe("nameless champion tw — can't level up and once-per-instance (6)", () => {
  proveNamelessChampion(namelessChampionTw);
});
