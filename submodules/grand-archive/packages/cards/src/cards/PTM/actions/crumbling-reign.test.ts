import { describe } from "vitest";
import { crumblingReign } from "./crumbling-reign.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers EFelNCz3Zv-a2 */
describe("Crumbling Reign — destruction", () => {
  proveDestructionAction({ card: crumblingReign, kind: "equipment", mode: "single" });
});
