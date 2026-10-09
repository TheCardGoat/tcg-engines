import { describe } from "vitest";
import { crimsonRupture } from "./crimson-rupture.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers qeZRvGbXkF-a2 */
describe("Crimson Rupture — destruction", () => {
  proveDestructionAction({ card: crimsonRupture, kind: "equipment", mode: "single" });
});
