import { describe } from "vitest";
import { classicalOpening } from "./classical-opening.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers RSf7n45fhX-a1 */
describe("Classical Opening — Command", () => {
  proveCommandAttack({ card: classicalOpening });
});

import { proveEphemerateCard } from "../../../testing/ephemerate-card.ts";
/** @covers RSf7n45fhX-a2 */
describe("Classical Opening — Ephemerate", () => {
  proveEphemerateCard({ card: classicalOpening, ephemerateCost: 3, command: true });
});
