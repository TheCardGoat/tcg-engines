import { describe, test } from "vite-plus/test";
import { op09Uta002 } from "../../../../../cards/src/cards/characters/op09-002-uta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-002 Uta", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Uta002);
  });
});
