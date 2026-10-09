import { describe } from "vitest";
import { breakTheLine } from "./break-the-line.ts";
import { proveOptionalMaterialBanish } from "../../../testing/optional-material-banish.ts";
/** @covers VXHLfbZ6AB-a1 @covers VXHLfbZ6AB-a2 */
describe("break-the-line — optional material banish", () =>
  proveOptionalMaterialBanish(breakTheLine, true));
