import { describe, test } from "vite-plus/test";
import { op07Tonjit067 } from "../../../../../cards/src/cards/characters/op07-067-tonjit.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-067 Tonjit", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Tonjit067);
  });
});
