import { describe } from "vitest";
import { imperialScout } from "./imperial-scout.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers nrow8iopvc-a1 */
describe("Imperial Scout Ranged", () => {
  proveRangedAlly({
    card: imperialScout,
    power: 1,
    ranged: 2,
    classBonus: false,
    declineOptionalDistantEffect: true,
  });
});
