import { describe, test } from "vite-plus/test";
import { op13TheOneWhoIsTheMostFreeIsThePirateKing116 } from "../../../../../cards/src/cards/OP13/events/116-the-one-who-is-the-most-free-is-the-pirate-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-116 The One Who Is the Most Free Is the Pirate King!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13TheOneWhoIsTheMostFreeIsThePirateKing116);
  });
});
