import { describe } from "vitest";
import { peerBeyond } from "./peer-beyond.ts";

import { proveEphemerateCard } from "../../../testing/ephemerate-card.ts";
/** @covers 54ebGqHpLO-a2 */
describe("peerBeyond — Ephemerate", () => {
  proveEphemerateCard({ card: peerBeyond, ephemerateCost: 1, target: "unit" });
});
