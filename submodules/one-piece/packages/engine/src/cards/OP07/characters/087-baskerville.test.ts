import { describe, test } from "vite-plus/test";
import { op07Baskerville087 } from "../../../../../cards/src/cards/characters/op07-087-baskerville.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-087 Baskerville", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Baskerville087);
  });
});
