import { describe } from "vitest";
import { alizarinLongbowman } from "./alizarin-longbowman.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers inQV2nZfdJ-a2 */
describe("Alizarin Longbowman Ranged", () => {
  proveRangedAlly({
    card: alizarinLongbowman,
    power: 4,
    ranged: 3,
    classBonus: true,
    declineOptionalDistantEffect: "class-bonus",
  });
});
