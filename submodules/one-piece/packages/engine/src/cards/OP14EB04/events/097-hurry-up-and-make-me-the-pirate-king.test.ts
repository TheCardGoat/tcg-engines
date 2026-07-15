import { describe, test } from "vite-plus/test";
import { op14eb04HurryUpAndMakeMeThePirateKing097 } from "../../../../../cards/src/cards/OP14EB04/events/097-hurry-up-and-make-me-the-pirate-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-097 Hurry Up and Make Me the Pirate King!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04HurryUpAndMakeMeThePirateKing097);
  });
});
