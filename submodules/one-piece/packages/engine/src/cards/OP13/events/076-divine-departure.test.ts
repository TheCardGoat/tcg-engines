import { describe, test } from "vite-plus/test";
import { op13DivineDeparture076 } from "../../../../../cards/src/cards/OP13/events/076-divine-departure.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-076 Divine Departure", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13DivineDeparture076);
  });
});
