import { proveClassBonusEfficiency } from "../../../testing/class-bonus-efficiency.ts";
import { proveRestedEntry } from "../../../testing/rested-entry.ts";
import { describe } from "vitest";
import { artificersOpus } from "./artificers-opus.ts";

/** @covers G5E0PIUd0W-a2 */
describe("Artificer's Opus \u2014 resolution", () => {
  proveRestedEntry({ card: artificersOpus, cost: { kind: "reserve", amount: 8 } });
});

/** @covers G5E0PIUd0W-a1 */
describe("Artificer's Opus \u2014 resolution", () => {
  proveClassBonusEfficiency({ card: artificersOpus, printedCost: 8, attack: false });
});
