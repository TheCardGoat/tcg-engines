import { proveChampionCounterAction } from "../../../testing/champion-counter-action.ts";
import { describe } from "vitest";
import { acceptedContract } from "./accepted-contract.ts";

/** @covers uZCyXDNJ6I-a1 */
describe("Accepted Contract \u2014 resolution", () => {
  proveChampionCounterAction({
    card: acceptedContract,
    cost: 5,
    counter: "preparation",
    amount: 3,
  });
});
