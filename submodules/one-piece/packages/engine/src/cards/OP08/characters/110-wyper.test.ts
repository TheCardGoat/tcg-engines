import { describe, test } from "vite-plus/test";
import { op08Wyper110 } from "../../../../../cards/src/cards/characters/op08-110-wyper.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-110 Wyper", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Wyper110);
  });
});
