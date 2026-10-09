import { describe } from "vitest";
import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionRw } from "./nameless-champion-rw.ts";
/** @covers foV3VG5iOr-a1 */
/** @covers foV3VG5iOr-a2 */
describe("nameless-champion-rw — level-up restriction and once-only draw", () => {
  proveNamelessChampion(namelessChampionRw);
});
