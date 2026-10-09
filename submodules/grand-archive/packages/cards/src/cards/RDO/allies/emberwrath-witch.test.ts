import { describe } from "vitest";
import { emberwrathWitch } from "./emberwrath-witch.ts";

import { proveEphemerateCard } from "../../../testing/ephemerate-card.ts";
/** @covers PptfA8gG6h-a2 */
describe("emberwrathWitch — Ephemerate", () => {
  proveEphemerateCard({ card: emberwrathWitch, ephemerateCost: 2, departure: "end-sacrifice" });
});

import { proveEndSacrifice } from "../../../testing/end-sacrifice.ts";
/** @covers PptfA8gG6h-a1 */
describe("Emberwrath Witch end sacrifice", () =>
  proveEndSacrifice(emberwrathWitch, "PptfA8gG6h-a1"));
