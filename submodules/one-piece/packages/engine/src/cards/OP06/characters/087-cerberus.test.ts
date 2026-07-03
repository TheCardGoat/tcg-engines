import { describe, test } from "vite-plus/test";
import { op06Cerberus087 } from "../../../../../cards/src/cards/OP06/characters/087-cerberus.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-087 Cerberus", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Cerberus087);
  });
});
