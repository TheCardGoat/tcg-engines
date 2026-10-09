import { describe } from "vitest";
import { scorchedConquest } from "./scorched-conquest.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers HPDawzCDdr-a2 */
describe("Scorched Conquest — destruction", () => {
  proveDestructionAction({ card: scorchedConquest, kind: "domain", mode: "up-to-three" });
});
