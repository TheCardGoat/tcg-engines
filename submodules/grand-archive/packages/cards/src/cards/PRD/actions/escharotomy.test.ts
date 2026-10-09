import { describe } from "vitest";
import { escharotomy } from "./escharotomy.ts";

import { proveEphemerateCard } from "../../../testing/ephemerate-card.ts";
/** @covers CIU4gT14EE-a2 */
describe("escharotomy — Ephemerate", () => {
  proveEphemerateCard({ card: escharotomy, ephemerateCost: 3, target: "player" });
});
