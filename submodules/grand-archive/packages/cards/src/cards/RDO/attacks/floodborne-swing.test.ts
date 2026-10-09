import { describe } from "vitest";
import { floodborneSwing } from "./floodborne-swing.ts";
import { proveWaterGraveyardPower } from "../../../testing/water-graveyard-power.ts";
/** @covers 5wLtoxd4Wc-a1 */
describe("Floodborne Swing — Deluge power", () =>
  proveWaterGraveyardPower(floodborneSwing, 3, 4, false));
