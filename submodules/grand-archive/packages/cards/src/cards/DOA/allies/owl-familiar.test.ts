import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
import { describe } from "vitest";
import { owlFamiliar } from "./owl-familiar.ts";

/** @covers WShYN9M3lU-a1 */
describe("Owl Familiar \u2014 resolution", () => {
  proveGlimpsePlay({
    card: owlFamiliar,
    cost: { kind: "reserve", amount: 1 },
    count: 2,
    classRestricted: true,
    classBonus: true,
  });
});

describe("disabled or zero boundary", () => {
  proveGlimpsePlay({
    card: owlFamiliar,
    cost: { kind: "reserve", amount: 1 },
    count: 2,
    classRestricted: true,
    classBonus: false,
  });
});
