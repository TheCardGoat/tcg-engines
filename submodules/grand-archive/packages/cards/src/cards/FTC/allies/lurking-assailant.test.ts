import { describe } from "vitest";
import { lurkingAssailant } from "./lurking-assailant.ts";

import { proveStateStealth } from "../../../testing/state-stealth.ts";
/** @covers uq2r6v374c-a1 */
describe("lurking-assailant — conditional Stealth", () => {
  proveStateStealth(lurkingAssailant, "awake");
});
