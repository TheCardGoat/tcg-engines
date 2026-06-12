import { describe, test } from "vite-plus/test";
import { op08Queen080 } from "../../../../../cards/src/cards/OP08/characters/080-queen.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-080 Queen", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Queen080);
  });
});
