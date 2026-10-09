import { describe } from "vitest";
import { hauntingApparition } from "./haunting-apparition.ts";

import { proveEphemerateCard } from "../../../testing/ephemerate-card.ts";
/** @covers UtwWXmc0IU-a2 */
describe("hauntingApparition — Ephemerate", () => {
  proveEphemerateCard({ card: hauntingApparition, ephemerateCost: 5, departure: "combat" });
});

import { proveEphemeralStealth } from "../../../testing/ephemeral-stealth.ts";
/** @covers UtwWXmc0IU-a1 */
describe("haunting-apparition — ephemeral Stealth", () => {
  proveEphemeralStealth(hauntingApparition, 5);
});
