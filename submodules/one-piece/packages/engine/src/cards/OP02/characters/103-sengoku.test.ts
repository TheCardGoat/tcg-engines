import { describe, test } from "vite-plus/test";
import { op02Sengoku103 } from "../../../../../cards/src/cards/OP02/characters/103-sengoku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-103 Sengoku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sengoku103);
  });
});
