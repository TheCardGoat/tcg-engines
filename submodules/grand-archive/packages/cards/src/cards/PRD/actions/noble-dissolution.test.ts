import { describe } from "vitest";
import { nobleDissolution } from "./noble-dissolution.ts";

import { proveDestructionAction } from "../../../testing/destruction-action.ts";
/** @covers iullthfLXc-a2 */
describe("Noble Dissolution — destruction", () => {
  proveDestructionAction({ card: nobleDissolution, kind: "phantasia", mode: "up-to-three" });
});
