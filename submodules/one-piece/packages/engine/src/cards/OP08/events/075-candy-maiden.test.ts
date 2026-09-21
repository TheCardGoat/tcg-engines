import { describe, test } from "vite-plus/test";
import { op08CandyMaiden075 } from "../../../../../cards/src/cards/events/op08-075-candy-maiden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-075 Candy Maiden", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CandyMaiden075);
  });
});
