import { describe } from "vitest";
import { rearingRebound } from "./rearing-rebound.ts";
import { proveSuppressTargets } from "../../../testing/suppress-targets.ts";

/** @covers dbuoc8sm7z-a1 */
describe("rearing-rebound — suppression", () => {
  proveSuppressTargets(rearingRebound, "target-1", "ally");
});

import { proveHorseConditionalAction } from "../../../testing/horse-conditional-action.ts";
/** @covers dbuoc8sm7z-a2 */
describe("Rearing Rebound — Equestrian draw", () =>
  proveHorseConditionalAction(rearingRebound, false));
