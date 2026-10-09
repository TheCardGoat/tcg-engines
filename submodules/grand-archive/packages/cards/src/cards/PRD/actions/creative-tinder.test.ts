import { describe } from "vitest";
import { creativeTinder } from "./creative-tinder.ts";
import { proveDrawThenDiscard } from "../../../testing/draw-then-discard.ts";

/** @covers KCXN59ldAi-a1 */
describe("creative-tinder — draw then discard", () => {
  proveDrawThenDiscard(creativeTinder, 2, 1);
});
