import { describe, test } from "vite-plus/test";
import { op01GreenStarRafflesia028 } from "../../../../../cards/src/cards/events/op01-028-green-star-rafflesia.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-028 Green Star Rafflesia", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01GreenStarRafflesia028);
  });
});
