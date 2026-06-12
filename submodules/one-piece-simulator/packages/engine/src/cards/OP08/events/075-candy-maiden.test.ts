import { describe, test } from "vite-plus/test";
import { op08CandyMaiden075 } from "../../../../../cards/src/cards/OP08/events/075-candy-maiden.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-075 Candy Maiden", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CandyMaiden075);
  });
});
