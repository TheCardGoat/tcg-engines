import { describe, test } from "vite-plus/test";
import { op08Sasaki082 } from "../../../../../cards/src/cards/characters/op08-082-sasaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-082 Sasaki", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Sasaki082);
  });
});
