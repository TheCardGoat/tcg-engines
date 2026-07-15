import { describe, test } from "vite-plus/test";
import { op07York110 } from "../../../../../cards/src/cards/OP07/characters/110-york.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-110 York", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07York110);
  });
});
