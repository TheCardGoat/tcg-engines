import { describe } from "vitest";
import { swornWindhand } from "./sworn-windhand.ts";

import { proveClassTaunt } from "../../../testing/class-taunt.ts";
/** @covers 9ewgUjy34b-a1 */
describe("swornWindhand — class Taunt", () => {
  proveClassTaunt(swornWindhand);
});
