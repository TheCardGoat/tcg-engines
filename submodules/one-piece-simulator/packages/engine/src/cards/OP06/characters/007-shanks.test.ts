import { describe, test } from "vite-plus/test";
import { op06Shanks007 } from "../../../../../cards/src/cards/OP06/characters/007-shanks.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-007 Shanks", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Shanks007);
  });
});
