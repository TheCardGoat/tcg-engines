import { describe, test } from "vite-plus/test";
import { op08Duval088 } from "../../../../../cards/src/cards/characters/op08-088-duval.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-088 Duval", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Duval088);
  });
});
