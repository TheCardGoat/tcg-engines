import { describe, test } from "vite-plus/test";
import { op07Sanji064 } from "../../../../../cards/src/cards/OP07/characters/064-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-064 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Sanji064);
  });
});
