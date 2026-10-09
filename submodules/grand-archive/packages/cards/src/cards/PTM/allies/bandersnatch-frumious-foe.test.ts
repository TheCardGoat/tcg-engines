import { describe } from "vitest";
import { bandersnatchFrumiousFoe } from "./bandersnatch-frumious-foe.ts";

import { proveClassTaunt } from "../../../testing/class-taunt.ts";
/** @covers 4yqL9xtzVi-a1 */
describe("bandersnatchFrumiousFoe — class Taunt", () => {
  proveClassTaunt(bandersnatchFrumiousFoe);
});
