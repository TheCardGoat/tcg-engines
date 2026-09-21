import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { fanOfSevenDebts } from "./fan-of-seven-debts.ts";

/** @covers k9zhw0gbov-a1 */
describe("Fan of Seven Debts — entry draw", () => {
  proveOnEnterDraw({
    card: fanOfSevenDebts,
    abilityId: "k9zhw0gbov-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
