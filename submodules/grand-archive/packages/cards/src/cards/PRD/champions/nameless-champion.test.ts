import { describe } from "vitest";
import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampion } from "./nameless-champion.ts";
/** @covers LahboNoSRx-a1 */
/** @covers LahboNoSRx-a2 */
describe("nameless-champion — level-up restriction and once-only draw", () => {
  proveNamelessChampion(namelessChampion);
});
