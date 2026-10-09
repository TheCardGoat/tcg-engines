import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { describe } from "vitest";
import { clearPastures } from "./clear-pastures.ts";

/** @covers y0jzczoywm-a2 */
describe("clearPastures draw", () => {
  proveDrawCardResolution({ card: clearPastures, destination: "memory" });
});

import { proveHorseConditionalAction } from "../../../testing/horse-conditional-action.ts";
/** @covers y0jzczoywm-a1 */
describe("Clear Pastures — Equestrian Glimpse", () =>
  proveHorseConditionalAction(clearPastures, true));
