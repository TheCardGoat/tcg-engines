import { describe, test } from "vite-plus/test";
import { op08Wanda034 } from "../../../../../cards/src/cards/characters/op08-034-wanda.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-034 Wanda", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Wanda034);
  });
});
