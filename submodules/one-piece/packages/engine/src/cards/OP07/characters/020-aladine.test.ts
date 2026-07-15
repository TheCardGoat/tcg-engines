import { describe, test } from "vite-plus/test";
import { op07Aladine020 } from "../../../../../cards/src/cards/OP07/characters/020-aladine.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-020 Aladine", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Aladine020);
  });
});
