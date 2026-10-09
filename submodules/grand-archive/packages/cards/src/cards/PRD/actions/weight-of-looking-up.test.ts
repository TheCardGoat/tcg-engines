import { describe } from "vitest";
import { weightOfLookingUp } from "./weight-of-looking-up.ts";
import { proveOptionalMaterialBanish } from "../../../testing/optional-material-banish.ts";
/** @covers i1BCY4T5fL-a1 */
describe("weight-of-looking-up — optional material banish", () =>
  proveOptionalMaterialBanish(weightOfLookingUp, false));
