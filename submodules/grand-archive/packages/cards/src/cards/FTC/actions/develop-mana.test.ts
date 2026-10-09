import { describe } from "vitest";
import { developMana } from "./develop-mana.ts";
import { proveRepeatedChampionCounterAction } from "../../../testing/champion-counter-action.ts";
/** @covers wzh973fdt8-a1 */

describe("developMana counters and payment", () => {
  proveRepeatedChampionCounterAction(developMana, "level", 1, 3, false);
});
