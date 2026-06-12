import { describe, test } from "vite-plus/test";
import { op09Koala103 } from "../../../../../cards/src/cards/OP09/characters/103-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-103 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Koala103);
  });
});
