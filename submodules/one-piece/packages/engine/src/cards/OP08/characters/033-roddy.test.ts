import { describe, test } from "vite-plus/test";
import { op08Roddy033 } from "../../../../../cards/src/cards/characters/op08-033-roddy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-033 Roddy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Roddy033);
  });
});
