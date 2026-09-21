import { describe } from "vitest";

import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
import { fatedKeepsake } from "./fated-keepsake.ts";

/** @covers vi1uyifw6s-a1 */
describe("Fated Keepsake — entry draw", () => {
  proveOnEnterDraw({
    card: fatedKeepsake,
    abilityId: "vi1uyifw6s-a1",
    cost: { kind: "memory", amount: 1 },
  });
});
