import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
import { describe } from "vitest";
import { fairyWhispers } from "./fairy-whispers.ts";

/** @covers n8wyfG9hbY-a1 @covers n8wyfG9hbY-a2 */
describe("Fairy Whispers \u2014 resolution", () => {
  proveGlimpsePlay({
    card: fairyWhispers,
    cost: { kind: "reserve", amount: 1 },
    count: 3,
    windDraw: true,
  });
});
