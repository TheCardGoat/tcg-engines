import { describe, test } from "vite-plus/test";
import { op03CharlotteLinlin114 } from "../../../../../cards/src/cards/characters/op03-114-charlotte-linlin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-114 Charlotte Linlin", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03CharlotteLinlin114);
  });
});
