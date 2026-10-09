import { describe } from "vitest";
import { proveNamelessChampion } from "../../../testing/nameless-champion.ts";
import { namelessChampionMt } from "./nameless-champion-mt.ts";
/** @covers K7jYO9IibV-a1 */
/** @covers K7jYO9IibV-a2 */
describe("nameless-champion-mt — level-up restriction and once-only draw", () => {
  proveNamelessChampion(namelessChampionMt);
});
