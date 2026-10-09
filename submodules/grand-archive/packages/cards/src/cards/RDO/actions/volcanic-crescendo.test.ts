import { describe } from "vitest";
import { volcanicCrescendo } from "./volcanic-crescendo.ts";
import { proveGraveyardEmpower } from "../../../testing/graveyard-empower.ts";
/** @covers W3FveBmY0Z-a1 */
/** @covers W3FveBmY0Z-a2 */
describe("Volcanic Crescendo — graveyard Empower and Harmonize", () =>
  proveGraveyardEmpower(volcanicCrescendo, 3, true));
