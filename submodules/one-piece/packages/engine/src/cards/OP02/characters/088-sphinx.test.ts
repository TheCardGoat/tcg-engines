import { describe, test } from "vite-plus/test";
import { op02Sphinx088 } from "../../../../../cards/src/cards/OP02/characters/088-sphinx.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-088 Sphinx", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Sphinx088);
  });
});
