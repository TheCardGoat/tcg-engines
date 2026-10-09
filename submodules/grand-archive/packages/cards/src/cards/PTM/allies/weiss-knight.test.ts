import { describe } from "vitest";
import { weissKnight } from "./weiss-knight.ts";

import { proveCommandedWill } from "../../../testing/commanded-will.ts";
/** @covers IBXLKkBUe1-a1 */
describe("weissKnight — Commanded Will", () => {
  proveCommandedWill(weissKnight, 1);
});
