import { describe } from "vitest";
import { siroccoOperative } from "./sirocco-operative.ts";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";
/** @covers t7ru41pzgg-a1 */
describe("siroccoOperative — Class Bonus entry draw", () => {
  proveOnEnterDraw({
    card: siroccoOperative,
    abilityId: "t7ru41pzgg-a1",
    cost: { kind: "reserve", amount: 3 },
    destination: "memory",
    classBonus: true,
  });
});
