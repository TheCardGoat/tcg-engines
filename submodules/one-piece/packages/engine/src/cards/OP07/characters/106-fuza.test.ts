import { describe, test } from "vite-plus/test";
import { op07Fuza106 } from "../../../../../cards/src/cards/characters/op07-106-fuza.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-106 Fuza", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Fuza106);
  });
});
