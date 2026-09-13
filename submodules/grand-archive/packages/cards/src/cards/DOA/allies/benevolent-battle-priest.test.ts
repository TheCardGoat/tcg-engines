import { proveOnAttackRecover } from "../../../testing/on-attack-recover.ts";
import { describe } from "vitest";
import { benevolentBattlePriest } from "./benevolent-battle-priest.ts";

/** @covers 776yt8UxhU-a1 */
describe("Benevolent Battle Priest \u2014 resolution", () => {
  proveOnAttackRecover({
    card: benevolentBattlePriest,
    abilityId: "776yt8UxhU-a1",
    amount: 1,
    classRestricted: true,
  });
});
