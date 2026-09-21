import { describe, test } from "vite-plus/test";
import { op07Sanji064 } from "../../../../../cards/src/cards/characters/op07-064-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-064 Sanji", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Sanji064);
  });
});
