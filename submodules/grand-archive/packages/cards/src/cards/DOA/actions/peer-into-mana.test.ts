import { proveChampionCounterAction } from "../../../testing/champion-counter-action.ts";
import { describe } from "vitest";
import { peerIntoMana } from "./peer-into-mana.ts";

/** @covers 914hZjxDL0-a1 */
describe("Peer into Mana \u2014 resolution", () => {
  proveChampionCounterAction({
    card: peerIntoMana,
    cost: 4,
    counter: "enlighten",
    amount: 2,
    level: 0,
  });
});

describe("level scaling", () => {
  proveChampionCounterAction({
    card: peerIntoMana,
    cost: 4,
    counter: "enlighten",
    amount: 5,
    level: 3,
  });
});
