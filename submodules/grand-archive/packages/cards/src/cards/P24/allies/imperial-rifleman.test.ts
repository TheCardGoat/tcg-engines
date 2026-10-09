import { describe } from "vitest";
import { imperialRifleman } from "./imperial-rifleman.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers 17fzcyfrzr-a1 */
describe("Imperial Rifleman Ranged", () => {
  proveRangedAlly({ card: imperialRifleman, power: 1, ranged: 2, classBonus: false });
});
