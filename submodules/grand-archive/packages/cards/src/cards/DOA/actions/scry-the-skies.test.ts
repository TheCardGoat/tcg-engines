import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
import { describe } from "vitest";
import { scryTheSkies } from "./scry-the-skies.ts";

/** @covers F9POfB5Nah-a1 */
describe("Scry the Skies \u2014 resolution", () => {
  proveGlimpsePlay({
    card: scryTheSkies,
    cost: { kind: "reserve", amount: 1 },
    count: 2,
    level: 2,
    draw: "memory",
  });
});

describe("disabled or zero boundary", () => {
  proveGlimpsePlay({
    card: scryTheSkies,
    cost: { kind: "reserve", amount: 1 },
    count: 0,
    level: 0,
    draw: "memory",
  });
});
