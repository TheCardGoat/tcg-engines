import { describe, test } from "vite-plus/test";
import { op03Tilestone064 } from "../../../../../cards/src/cards/characters/op03-064-tilestone.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-064 Tilestone", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Tilestone064);
  });
});
