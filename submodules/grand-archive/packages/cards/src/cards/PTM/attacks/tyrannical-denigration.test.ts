import { describe } from "vitest";
import { tyrannicalDenigration } from "./tyrannical-denigration.ts";

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers OjOcXBiO0b-a1 */
describe("Tyrannical Denigration — Kindle", () => {
  proveKindle(tyrannicalDenigration, 7);
});
