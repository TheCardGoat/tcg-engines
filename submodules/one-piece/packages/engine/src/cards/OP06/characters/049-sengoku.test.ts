import { describe, test } from "vite-plus/test";
import { op06Sengoku049 } from "../../../../../cards/src/cards/OP06/characters/049-sengoku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-049 Sengoku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Sengoku049);
  });
});
