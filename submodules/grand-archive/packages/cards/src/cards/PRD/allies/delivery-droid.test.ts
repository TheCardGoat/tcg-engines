import { describe } from "vitest";
import { deliveryDroid } from "./delivery-droid.ts";

import { proveDeathPowercell } from "../../../testing/death-powercell.ts";
/** @covers ziHdB4vzQH-a1 */
describe("delivery-droid death Powercell", () =>
  proveDeathPowercell(deliveryDroid, "ziHdB4vzQH-a1"));
