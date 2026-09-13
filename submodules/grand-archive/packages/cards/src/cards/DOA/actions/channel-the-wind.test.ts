import { proveChampionCounterAction } from "../../../testing/champion-counter-action.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { channelTheWind } from "./channel-the-wind.ts";

/** @covers 6YiMaCGsfV-a2 */
describe("Channel the Wind — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: channelTheWind });
});

/** @covers 6YiMaCGsfV-a1 */
describe("Channel the Wind \u2014 resolution", () => {
  proveChampionCounterAction({ card: channelTheWind, cost: 2, counter: "enlighten", amount: 1 });
});
