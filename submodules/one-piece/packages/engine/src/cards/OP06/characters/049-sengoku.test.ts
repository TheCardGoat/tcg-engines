import { describe, test } from "vite-plus/test";
import { op06Sengoku049 } from "../../../../../cards/src/cards/characters/op06-049-sengoku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-049 Sengoku", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Sengoku049);
  });
});
