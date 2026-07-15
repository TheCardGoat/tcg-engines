import { describe, test } from "vite-plus/test";
import { op08YouCanTTakeOurKingThisEarlyInTheGame054 } from "../../../../../cards/src/cards/OP08/events/054-you-can-t-take-our-king-this-early-in-the-game.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-054 You Can't Take Our King This Early in the Game.", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08YouCanTTakeOurKingThisEarlyInTheGame054);
  });
});
