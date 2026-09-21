import { describe, test } from "vite-plus/test";
import { op10DivineDeparture019 } from "../../../../../cards/src/cards/events/op10-019-divine-departure.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-019 Divine Departure", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10DivineDeparture019);
  });
});
