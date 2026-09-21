import { describe, test } from "vite-plus/test";
import { op08Jozu047 } from "../../../../../cards/src/cards/characters/op08-047-jozu.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-047 Jozu", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Jozu047);
  });
});
