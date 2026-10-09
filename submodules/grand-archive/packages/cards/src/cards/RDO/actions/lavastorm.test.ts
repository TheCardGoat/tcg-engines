import { describe } from "vitest";
import { lavastorm } from "./lavastorm.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers 7K9pWqEc20-a2 */
describe("Lavastorm — destruction", () => {
  proveDestructionAction({ card: lavastorm, kind: "ally", mode: "all" });
});
