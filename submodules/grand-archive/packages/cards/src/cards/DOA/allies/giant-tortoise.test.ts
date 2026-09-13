import { proveVanillaAlly } from "../../../testing/vanilla-ally.ts";
import { describe } from "vitest";
import { giantTortoise } from "./giant-tortoise.ts";

/** @covers-card L0RmNaDzhk */
describe("Giant Tortoise \u2014 resolution", () => {
  proveVanillaAlly({ card: giantTortoise, cost: 4, power: 1, life: 6 });
});
