import { describe } from "vitest";
import { reactivateDrone } from "./reactivate-drone.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers xWqduqhMNp-a1 */
describe("reactivateDrone", () => {
  proveSummonAction({
    card: reactivateDrone,
    cost: 2,
    tokens: [{ card: automatonDrone, count: 1 }],
    rested: true,
    buff: 1,
  });
});

import { proveEphemerateCard } from "../../../testing/ephemerate-card.ts";
/** @covers xWqduqhMNp-a2 */
describe("reactivateDrone — Ephemerate", () => {
  proveEphemerateCard({ card: reactivateDrone, ephemerateCost: 2 });
});
