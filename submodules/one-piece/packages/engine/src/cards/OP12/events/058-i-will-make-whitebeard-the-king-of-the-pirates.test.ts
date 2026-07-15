import { describe, test } from "vite-plus/test";
import { op12IWillMakeWhitebeardTheKingOfThePirates058 } from "../../../../../cards/src/cards/OP12/events/058-i-will-make-whitebeard-the-king-of-the-pirates.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-058 I Will Make Whitebeard the King of the Pirates", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12IWillMakeWhitebeardTheKingOfThePirates058);
  });
});
